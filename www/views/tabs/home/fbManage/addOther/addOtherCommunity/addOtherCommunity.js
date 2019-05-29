
angular.module('App').controller('addOtherCommunityCtl',function(appUtils,$addOtherData,$localStorage,$ionicHistory,$ionicLoading,$http,$Factory,$rootScope,$scope,$stateParams,$ionicPopover,$timeout){
	
	$scope.name = $stateParams.name
	$scope.cancel=function(){
		appUtils.back();
	};
	
	$scope.searchName={
		key:''
	}
	
	$scope.choosexiaoqu=function($event,index){
	
		$addOtherData.data.CommunityName=$scope.xiaoquarr[index].Name;
		$addOtherData.data.CommunityId=$scope.xiaoquarr[index].Id;

		$addOtherData.data.District=$scope.xiaoquarr[index].District;
		$addOtherData.data.Street=$scope.xiaoquarr[index].Street;
		$addOtherData.data.Address=$scope.xiaoquarr[index].Address;
		
		appUtils.back();
	}

	$scope.search=function(searchname){
		$http.get($Factory.NewHouseSource.communities.url,{
			params:{
				query:$scope.searchName.key,
				city:appUtils.city.id
			}}).then(function(resData){
			$scope.xiaoquarr=resData.data;
		},function(){
			$ionicLoading.show({
				template:'获取小区失败',
				duration:1000
			});
		})
	}
	
	//清除
	$scope.clear=function(){
		$scope.searchName.key=""
		$scope.xiaoquarr=[]
	}
	
	
})
