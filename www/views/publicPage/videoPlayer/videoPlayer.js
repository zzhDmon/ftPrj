angular.module('App').controller('videoPlayerCtl',function(appUtils,$sce,$ionicHistory,$Factory,$scope,$rootScope,$http,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.leave',function(){
		// 离开半屏显示并暂停播放
		$scope.portraitScreen()
		$scope.$broadcast('pauseVideo',true)
	})

	var renderData = $scope.renderData = {};
	renderData.videoSrc = $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4');
	renderData.hideBar = false; // 控制是否隐藏 bar
	renderData.fullScreenStatus = false; // 控制是否全屏

	// 全屏
	$scope.fullScreen=function(){
		// 锁定屏幕,让其全屏横屏显示
		if (!window.cordova) {
			return false;
		}
		window.screen.orientation.lock('landscape');
	}
	// 半屏
	$scope.portraitScreen=function(){
		// 还原成竖屏
		if (!window.cordova) {
			return false;
		}
		window.screen.orientation.lock('portrait');
	}
	

	// 接收广播控制bar动画
	$scope.$on('videoBarHide', function(event, data) {
		if (!data) {
			return;
		}
		renderData.hideBar = true;
		$scope.$apply();
	});
	$scope.$on('videoBarShow', function(event, data) {
		if (!data) {
			return;
		}
		renderData.hideBar = false;
		$scope.$apply();
	});
	// 视频加载中
	$scope.$on('videoIsLoading',function(event,data){
		$scope.videoIsLoading=data;
	}); // 发送广播, 视频加载中
	// 全屏
	$scope.$on('changeFullscreenStatus', function(event, data) {
		if (data) {
			$scope.fullScreen()
		}else{
			$scope.portraitScreen()
		}
		
		renderData.fullScreenStatus = data;
		// $scope.$apply();
	});
	$scope.closeFullscreen=function(){
		$scope.portraitScreen()
		renderData.fullScreenStatus = false;
		$scope.$broadcast('closeFullscreenStatus',false)
	}
		
})
