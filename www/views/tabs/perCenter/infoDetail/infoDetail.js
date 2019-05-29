angular.module('App').controller('infoDetailCtl',function(appUtils,$timeout,$ionicHistory,$rootScope,$scope,$http,$Factory,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
		
	$scope.$on('$ionicView.enter',function(){
		$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.myinfo=resData.data;
		}).catch(function(err){
	
		})
	})
	
	$scope.name = $stateParams.name

})
