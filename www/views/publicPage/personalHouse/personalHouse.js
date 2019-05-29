
angular.module('App').controller('personalHouseCtl',function(appUtils,enterViewLoad,$localStorage,$rootScope,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$stateParams,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
	})		
	$scope.activeIndex=$stateParams.type?$stateParams.type-1:0;
	$scope.switchSlide =function(index){
		$scope.activeIndex=index;
	}
	$scope.loadData=function(){
		// 二手房
		$http.get($Factory.NewHouseSource.publicquery.url,{params:{pagesize:100,pagenum:0,cityId:1,Type:1,userid:$stateParams.id,date:6}})
			.then(function(resData){
				$scope.myOldList=resData.data;
			})
		// 租房
		$http.get($Factory.NewHouseSource.publicquery.url,{params:{pagesize:100,pagenum:0,cityId:1,Type:2,userid:$stateParams.id,date:6}})
			.then(function(resData){
				$scope.myRentList=resData.data;
			})
	
		// 商铺
		$http.post($Factory.SimpleHouse.publicquery.url,{pagesize:100,pagenum:0,cityId:1,Type:1,userid:$stateParams.id,date:6})
			.then(function(resData){
				console.log(resData)
				$scope.myShopList=resData.data;
			})
		// 写字楼
		$http.post($Factory.SimpleHouse.publicquery.url,{pagesize:100,pagenum:0,cityId:1,Type:2,userid:$stateParams.id,date:6})
			.then(function(resData){
				console.log(resData)
				$scope.myOfficList=resData.data;
			})
	}

})
