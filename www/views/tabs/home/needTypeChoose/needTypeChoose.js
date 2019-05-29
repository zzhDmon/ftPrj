
angular.module('App').controller('needTypeChooseCtl',function(appUtils,$scope,$stateParams){
	
	$scope.back=function(){
		appUtils.back();
	}
	$scope.pageType=$stateParams.type;

})
