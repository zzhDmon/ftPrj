angular.module('App').controller('mallClassifyCtl',function(enterViewLoad,NimUtils,appUtils,$location,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.$on('$ionicView.enter',function(){
		// 计算会话未读数
		var _calcUnread = function(sessions){
			for(var i=0;i<sessions.length;i++){
				$scope.totalUnread=$scope.totalUnread+sessions[i].unread
			}
		}
		// 会话未读数
		$scope.totalUnread=0;
		_calcUnread(NimUtils.sessionList)
		// 会话列表 未读数 更新
		$rootScope.$on('updateSessions',function(event,data){
			$timeout(function(){
				$scope.totalUnread=0;
				_calcUnread(data)
			})
		})

		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		$scope.activeTabName='mall-classify'
	})
	$scope.back=function(){
		appUtils.back()
	}

	$scope.loadData=function(){
		$http.get($Factory.Category.query.url+'?pid=')
			.then(function(resData){
				$scope.classifyList=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取分类列表失败')
			})
	}
	$scope.loadData();

	// 侧栏切换
	$scope.groupActiveIndex=0;
	$scope.switchGroupIndex=function(index){
		$scope.groupActiveIndex=index
	}


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
		
    });	
})