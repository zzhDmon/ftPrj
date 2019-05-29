
angular.module('App').controller('scanResultCtl',function(appUtils,$scope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.result=$stateParams.result;
	
})
