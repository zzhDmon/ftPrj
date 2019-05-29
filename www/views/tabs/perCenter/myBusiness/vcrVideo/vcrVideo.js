angular.module('App').controller('vcrVideoCtl',function(appUtils,enterViewLoad,$ionicModal,$localStorage,$http,$Factory,$timeout,$sce,$scope,$rootScope,$state,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.paramsData={
		id:$stateParams.id,
		video:$stateParams.video,
		image:$stateParams.image
	}
	
	var renderData = $scope.renderData = {};
	
	if($scope.paramsData.video){
		// 集团简介视频
		$scope.renderData.videoSrc = $sce.trustAsResourceUrl($scope.paramsData.video);
		$scope.renderData.videoImage = $scope.paramsData.image;
	}else{
		$http.get($Factory.Zone.get.url+'?id='+$scope.paramsData.id)
		.then(function(resData){
			if(appUtils.isJsonString(resData.data.Content)){
				resData.data.Content=JSON.parse(resData.data.Content)
			}else{
				resData.data.Content={}
			}
			//已点赞
			if($localStorage.myselfInfo){
				resData.data.agreed = resData.data.AgressUsers.indexOf($localStorage.myselfInfo.Id)>=0 ? true:false;
			}else{
				resData.data.agreed=false
			}
			$scope.pageData=resData.data
			$scope.renderData.videoSrc = $sce.trustAsResourceUrl($scope.pageData.Content.video);
			$scope.renderData.videoImage = $scope.pageData.Content.image;
		}).catch(function(){
			enterViewLoad.customload('获取失败');
		})
	}

	// 点赞
	$scope.agreeAction=function(item){
		if(item.agreed) return
		$http.post($Factory.Zone.agree.url+'?id='+item.Id).then(function(resData){
			item.agreed=true
			item.AgressUsers.push($localStorage.myselfInfo.Id)
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}
	// 点赞
	$scope.followHim=function(item,$event){
		$event.stopPropagation();
		if(!$localStorage.myselfInfo){
			$state.go('login')
			return
		}
		$http.post($Factory.Zone.follow.url+'?uid='+item.UserId).then(function(resData){
			item.IsFollow=true
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}
	// 回复
	$ionicModal.fromTemplateUrl('noctr_video_comments_modalview', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.commentsModal = modal;
	});
	$scope.showCommentsModal=function(item){
		$scope.commentsModal.show();
	}
	$scope.closeCommentsModal=function(){
		$scope.commentsModal.hide();
	}
	$scope.replyData={
		data:''
	}
	$scope.replyComment=function(){
		if(!$scope.replyData.data) return
        $http.post($Factory.Zone.save.url,{
            type:70,
            ParentId:$scope.pageData.Id,
            Content:$scope.replyData.data
        }).then(function(res){
			$scope.pageData.Children.push({
				Content:$scope.replyData.data,
				UserName:$localStorage.myselfInfo ? $localStorage.myselfInfo.NickName:'房田用户',
				UserImage:$localStorage.myselfInfo ? $localStorage.myselfInfo.ShowImage:'http://imgs.wujiuyun.com//Images//logo.png'
			})
			$scope.replyData.data='';
        }).catch(function(){
            $scope.replyData.data=''
            enterViewLoad.customload('评论失败');
        })
	}
	$scope.keyboardHeight=null
	window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
			if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
				$scope.keyboardHeight=e.keyboardHeight
			}
            $scope.keyboardShow=true  
		})
    }) 
    window.addEventListener('native.keyboardhide',function(e){
		$timeout(function(){
			$scope.keyboardShow=false
		})
    })
/*
原始组件
*/ 
	$timeout(function(){
		renderData.fullScreenStatus=true
	})
	$scope.$on('$ionicView.leave',function(){
		// 离开半屏显示并暂停播放
		$scope.$broadcast('pauseVideo',true)
		$scope.$broadcast('viewLeave',true)
	})
	

	
	// renderData.videoSrc = $sce.trustAsResourceUrl($stateParams.url);
	// renderData.videoImage = $stateParams.image;
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
