
angular.module('App').controller('addShopCommunityCtl',function(appUtils,$addShopData,$localStorage,$ionicHistory,$ionicLoading,$http,$Factory,$rootScope,$scope,$stateParams,$ionicPopover,$timeout){
	
	$scope.name = $stateParams.name
	$scope.cancel=function(){
		appUtils.back();
	};
	
	$scope.searchName={
		key:''
	}
	
	$scope.choosexiaoqu=function($event,index){
		$addShopData.data.CommunityName=$scope.xiaoquarr[index].Name;
		$addShopData.data.CommunityId=$scope.xiaoquarr[index].Id;
		
		$addShopData.data.District=$scope.xiaoquarr[index].District;
		$addShopData.data.Street=$scope.xiaoquarr[index].Street;
	
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
