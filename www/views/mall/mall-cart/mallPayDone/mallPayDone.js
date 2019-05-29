
angular.module('App').controller('mallPayDoneCtl',function($rootScope,$ionicHistory,$scope,$state){
	$scope.back=function(){
		$state.go('mallCart')
	}
	
})
