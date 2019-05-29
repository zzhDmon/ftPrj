angular.module('App').controller('homeClassifyCtl',function(enterViewLoad,appUtils,NimUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.tabActiveName='secondTab'
	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();

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
	})
	

	//弹窗导航
	$ionicModal.fromTemplateUrl('home_classify_nav_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	$scope.$on('modal.shown', function() {
		appUtils.fbModalShow()
	});
	$scope.$on('modal.hidden', function() {
	 	appUtils.fbModalHidden()
 	});	





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