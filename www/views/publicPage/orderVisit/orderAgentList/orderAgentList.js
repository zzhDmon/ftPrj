
angular.module('App').controller('orderAgentListCtl',function(appUtils,$rootScope,$ionicModal,$ionicLoading,$ionicHistory,$timeout,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$stateParams.houseid

	$scope.chooseAgent=function(agent){
		$rootScope.$ionicGoBack();
		$rootScope.$emit('chooseVisitAgentChange',agent)
	}

	var req={
		method:'POST',
		url:$Factory.NewHouseProxy.applicantlist.url,
		headers: {
			'Content-Type': 'application/json'					
		},
		data:$stateParams.houseid
	}
	$http(req).then(function(res){
		$scope.agentList=res.data;
	}).catch(function(){
		$ionicLoading.show({
			template: '请求失败',
			duration: 1500
		});
	})
})

