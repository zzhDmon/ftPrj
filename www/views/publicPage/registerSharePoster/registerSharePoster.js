angular.module('App').controller('registerSharePosterCtl',function(enterViewLoad,$localStorage,$ionicModal,wechatLinkBase,$rootScope,$interval,$timeout,$ionicHistory,$http,$Factory,$stateParams,$scope,$state,$ionicLoading){
	$scope.back=function(){
		$state.go('tabs.perCenter')
	}
	
	// $scope.parPhone=window.atob($stateParams.parphone)
	$scope.parPhone=$stateParams.parphone
	$scope.goReg=function(){
		$state.go('registershare',{parphone:$scope.parPhone})
	}
});

