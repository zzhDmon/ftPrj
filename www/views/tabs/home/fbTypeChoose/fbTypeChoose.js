
angular.module('App').controller('fbTypeChooseCtl',function(appUtils,$scope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.pageType=$stateParams.type;

})
