angular.module('App').controller('logisticsDetailsCtl',function(enterViewLoad,appUtils,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
		$scope.paramsData={
			id:$stateParams.id,
			done:$stateParams.done
		}
	})

	$scope.loadData=function(){
		$http.post($Factory.ProductOrder.tracequery.url+'?TradeNo='+$stateParams.id)
			.then(function(resData){
				$scope.resData=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取房产时报失败')
			})
	}

		
})