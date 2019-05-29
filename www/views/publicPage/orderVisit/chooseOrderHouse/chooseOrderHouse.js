angular.module('App').controller('chooseOrderHouseCtl',function(appUtils,enterViewLoad,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		enterViewLoad.load()
		$scope.newQueryData={
			cityId:1,
			pagesize:'',
			pagenum:0,
			type:null,
			query:'',
			district:'',
			street:'',
			minprize:'',
			maxprize:'',
			roomType:'',
			sort:''
		}
		$http.get($Factory.NewHouse.publicquery.url,{params:$scope.newQueryData})
		.then(function(resData){
			$ionicLoading.hide()
			$scope.newhousearr=resData.data;
		}).catch(function(){
			$ionicLoading.hide()
			enterViewLoad.customload('获取数据失败')
		})
	})
	
	$scope.chooseHouse=function(house){
		$rootScope.$emit('chooseOrderHouseSuc',{Id:house.Id,Space:house.Space})
		$scope.back()
	}


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
    });
	
})