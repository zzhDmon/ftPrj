
angular.module('App').controller('payVipCtl',function(enterViewLoad,appUtils,$ionicPopup,$location,$window,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$interval,$timeout,$scope,$rootScope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.productId=$stateParams.productid;
	$scope.vipName=$stateParams.vipname;

	$scope.$on('$ionicView.enter',function(){
		if($rootScope.fromStateName=='tabs.topUp'){
			$scope.showModal()
		}
	})	
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.closeModal()
	})	
	// 应付金额
	$scope.shoulePay=($stateParams.price/100).toFixed(2)*1;

	$scope.initBalance=function(reload){
		// 账户余额
		$http.post($Factory.Money.money.url)
			.then(function(resData){
				if(reload)enterViewLoad.customload('刷新成功')
				$scope.myBalance=((resData.data.Total)/100).toFixed(2) *1;
			}).catch(function(err){
			})
		// vip余额
		$http.post($Factory.ReChange.surplus.url).then(function(resData){
			$scope.surplusMoney=resData.data;
			$scope.shoulePay=(($stateParams.price - resData.data)/100).toFixed(2)*1
		})
	}
	$scope.initBalance();

	// 年份没有小数
	$scope.yearValue=1
	$scope.inputYear=function() {
		this.yearValue = this.yearValue.replace(/\D/g, '');
		$scope.yearValue=this.yearValue
	}
// 节流
	// var timeout;
    // $scope.$watch('yearValue', function(inputText){
    // 	if(inputText){
    // 		if(timeout) {
    // 			$timeout.cancel(timeout);
    // 		}
	// 		timeout = $timeout(function(){
	// 			$scope.shoulePay=(($stateParams.price*inputText - $scope.surplusMoney)/100).toFixed(2)
	// 		},500)
    // 	}
    // })

	$scope.choosedBankCard=$localStorage.choosedPayBankCard
	$rootScope.$on('chooseBankCardSuccess',function(target,value){
		$scope.choosedBankCard=value;
	})
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.closeModal()
		$scope.closeAuthCodeModal()
	})
	
	// 卡列表
	$ionicModal.fromTemplateUrl('vip_pay_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	// 验证码
	$ionicModal.fromTemplateUrl('pay_auth_code_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.codeModal = modal;
	});
	$scope.showAuthCodeModal=function(){
		$scope.codeModal.show();	
	}
	$scope.closeAuthCodeModal=function(){
		$scope.codeModal.hide();
		$scope.endCountDownNum()
	}
	
	//验证码倒计时 
	$scope.showCountDown=false;
	$scope.countDownNum=60;
	
	$scope.startCountDown=function(){
		$scope.showCountDown=true;
		$scope.clock = $interval(function(){
			$scope.countDownNum--
			if($scope.countDownNum<1){
				$scope.endCountDownNum()
			}
		},1000);
	}
	$scope.endCountDownNum=function(){
		$scope.showCountDown=false;
		if($scope.clock){
			$scope.countDownNum=60;
			$interval.cancel($scope.clock);
		}
	}
