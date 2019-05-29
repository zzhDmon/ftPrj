
angular.module('App').controller('evaluationValuationCtl',function(appUtils,$location,enterViewLoad,$localStorage,$rootScope,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$stateParams,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		$state.go('tabs.perCenter')
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
	})		
	$scope.activeIndex=$stateParams.type?$stateParams.type-1:0;
	$scope.switchSlide =function(index){
		$scope.activeIndex=index;
	}
	$scope.loadData=function(){
		// 二手房
		$http.post($Factory.NewHouseSource.query.url+'?housetype=1',{pagesize:100,pagenum:0,cityId:1})
			.then(function(resData){
				$scope.myOldList=resData.data;
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
		// 租房
		$http.post($Factory.NewHouseSource.query.url+'?housetype=2',{pagesize:100,pagenum:0,cityId:1})
		.then(function(resData){
			$scope.myRentList=resData.data;
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
		// 商铺
		$http.post($Factory.SimpleHouse.selfquery.url,{pagesize:100,pagenum:0,type:1})
			.then(function(resData){
				$scope.myShopList=resData.data;
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
		// 写字楼
		$http.post($Factory.SimpleHouse.selfquery.url,{pagesize:100,pagenum:0,type:2})
			.then(function(resData){
				$scope.myOfficList=resData.data;
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
	}

	$scope.showAction =function(houseinfo,housetype,behaviour) {
		var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: '查看估价' },
				{ text: '房源评测' },
            ],
            // titleText: '操作',
			cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				// 估价
				if(index==0){
					if(housetype=='sell'){
						$state.go('tabs.systemPrice',{query:houseinfo.CommunityName,space:houseinfo.Space,houseid:houseinfo.Id})
						return
					}else{
						enterViewLoad.customload('暂时对二手房开发')
						return true
					}
				}
				// 评测
				if(index==1){
					if(housetype=='sell'||housetype=='rent'){
						$state.go('tabs.evaluationList',{houseid:houseinfo.Id})
						return
					}else{
						enterViewLoad.customload('暂时对二手房和租房开发')
						return true
					}
				}
				
             	return true;
            }
        });


    };
	
	

})
