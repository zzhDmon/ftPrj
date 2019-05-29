
angular.module('App').controller('payDoneCtl',function($rootScope,$ionicHistory,$scope,$state){
	$scope.back=function(){
		$state.go('tabs.perCenter')
	}
	
})
