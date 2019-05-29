angular.module('App').controller('publishEvaluationCtl',function(enterViewLoad,appUtils,$localStorage,$rootScope,$http,$Factory,$state,$stateParams,$scope,$timeout,$ionicLoading,$document){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid
	$scope.userInfo=$localStorage.myselfInfo;

	$scope.subData={
		HouseId:$scope.houseId,
		Type:2,
		Title:'',
		Content:'',
		UserId:$localStorage.myselfInfo.Id
	}

	$scope.saveData=function(){
		var req={
			method:'POST',
			url:$Factory.Evalu.save.url,
			headers: {
				'Content-Type': 'application/json'					
			},
			data:$scope.subData
		}
		$http(req).then(function(resData){
			enterViewLoad.customload('提交成功')
			$timeout(function(){
				$rootScope.$ionicGoBack();
			},1500)
		}).catch(function(err){
			if(err.data.Message=='不能修改'){
				enterViewLoad.customload('您已发布过一条评测')
			}else{
				enterViewLoad.customload('提交失败')
			}
		})
	}

	
})