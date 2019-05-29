angular.module('App').controller('ershouPageCtl',function(appUtils,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.paramsDate=$stateParams.date;	

	// 改城市
	var backTop=false;
	$rootScope.$on('appUtilsCityChange',function(event,value){
		backTop=true;
	})
	$scope.$on('$ionicView.enter',function(){
		$scope.initData();
		if(backTop){
			$ionicScrollDelegate.$getByHandle('ershou-page-Scroll').scrollTop();
			backTop=false;
		}
	})

	//二手房加载 
	$scope.oldhousearr=[]
	$scope.initData = function(){
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
			date:$stateParams.date
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.oldQueryData})
			.then(function(resData){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.oldhousearr=resData.data;
			}).catch(function(){
				$scope.$broadcast('scroll.refreshComplete');
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
			})

	}
	
})