// 协议
	$scope.agreeProtocol=true;
	$scope.siwtchAgreeStatus=function(){
		$scope.agreeProtocol=!$scope.agreeProtocol;
	}

	$scope.payType={
		type:0
	}
	$scope.choosePayType=function(){
		if(!$scope.agreeProtocol){
			enterViewLoad.customload('您还未同意房田会员协议',2000)
			return
		}
		$scope.showModal()
	}
	//立即支付 
	$scope.Pay=function(){
		$scope.closeModal();
		// return
		if($scope.payType.type==1){
			// WxPay
			$http.post($Factory.WxPay.unifiedorder.url
				+'?yearsOrFee='+
				$scope.yearValue
				+'&OrderPayType='+2
				,$scope.productId).then(function(resData){
					$scope.resData=JSON.parse(resData.data);
					$scope.wechatPayParams = {
						partnerid: $scope.resData.partnerid, 
						prepayid: $scope.resData.prepayid, 
						noncestr: $scope.resData.noncestr, 
						timestamp: $scope.resData.timestamp, 
						sign: $scope.resData.sign, 
					};
					
					appUtils.WxPay($scope.wechatPayParams,function(suc){
						enterViewLoad.customload('支付成功');
						$timeout(function(){
							$scope.back();
						},1500)
						$http.post($Factory.WxPay.query.url,$scope.resData.trade_no)
							.then(function(res){
								if(res.data.return_code==="SUCCESS"){
									// 数据库保存订单
								}else if(res.data.return_code==="FAIL"){
									
								}
							})
					},function(err){
						if(err=="用户点击取消并返回"){
							enterViewLoad.customload('您取消了订单');
			
							$http.post($Factory.WxPay.close.url,$scope.resData.trade_no)
								.then(function(res){
									if(res.data.return_code==="SUCCESS"){
										// 订单关闭
									}
								})
							return
						}
						enterViewLoad.customload(err);
					});
				}).catch(function(err){
					enterViewLoad.customload('生成订单失败');
				})
		}else if($scope.payType.type==2){
			// AliPay
			$http.post($Factory.AliPay.unifiedorder.url
				+'?yearsOrFee='+
				$scope.yearValue
				+'&OrderPayType='+2
				,$scope.productId).then(function(resData){
					$scope.aliPayInfo=resData.data.Request;
					$scope.aliTrade=resData.data.TradeNO;

					appUtils.AliPay($scope.aliPayInfo,function(suc){
						enterViewLoad.customload('支付成功');
						$timeout(function(){
							$scope.back();
						},1500)

						$http.post($Factory.AliPay.query.url,$scope.aliTrade)
							.then(function(res){
								if(res.data.return_code==="SUCCESS"){
									// 数据库保存订单
								}else if(res.data.return_code==="FAIL"){
									
								}
							})
					},function(err){
						if(err.resultStatus==4000){
							enterViewLoad.customload('支付失败');
						}else if(err.resultStatus==6001){
							enterViewLoad.customload('您取消了订单');
							
						}else if(err.resultStatus==6002){
							enterViewLoad.customload('网络连接失败');
							
						}
					})
				}).catch(function(err){
					enterViewLoad.customload('生成订单失败');
				})
		}else if($scope.payType.type==3){
			$http.post($Factory.Allin.applyconsume.url,{
				ProductId:$scope.productId,
				Years:$scope.yearValue,
				Fee:$scope.shoulePay*100,
				CardNo:$scope.choosedBankCard.bankCardNo,
				ReturnUrl: $location.url(),
			}).then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					$scope.showAuthCodeModal()
					$scope.allinData=JSON.parse(resData.data.return_msg);
					// 银行卡支付
					$scope.confirmCardData.BizOrderNo = $scope.allinData.bizOrderNo
					$scope.confirmCardData.TradeNo = $scope.allinData.tradeNo
				}
			}).catch(function(err){
				enterViewLoad.customload('生成银联订单失败');
			})
		}else if($scope.payType.type==0){
			
			// 余额支付
			$http.post($Factory.Money.consumeuser.url,{
					Fee:$scope.shoulePay*100,
					Years:$scope.yearValue,
					productId:$scope.productId}).then(function(resData){
						enterViewLoad.customload('支付成功')
						$timeout(function(){
							$scope.back();
						},1500)
					}).catch(function(err){
						var loadMsg =  err.data.Message?err.data.Message:'付款失败'
						enterViewLoad.customload(loadMsg);
					})
		}else if($scope.payType.type==4){
			$localStorage.vipOrderToBePaid={
				Fee:$scope.shoulePay*100,
				Years:$scope.yearValue,
				productId:$scope.productId,
				vipName:$scope.vipName
			}
			$state.go('myAccount')
		}
	}
	
	// 银行卡支付
	$scope.confirmCardData={
		BizOrderNo:'',
		TradeNo:'',
		Code:null
	}
	$scope.confirmCardPay=function(){
		$scope.closeAuthCodeModal()
		var realData = JSON.parse(JSON.stringify($scope.confirmCardData))
		
		$scope.confirmCardData.BizOrderNo = '';
		$scope.confirmCardData.TradeNo = '';
		$scope.confirmCardData.Code = null;
		
		$http.post($Factory.Allin.mpay.url,realData)
			.then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					enterViewLoad.customload('支付成功')
					$timeout(function(){
						$scope.back();
					},1500)
					$timeout(function(){
						$scope.back()
					},1500)
				}else{
					enterViewLoad.customload(resData.data.return_msg || '支付失败')
				}
			}).catch(function() {
				enterViewLoad.customload('支付失败')
			})
	}

/*
	修改网易云信Vip
*/ 
	$scope.updateNimVip=function(){
		var custom={
			vip:''
		}
		if($scope.vipName=='个人会员'){
			custom.vip='白银'
		}else if($scope.vipName=='团队首领'){
			custom.vip='黄金'
		}else if($scope.vipName=='商户老板'){
			custom.vip='铂金'
		}else if($scope.vipName=='企业主'){
			custom.vip='钻石'
		}
		nim.updateMyInfo({
			custom: JSON.stringify(custom),
			done: updateMyInfoDone
		});
		function updateMyInfoDone(error, user){
			if(!error){
			}else{		
			}
		}
	}
	
})
.filter('cutStr', function () {
  return function (value) {
    if (!value){
    	return ''
    } ;

    var result;
    result = value.slice(0,-3) 

    return result;
  };
});
