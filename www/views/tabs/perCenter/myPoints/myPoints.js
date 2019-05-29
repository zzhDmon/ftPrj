
angular.module('App').controller('myPointsCtl',function(appUtils,$timeout,$scope,$state){
	
	$scope.back=function(){
		appUtils.back();
	}
})

