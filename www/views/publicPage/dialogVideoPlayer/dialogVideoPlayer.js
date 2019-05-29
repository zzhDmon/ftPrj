angular.module('App').controller('dialogVideoPlayerCtl',function(appUtils,$timeout,$sce,$scope,$rootScope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}

	$timeout(function(){
		renderData.fullScreenStatus=true
	})

	$scope.$on('$ionicView.leave',function(){
		// 离开半屏显示并暂停播放
		$scope.$broadcast('pauseVideo',true)
	})
	

	var renderData = $scope.renderData = {};
	renderData.videoSrc = $sce.trustAsResourceUrl($stateParams.url);
	renderData.videoImage = $stateParams.image;
	renderData.hideBar = false; // 控制是否隐藏 bar
	renderData.fullScreenStatus = false; // 控制是否全屏


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
		
		return
		renderData.fullScreenStatus = data;
	});
	$scope.closeFullscreen=function(){
		// $scope.portraitScreen()
		renderData.fullScreenStatus = false;
		$scope.$broadcast('closeFullscreenStatus',false)
	}
		
})
