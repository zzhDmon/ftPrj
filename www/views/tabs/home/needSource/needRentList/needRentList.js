angular.module('App').controller('needRentListCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.paramsData={
			type:$stateParams.type
		}
		if($scope.queryData.type!=$scope.paramsData.type||$scope.queryData.cityId!=appUtils.city.id){
			$scope.needRentArr=[];
			$scope.queryData.type=$scope.paramsData.type;
			$scope.queryData.cityId=appUtils.city.id;
			
			$ionicScrollDelegate.$getByHandle('needrent-list-Scroll').scrollTop();
		}else{
			$scope.queryData.type=$scope.paramsData.type;
			$scope.queryData.cityId=appUtils.city.id;
		}
		
	})
	$scope.$on('$ionicView.leave',function(){
		
	})

	
	/*
	求购分页加载
	*/
	$scope.queryData={
		sort:3,
		pagesize:10,
		pagenum:0,
		type:$stateParams.type,
		cityId:appUtils.city.id
	}
	$scope.needHaveMore=true;
	$scope.needRentArr=[];
	function _loadData(ifloadmore){
		$http.get($Factory.HouseNeed.publicquery.url,{
			params:$scope.queryData
		}).then(function(resData){
			$ionicLoading.hide();
			if(resData.data.length<=0){
				$scope.needHaveMore = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(ifloadmore)return;
			}
			$scope.needHaveMore = true;
			if(ifloadmore){
				$scope.queryData.pagenum += 1;
				$scope.needRentArr=$scope.needRentArr.concat(resData.data);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				$scope.queryData.pagenum=1
				$scope.needRentArr=resData.data;	
			}
		}).catch(function(){
			$scope.needHaveMore = false;
			$ionicLoading.hide();
			enterViewLoad.customload('获取数据失败')
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	$scope.needLoadMore = function(ifloadmore){
		_loadData(true);
	}
	$scope.needRefresh = function(ifloadmore){
		$scope.queryData.pagenum=0;
		_loadData(false);
		$ionicScrollDelegate.$getByHandle('needbuy-list-scroll').scrollTop();
	}

})