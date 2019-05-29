angular.module('App').controller('needBuyPageCtl',function(appUtils,enterViewLoad,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.paramsDate=$stateParams.date;	
	
	// 轮播
	$scope.currentAdSlideIndex=0;
	$scope.changeAdSlide=function(index){
		$scope.currentAdSlideIndex=index;
	}
	
	// 改城市
	var backTop=false;
	$rootScope.$on('appUtilsCityChange',function(event,value){
		backTop=true;
	})
	$scope.$on('$ionicView.enter',function(){
		$scope.initData();
		if(backTop){
			$ionicScrollDelegate.$getByHandle('need-buy-page-Scroll').scrollTop();
			backTop=false;
		}
	})

	//二手房加载 
	$scope.needBuyArr=[]
	$scope.initData = function(){
		$scope.queryData={
			sort:-1,
			cityId:appUtils.city.id
		}
		$http.get($Factory.HouseNeed.publicquery.url,{
			params:$scope.queryData
		}).then(function(resData){
			$scope.$broadcast('scroll.refreshComplete')
			$scope.needBuyArr=resData.data;	
		}).catch(function(){
			$scope.$broadcast('scroll.refreshComplete')
			enterViewLoad.customload('获取数据失败')
		})

	}
	
})