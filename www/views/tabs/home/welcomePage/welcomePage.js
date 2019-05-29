
angular.module('App').controller('welcomePageCtl',function(appUtils,$localStorage,$timeout,$scope,$state,$ionicSlideBoxDelegate){
	
	$scope.goHome=function(){
		$localStorage.firstTimeOpen = true;
		$state.go('tabs.realHome');
	}
	$scope.adImgList=[
		'imgs/home/welcomepage/1.jpg',
		'imgs/home/welcomepage/2.jpg',
		'imgs/home/welcomepage/3.jpg',
		'imgs/home/welcomepage/4.jpg',
	]
	$timeout(function(){
		$ionicSlideBoxDelegate.update();
	})
	// 广告轮播
	$scope.currentAdSlideIndex=0;
	$scope.changeAdSlide=function(index){
		$scope.currentAdSlideIndex=index;
	}
	
})
