angular.module('App').controller('addSellCommunityCtl',function(appUtils,$addSellData,$localStorage,$ionicHistory,$ionicLoading,$http,$Factory,$rootScope,$scope,$stateParams,$ionicPopover,$timeout){
	$scope.name = $stateParams.name
	$scope.cancel=function(){
		appUtils.back();
	};
	
	$scope.searchName={
		key:''
	}
	
	$scope.choosexiaoqu=function($event,index){
		$addSellData.data.CommunityName=$scope.xiaoquarr[index].Name;
		$addSellData.data.CommunityId=$scope.xiaoquarr[index].Id;
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
				template:'获取二手小区失败',
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
