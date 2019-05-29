
angular.module('App').controller('moreVideosCtl',function(Upload,appUtils,enterViewLoad,actionImgShow,$ionicScrollDelegate,$sce,$ionicModal,$ionicLoading,$localStorage,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		// $scope.initData()
		$scope.haveMore = true;
	})
	
	// 加载视频列表
	// $scope.initData=function(){
	// 	$http.post($Factory.Zone.indexlist.url,{
	// 		isOnlyFollow:false,
	// 		type:30,
	// 		pagenum:0,
	// 		pagesize:20
	// 	}).then(function(resData){
	// 		if(resData.data.length){
	// 			$scope.videoList=resData.data[0].List.filter(function(item){
	// 				if(appUtils.isJsonString(item.Content)){
	// 					item.Content=JSON.parse(item.Content)
	// 				}else{
	// 					item.Content={}
	// 				}
	// 				return item
	// 			})
	// 		}else{

	// 		}
	// 	}).catch(function(){
	// 		enterViewLoad.customload('获取失败');
	// 	})
		
	// }

	$scope.queryData={
		isOnlyFollow:false,
		type:30,
		pagenum:0,
		pagesize:10
	};
	$scope.videoList=[];
	$scope.haveMore = true;

	function _loadData(ifloadmore){
		$http.post($Factory.Zone.indexlist.url,$scope.queryData)
		.then(function(resData){
			$ionicLoading.hide();
			if(resData.data.length<=0){
				$scope.haveMore = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
				if(ifloadmore)return;
			}
			$scope.haveMore = true;

			if(ifloadmore){
				$scope.queryData.pagenum += 1;
				var concatData=resData.data[0].List.filter(function(item){
					if(appUtils.isJsonString(item.Content)){
						item.Content=JSON.parse(item.Content)
					}else{
						item.Content={}
					}
					return item
				})
				$scope.videoList = $scope.videoList.concat(concatData);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				$scope.queryData.pagenum=1;
				$scope.simplehousearr=resData;
				$scope.videoList=resData.data[0].List.filter(function(item){
					if(appUtils.isJsonString(item.Content)){
						item.Content=JSON.parse(item.Content)
					}else{
						item.Content={}
					}
					return item
				})
				$scope.$broadcast('scroll.refreshComplete');
				
			}
			
		}).catch(function(){
			$ionicLoading.hide();
			$scope.haveMore = false;
			$ionicLoading.show({
				template: '获取数据失败',
				duration: 1000
			});
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	$scope.loadMore = function(ifloadmore){
		_loadData(true);
	}
	$scope.loadeRefresh = function(ifloadmore){
		$scope.queryData.pagenum=0
		_loadData(false);
		// $ionicScrollDelegate.$getByHandle('more-videos-Scroll').scrollTop();
	}

})

