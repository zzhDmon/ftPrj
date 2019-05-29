
angular.module('App').controller('changePwdCtl',function(appUtils,$ionicHistory,$timeout,$ionicLoading,$http,$state,$Factory,$rootScope,$scope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.subData={
		Password:'',
		NewPassword:'',
		ConfirmPassword:''
	}

	$scope.save=function(){
		var req={
			method:'POST',
			url:$Factory.Account.changepwd.url,
			headers:{
				'Content-Type':'application/json'
			},
			data:$scope.subData
		}
		$http(req).then(function(){
			$ionicLoading.show({
				template:'修改成功',
				duration:1500
			});
			$timeout(function(){
				$rootScope.$ionicGoBack();
			},1500)
		}).catch(function(err){
			$ionicLoading.show({
				template: '操作失败',
				duration:1500
			});
		})
		// $http.post($Factory,{params:{}}).then(function(resData){
		// 	$ionicLoading.show({
		// 			template:resData.data.msg,
		// 			duration:1000
		// 	});
		// 	$timeout(function(){
		// 		$ionicHistory.goBack()
		// 	},1000)
		// },function(resData){
		// 	$ionicLoading.show({
		// 			template:resData.data.msg,
		// 			duration:1000
		// 	});
		// })
	}
})
