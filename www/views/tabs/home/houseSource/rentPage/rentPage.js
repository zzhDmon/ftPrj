angular.module('App').controller('rentPageCtl',function(appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
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
			$ionicScrollDelegate.$getByHandle('rent-page-Scroll').scrollTop();
			backTop=false;
		}
		// 渲染完成 swiper
		var mySwiper = new Swiper('#rent_type_swiper', {
			freeMode: true,
			freeModeMomentumRatio: 0.5,
			slidesPerView: 'auto',
		});
	})
	//租房手房加载 
	$scope.initData = function(){
		$scope.rentQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
			pagenum:0,
			type:2,
			date:'',
			query:'',
			district:'',
			street:'',
			minprize:'',
			maxprize:'',
			roomType:'',
			sort:'',
			date:$stateParams.date
		}
		$scope.rentHaveMore=true;
		$scope.renthousearr=[];
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.rentQueryData})
			.then(function(resData){
				$scope.$broadcast('scroll.refreshComplete')
				$scope.renthousearr=resData.data;
			}).catch(function(err){
				$scope.$broadcast('scroll.refreshComplete')
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
			})
	}
 	

	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
		
    });
	
})