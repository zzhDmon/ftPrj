
angular.module('App').controller('newHousesCtl',function(appUtils,$rootScope,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$stateParams,$ionicPopover,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	

	$scope.queryData={
		pagenum:0,
		pagesize:10
	}

	$scope.loadMore=true;
	$scope.myNewList=[]
	function loadNew(ifloadmore){
		var req = {
			method: 'POST',
			url: $Factory.NewHouse.query.url+'?cityid=1',
			headers: {
				'Content-Type': 'application/json'
			},
			data:$scope.queryData
		};
		$http(req).then(function(resData){
			if(resData.data.length<=0){
				$scope.loadMore = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return;
			}
			$scope.loadMore = true;
			$scope.queryData.pagenum += 1;
			if(ifloadmore){
				$scope.myNewList=$scope.myNewList.concat(resData.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				// $scope.queryData.pagenum=1;
				$scope.myNewList=resData.data;
			}
		})
		.catch(function(){
			$scope.loadMore = false;
			$ionicLoading.show({
				template: '获取数据失败',
				duration: 1000
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		})
	}

	$scope.newLoadMore = function(ifloadmore){
		loadNew(ifloadmore);
	}
	$scope.newRefresh = function(ifloadmore){
		$scope.queryData.pagenum=0;
		loadNew(ifloadmore);
	}

	

	$scope.soldOut=function($event){
		$event.stopPropagation();
	}
	$scope.goEdit=function($event,id){
		$event.stopPropagation();
		$state.go('addNew',{id:id})
	}
	$scope.goTrade=function($event,id){
		$event.stopPropagation();
		$state.go('tradeData',{id:id});
	}
	$scope.goVisit=function($event,id){
		$event.stopPropagation();
		$state.go('visitData',{id:id});
	}

})
