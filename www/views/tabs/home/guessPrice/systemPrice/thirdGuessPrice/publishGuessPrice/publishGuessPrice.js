angular.module('App').controller('publishGuessPriceCtl',function(enterViewLoad,appUtils,$localStorage,$http,$Factory,$state,$stateParams,$scope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid
	$scope.userInfo=$localStorage.myselfInfo;

	$scope.subData={
		HouseId:$scope.houseId,
		Type:1,
		Title:'',
		Price:'',
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
				$scope.back();
			},1500)
		}).catch(function(){
			enterViewLoad.customload('提交失败')
		})
	}

	
})