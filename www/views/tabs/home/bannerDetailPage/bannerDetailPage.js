
angular.module('App').controller('bannerDetailPageCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$ionicPopover,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	
})

