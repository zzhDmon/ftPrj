angular.module('App').controller('mallSearchCtl',function(enterViewLoad,appUtils,$localStorage,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.searchHistory = $localStorage.productSearchHistory || []
	})

	$scope.searchData={
		data:''
	}

	$scope.search=function(){
		$scope.searchHistory.push($scope.searchData.data)
		$localStorage.productSearchHistory = $scope.searchHistory;
		$state.go('goodsList',{query:$scope.searchData.data})
	}
	$scope.clearHistory = function(){
		var confirmPopup = $ionicPopup.confirm({
		   title: '确定清空历史？',
		   cancelText: '取消',
		   okText: '确认'
	   });
	   
		confirmPopup.then(function(res) {
		   if(res) {
			$scope.searchHistory=[]
			$localStorage.productSearchHistory = $scope.searchHistory;
		   }else{
			
		   }
		});
   };
})