
angular.module('App').controller('aislePageCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$ionicPopover,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.paramsData={
		type:$stateParams.type,
		index:$stateParams.index
	}

	$scope.activeIndex=$scope.paramsData.index || 1
	$scope.switchActive=function(index){
		$scope.activeIndex=index
	}
})

