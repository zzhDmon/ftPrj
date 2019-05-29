angular.module('App')
.controller('personalNeedCtl',function(appUtils,$ionicHistory,$ionicLoading,$Factory,$http,$scope,$rootScope,$state,$stateParams,$timeout){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		if($stateParams.needtype=='buy'){
			$scope.isBuy=true;
			$scope.headTitle='求购'
		}else{
			$scope.isBuy=false;
			$scope.headTitle='求租'
		}
		$scope.switchBuySell=function(){
			if($scope.isBuy){
				$scope.isBuy=false;
				$scope.headTitle='求租'
				$scope.houseType=2;
				$scope.loadNeeds($scope.houseType)
			}else{
				$scope.isBuy=true;
				$scope.headTitle='求购'
				$scope.houseType=0;
				$scope.loadNeeds($scope.houseType)
			}
		}
	
		$scope.houseType=0
		$scope.switchHouseType=function(index){
			$scope.houseType=index;
			$scope.loadNeeds($scope.houseType)
		}

		$scope.loadNeeds($scope.houseType)
	})

	$scope.loadNeeds=function(housetype){
		var req={
			method:'Get',
			url:$Factory.HouseNeed.query.url+'?Type='+housetype,
			data:1901
		}
		$http(req)
		// $http.get($Factory.HouseNeed.query.url+'?Type='+housetype,{userid:1901,date:6})
			.then(function(resData){
				$scope.needList=resData.data
			}).catch(function(){
				$ionicLoading.show({
					template:'获取数据失败',
					duration:1500
				})
			})
	}

})


