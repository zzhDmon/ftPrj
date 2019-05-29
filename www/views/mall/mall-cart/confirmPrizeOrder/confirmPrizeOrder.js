angular.module('App').controller('confirmPrizeOrderCtl',function(enterViewLoad,appUtils,$cookies,$localStorage,$state,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		// 收货地址
		appUtils.getReceiptAddress(function(res){
			$scope.receiptAddress=res
		})
		$scope.totalMoney=0
		$http.post($Factory.ProductOrder.carts.url,[$stateParams])
		.then(function(resData){
			for(var i=0;i<resData.data[0].CartProductInfos.length;i++){
				$scope.totalMoney += resData.data[0].CartProductInfos[i].UnitPrice * resData.data[0].CartProductInfos[i].Quantity
			}
			$scope.productList = resData.data;
		}).catch(function(err){
			enterViewLoad.customload((err.data&&err.data.Message) || '获取购物车失败')
		})
		// 余额
		$http.post($Factory.Money.money.url)
			.then(function(resData){
				// resData.data.Scores = 1000
				$scope.pageData=resData.data;
				$ionicLoading.hide();
			}).catch(function(err){
				
			})	
			
	})

	
	// 提交订单
	$scope.createOrder=function(){
		if(!$scope.receiptAddress){
			enterViewLoad.customload('请选择地址')
			return
		}
		$http.post($Factory.ProductOrder.newerpacket.url,
			{
				"ProductId": $stateParams.ProductId,
				"ProductSKUId": $stateParams.ProductSKUId,
				"Quantity": 1,
				"Total": 0,
				"UseVoucher": $scope.totalMoney,
				"Address": $scope.receiptAddress.Province+$scope.receiptAddress.City+
				$scope.receiptAddress.District+$scope.receiptAddress.Street+$scope.receiptAddress.Address
				
			}).then(function(resData){		
				enterViewLoad.customload('兑换成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(err){
				var msg = (err.data&&err.data.Message) || '兑换失败'
				enterViewLoad.customload(msg)
			})
	}
})

