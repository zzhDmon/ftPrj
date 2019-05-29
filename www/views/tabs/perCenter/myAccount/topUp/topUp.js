
angular.module('App').controller('topUpCtl',function(enterViewLoad,appUtils,$location,$localStorage,$ionicModal,$rootScope,$ionicHistory,$timeout,$scope,$state,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	
	
	$scope.$on('$ionicView.enter',function(){
		$scope.choosedBankCard=$localStorage.choosedPayBankCard
		$rootScope.$on('chooseBankCardSuccess',function(target,value){
			$scope.choosedBankCard=value;
		})
	})
	
	$scope.subData={
		money:''
	}
	
	// 验证码
	$ionicModal.fromTemplateUrl('topup_auth_code_modal', {
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
	}

	$scope.payType={
		type:1
	}
	$scope.choosePayType=function(){
		$scope.showModal()
	}
	//选择列表立即支付 
	$scope.Pay=function(){
		// return
		if($scope.payType.type==1){
			// WxPay
			$http.post($Factory.WxPay.unifiedorder.url
				+'?yearsOrFee='+
				$scope.subData.money.toFixed(2)*100
				+'&OrderPayType=1'
				,11).then(function(resData){
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
				$scope.subData.money.toFixed(2)*100
				+'&OrderPayType=1'
				,11).then(function(resData){
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
			$http.post($Factory.Allin.applydeposit.url,{
				ProductId:11,
				Fee:$scope.subData.money.toFixed(2)*100,
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
			
		}
	}



	$scope.payNow=function (params){
		if(!$scope.choosedBankCard){
			enterViewLoad.customload('请选择银行卡')
			return
		}
		$http.post($Factory.Allin.applydeposit.url,{
			ProductId:11,
			Fee:$scope.subData.money.toFixed(2)*100,
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
						$scope.back()
					},1500)
				}else{
					enterViewLoad.customload(resData.data.return_msg || '支付失败')
				}
			}).catch(function() {
				enterViewLoad.customload('支付失败')
			})
	}

})
