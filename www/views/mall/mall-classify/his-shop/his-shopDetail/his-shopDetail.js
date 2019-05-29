angular.module('App').controller('hisShopDetailCtl',function(enterViewLoad,appUtils,$ionicSlideBoxDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
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