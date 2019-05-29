angular.module('App').controller('houseSourceCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}

	// 改城市
	var backTop=false;
	$rootScope.$on('appUtilsCityChange',function(event,value){
		backTop=true;
	})

	$scope.$on('$ionicView.enter',function(){
		$scope.initData();
		if(backTop){
			$ionicScrollDelegate.$getByHandle('house-source-Scroll').scrollTop();
			backTop=false;
		}
	})
	$scope.initData=function(){
		$http.get($Factory.NewHouseSource.counts.url).then(function(resData){
			$scope.countsData=resData.data
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
		//二手房加载 加载十条
		$scope.oldQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
			pagenum:0,
			type:1,
			query:'',
			district:'',
			street:'',
			minprize:'',
			maxprize:'',
			roomType:'',
			sort:'',
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.oldQueryData})
		.then(function(resData){
			$scope.oldhousearr=resData.data;
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
	}
})