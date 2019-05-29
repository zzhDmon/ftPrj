angular.module('App').controller('buyrentChannelCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	
	// 渲染完成 swiper
	// $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
	// 	// swiper
	// 	var mySwiper = new Swiper('#buyrent_channel_swiper', {
	// 		freeMode: true,
	// 		freeModeMomentumRatio: 0.5,
	// 		slidesPerView: 'auto',
	// 	});
    // });

	$scope.showOwner=true;
	$scope.usertypeTetx='房东房源'
	$scope.toggleUserType=function(){
		$timeout(function(){
			if($scope.showOwner){
				$scope.showOwner=false
				$scope.usertypeTetx='中介房源'
			}else{
				$scope.showOwner=true
				$scope.usertypeTetx='房东房源'
			}
		})
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()
	})
	// 房产行情
	$scope.loadhousetimes=function(){
		$http.post($Factory.News.query.url,{type:3,pagenum:0,pagesize:3})
			.then(function(resData){
				$scope.housetimesList=resData.data;
				$scope.$broadcast('scroll.refreshComplete');
			}).catch(function(){
				$scope.$broadcast('scroll.refreshComplete');
				enterViewLoad.customload('获取房产行情失败')
			})
	}
	
})