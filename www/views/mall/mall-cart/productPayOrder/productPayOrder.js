angular.module('App').controller('productPayOrderCtl',function($cartChoosedData,enterViewLoad,appUtils,$ionicModal,$state,$location,$localStorage,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.goCart=function(){
		$state.go('mallCart')
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.choosedBankCard = $localStorage.choosedPayBankCard
		// 支付方式
		$scope.typeChoosed=1;
		// 订单
		$scope.paramsData={
			TradeNo: $stateParams.tradeno,
			Total: $stateParams.total,
			UsedScore:$stateParams.usedscore,
			UsedVoucher:$stateParams.usedvoucher,
			IsMuilt: $stateParams.ismuilt=='true'?true:false,
			Password:"",//余额支付
		}
	})

	$scope.changeTypeChoose=function(type){
		$scope.typeChoosed=type;
	}
	// 验证码modal
	$ionicModal.fromTemplateUrl('mall_cardpay_code_modal', {
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
	
	$scope.confirmPay=function(){
		if($scope.typeChoosed==1){// 微信
			$http.post($Factory.OderPay.wxpay.url,$scope.paramsData)
				.then(function(resData){
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
							$scope.goCart()
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
					var msg = (err.data&&err.data.Message) || '生成微信订单失败'
					enterViewLoad.customload(msg);
				})
		}else if($scope.typeChoosed==2){// 支付宝
			$http.post($Factory.OderPay.alipay.url,$scope.paramsData)
				.then(function(resData){
					$scope.aliPayInfo=resData.data.Request;
					$scope.aliTrade=resData.data.TradeNO;
		
					appUtils.AliPay($scope.aliPayInfo,function(suc){
						enterViewLoad.customload('支付成功');
						$timeout(function(){
							$scope.goCart();
						},1500)
						$http.post($Factory.OderPay.query.url,$scope.aliTrade)
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
					var msg = (err.data&&err.data.Message) || '生成支付宝订单失败'
					enterViewLoad.customload(msg);
				})
		}else if($scope.typeChoosed==3){//银行卡
			$http.post($Factory.OderPay.allapplyconsume.url,{
				TradeNo: $stateParams.tradeno,
				Total: $stateParams.total,
				IsMuilt: $stateParams.ismuilt=='true' ? true : false,
				CardNo:$scope.choosedBankCard.bankCardNo,
				ReturnUrl: $location.url(),
			}).then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					$scope.showAuthCodeModal()
					$scope.allinData=JSON.parse(resData.data.return_msg);
					// 银行卡支付
					$scope.confirmCardData.BizOrderNo = $scope.allinData.bizOrderNo
					$scope.confirmCardData.TradeNo = $scope.allinData.tradeNo
				}else{
					var msg = resData.data.return_msg ||'生成银联订单失败'
					enterViewLoad.customload(msg);
				}
			}).catch(function(err){
				enterViewLoad.customload('生成银联订单失败');
			})
		}else if($scope.typeChoosed==4){//余额
			// $scope.typeChoosed=3
			$scope.showAuthCodeModal()
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
		
		$http.post($Factory.OderPay.allpay.url,realData)
			.then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					enterViewLoad.customload('支付成功')
					$timeout(function(){
						$scope.back()
					},1500)
				}else{
					enterViewLoad.customload(resData.data.return_msg)
				}
			}).catch(function() {
				enterViewLoad.customload('支付失败')
			})
	}	

	$scope.balancePay=function(){
		$scope.closeAuthCodeModal();
		// 余额支付
		$http.post($Factory.OderPay.consumeproduct.url,$scope.paramsData)
			.then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					enterViewLoad.customload('支付成功')
					$timeout(function(){
						$scope.back();
					},1500)
				}else{
					var loadMsg =  (resData.data&&resData.data.return_msg)?resData.data.return_msg:'付款失败'
					enterViewLoad.customload(loadMsg);
				}
			}).catch(function(err){
				var loadMsg =  err.data.Message?err.data.Message:'付款失败'
				enterViewLoad.customload(loadMsg);
			})
	}
})

