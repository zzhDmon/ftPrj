angular.module('App').controller('refundDetailCtl',function(enterViewLoad,appUtils,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()
	})
	// 房产时报
	$scope.loadhousetimes=function(){
		$http.post($Factory.News.query.url,{type:1,pagenum:0,pagesize:4})
			.then(function(resData){
				$scope.housetimesList=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取房产时报失败')
			})
	}

	
})