angular.module('App').controller('newHousePageCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
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
		$scope.switchData();
		if(backTop){
			$ionicScrollDelegate.$getByHandle('newhouse-page-Scroll').scrollTop();
			backTop=false;
		}

		new Swiper('.newhouse-page-swiper-container', {
			freeMode: true,
			freeModeMomentumRatio: 0.5,
			slidesPerView: 'auto', //可以容纳的页数
		});		
	})

	$scope.hotSwitchIndex=6;
	$scope.hotSwitch=function(index){
		$scope.hotSwitchIndex=index;
		$scope.switchData();
	}
	
	$scope.switchData=function(){
		$http.get($Factory.NewHouse.publicquery.url,{
			params:{
				cityId:appUtils.city.id,
				pagesize:5,
				pagenum:0,
				type:null,
				sort:$scope.hotSwitchIndex
			}
		}).then(function(resData){
			$scope.hotListData=resData.data;
		}).catch(function(){
			enterViewLoad.customload('获取数据失败');
		})
	}
	$scope.initData=function(){
		$scope.newQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
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
		$http.get($Factory.NewHouse.publicquery.url,{
			params:$scope.newQueryData
		}).then(function(resData){
			$scope.$broadcast('scroll.refreshComplete')
			$scope.newhousearr=resData.data;
		}).catch(function(){
			enterViewLoad.customload('获取数据失败');
			$scope.$broadcast('scroll.refreshComplete')
		})
	}
	


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
    });
	
})