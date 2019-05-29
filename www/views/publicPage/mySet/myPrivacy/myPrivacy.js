
angular.module('App').controller('myPrivacyCtl',function(appUtils,$timeout,$rootScope,$scope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.name = $stateParams.name
})
