
angular.module('App').controller('realHouseListCtl',function(appUtils,$location,enterViewLoad,$ionicScrollDelegate,$localStorage,$rootScope,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$stateParams,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	// $scope.$on('$ionicView.enter',function(){
	// 	$scope.loadData()
	// })
	$scope.pageType=1
	$scope.changePageType=function(type){
		$scope.pageType=type
	}		
/*
二手房
*/ 
	$scope.queryData={
		pagesize:10,
		pagenum:0
	}
	$scope.myOldList = [];
	$scope.haveMore = true;
	$scope.loadData=function(ifloadmore){
		// 二手房
		$http.post($Factory.NewHouseSource.query.url+'?housetype=1',$scope.queryData)
			.then(function(resData){
				if(resData.data.length<=0){
					$scope.haveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.haveMore = true;
				if(ifloadmore){
					$scope.queryData.pagenum += 1;
					$scope.myOldList=$scope.myOldList.concat(resData.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.queryData.pagenum += 1;
					$scope.myOldList=resData.data;
					$scope.$broadcast('scroll.refreshComplete');
					// $ionicScrollDelegate.$getByHandle('house-realhouse-scroll').scrollTop();
				}
			}).catch(function(){
				$scope.haveMore = false;
				enterViewLoad.customload('获取失败')
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.houseLoadMore = function(){
		$scope.loadData(true);
	}
	$scope.houseRefresh = function(){
		$scope.queryData.pagenum = 0;
		$scope.loadData(false);
		
	}
/*
商铺
*/ 
	$scope.shopQueryData={
		pagesize:10,
		pagenum:0,
		type:1,
		behaviour:1
	}
	$scope.myShopList = [];
	$scope.shopHaveMore = true;
	$scope.loadShopData=function(ifloadmore){
		// 二手房
		$http.post($Factory.SimpleHouse.selfquery.url,$scope.shopQueryData)
			.then(function(resData){
				if(resData.data.length<=0){
					$scope.shopHaveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.shopHaveMore = true;
				
				var usefulData = resData.data.filter(function(item){
					return item.Behaviour==1
				})
				if(ifloadmore){
					$scope.shopQueryData.pagenum += 1;
					$scope.myShopList = $scope.myShopList.concat(usefulData);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.shopQueryData.pagenum += 1;
					$scope.myShopList = usefulData;
					$scope.$broadcast('scroll.refreshComplete');
					// $ionicScrollDelegate.$getByHandle('shop-realhouse-scroll').scrollTop();
				}
			}).catch(function(){
				$scope.shopHaveMore = false;
				enterViewLoad.customload('获取失败')
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.shopLoadMore = function(){
		$scope.loadShopData(true);
	}
	$scope.shopRefresh = function(){
		$scope.shopQueryData.pagenum = 0;
		$scope.loadShopData(false);
	}

	$scope.showAction =function(house,housetype){
		var btnTxt = '去认证'
		switch(house.AuthStatus){
			case 0:
				btnTxt = '去认证'
				break
			case 1:
				btnTxt = '审核中'
				break
			case 2:
				btnTxt = '已认证'
				break
			case 3:
				btnTxt = '认证不通过'
				break
			case 4:
				btnTxt = '已提交'
				break
			default:
				btnTxt = '去认证'
				break
		}
		var hideSheet = $ionicActionSheet.show({
            buttons: [
              	{ text: btnTxt },
            ],
            // titleText: '操作',
			cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				if(index==0 && (house.AuthStatus==0 || house.AuthStatus==3)){
					var paramshousetype = 1;
					if(housetype==1){
						paramshousetype = 1;
					}else{
						paramshousetype = 2;
					}
					$state.go('realHouse',{id:house.Id,address:house.Address,housetype:paramshousetype})
				}
				return true;
			}
        });


    };
	
	

})
