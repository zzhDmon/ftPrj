angular.module('App').controller('agencyAgreementDetailCtl',function(appUtils,enterViewLoad,$timeout,$localStorage,$rootScope,$http,$Factory,$state,$stateParams,$scope,$ionicLoading,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.agencyType=$stateParams.agencytype

	$scope.changeStatus=function(){
		$rootScope.$emit('changeAgreementStatus',1);
		$rootScope.$ionicGoBack();
	}

})