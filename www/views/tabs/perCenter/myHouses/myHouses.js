
angular.module('App').controller('myHousesCtl',function(appUtils,$location,enterViewLoad,$localStorage,$ionicScrollDelegate,$ionicListDelegate,$rootScope,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$stateParams,$ionicPopup,$timeout,$ionicActionSheet,$ionicPopover){
	$scope.back=function(){
		if(
			$ionicHistory.backView()&&(
			$ionicHistory.backView().stateName=='tabs.Home'|| 
			$ionicHistory.backView().stateName=="guessPrice")
		){
			appUtils.back();
		}else{
			$state.go('tabs.perCenter')
		}
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
		$scope.haveMore=true;
	})
	// 关闭删除侧滑
	$scope.$on('$ionicView.leave',function(){
		$timeout(function(){
			$ionicListDelegate.closeOptionButtons();
		})
		$scope.closeFilter();
	})
	// 发布
	$ionicPopover.fromTemplateUrl('my_house_popover.html', {
		scope: $scope
		}).then(function(popover) {
			$scope.popover = popover;
		});          
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	


	$scope.activeIndex=$stateParams.type?$stateParams.type-1:0;
	$scope.switchSlide =function(index){
		$scope.activeIndex=index;
	}
	// 切换筛选显示
	$scope.filterActiveIndex=null;
	$scope.switchFilterIndex =function(index){
		if(index==$scope.filterActiveIndex){
			$scope.closeFilter();
		}else{
			$scope.filterActiveIndex=index;
		}
	}
	$scope.loadData=function(){
		// 筛选数据
		$http.get('jsonData/houseFilter/filterData.json').then(function(resData){
			appUtils.getCurrentDistricts(function(res){
				resData.data.utilsDistricts = angular.extend({
					'不限':['不限']
				},res)
				resData.data.typeList=[
					{text:'二手房',value:2},
					{text:'租房',value:3},
					{text:'商铺',value:4},
					{text:'写字楼',value:5},
					{text:'全部',value:-1},
				]
				resData.data.timeList=[
					{text:'今天',value:1},
					{text:'三天内',value:2},
					{text:'一周内',value:3},
					{text:'三周内',value:4},
					{text:'一个月内',value:5},
					{text:'全部',value:0},
				]
				resData.data.statusList=[
					{text:'已认证',value:1},
					{text:'待认证',value:0},
					{text:'待审核',value:2},
					{text:'未通过',value:3},
					{text:'全部',value:-1},
				]
				$scope.filterData=resData.data;
			})
		})

		// 二手房
		// $http.post($Factory.NewHouseSource.query.url+'?housetype=1',{pagesize:100,pagenum:0,cityId:1})
		// 	.then(function(resData){
		// 		$scope.myOldList=resData.data;
		// 		$scope.myhouseList = $scope.myhouseList.concat(resData.data)
		// 	}).catch(function(){
		// 		enterViewLoad.customload('获取失败')
		// 	})
		// // 租房
		// $http.post($Factory.NewHouseSource.query.url+'?housetype=2',{pagesize:100,pagenum:0,cityId:1})
		// 	.then(function(resData){
		// 		$scope.myRentList=resData.data;
		// 		$scope.myhouseList = $scope.myhouseList.concat(resData.data)
		// 	}).catch(function(){
		// 		enterViewLoad.customload('获取失败')
		// 	})
		// // 商铺
		// $http.post($Factory.SimpleHouse.selfquery.url,{pagesize:100,pagenum:0,type:1})
		// 	.then(function(resData){
		// 		$scope.myShopList=resData.data;
		// 		$scope.myhouseList = $scope.myhouseList.concat(resData.data)
		// 	}).catch(function(){
		// 		enterViewLoad.customload('获取失败')
		// 	})
		// // 写字楼
		// $http.post($Factory.SimpleHouse.selfquery.url,{pagesize:100,pagenum:0,type:2})
		// 	.then(function(resData){
		// 		$scope.myOfficList=resData.data;
		// 		$scope.myhouseList = $scope.myhouseList.concat(resData.data)
		// 	}).catch(function(){
		// 		enterViewLoad.customload('获取失败')
		// 	})

	}

	/*点击下拉选择*/ 
	$scope.queryTextData={
		query:'',
		type:'',
		date:'',
		antype:''
	}
	$scope.chooseDistrict=function(key,value){
		$scope.streetList=value;
		$ionicScrollDelegate.$getByHandle('myhouse-filter-street-scroll').scrollTop();
	}
	// 选街道
	$scope.streetList=['不限']
	$scope.chooseStreet=function(value){
		$scope.queryTextData.query=value;
		if(value=='不限'){
			$scope.queryData.query='';
		}else{
			$scope.queryData.query=value;
		}
		$scope.loadRefresh();
	}
	$scope.chooseType=function(type){
		$scope.queryTextData.type=type.text
		$scope.queryData.type=type.value;
		$scope.loadRefresh();
	}
	$scope.chooseDate=function(date){
		$scope.queryTextData.date=date.text;
		$scope.queryData.date=date.value;
		$scope.loadRefresh();
	}
	$scope.chooseStatus=function(status){
		$scope.queryTextData.antype=status.text;
		$scope.queryData.antype=status.value;
		$scope.loadRefresh();
	}
	// 关闭 下拉选框
	$scope.closeFilter=function(){
		$scope.filterActiveIndex=null
	}

	$scope.queryData={
		pagenum:0,
		pagesize:10,
		query:'',
		type:-1,
		date:0,
		antype:-1
	}

	$scope.haveMore=true;
	$scope.myhouseList=[];
 	function loadData(ifloadmore){
		// 我的全部房源
		$http.post($Factory.MyHouse.myhouse.url,$scope.queryData)
			.then(function(resData){
				if(!resData.data || resData.data.length<=0){
					$scope.haveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.haveMore = true;
				if(ifloadmore){
					$scope.queryData.pagenum += 1;
					$scope.myhouseList=$scope.myhouseList.concat(resData.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.queryData.pagenum=1
					$scope.myhouseList=resData.data;	
				}
			}).catch(function(){
				$scope.haveMore = false;
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1500
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.loadMore = function(ifloadmore){
		loadData(true);
	}
	$scope.loadRefresh = function(ifloadmore){
		$scope.queryData.pagenum=0;
		loadData(false);
		$scope.closeFilter()
	}


// 详情
	$scope.detailSref=function(houseinfo){
		if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==1){
			$state.go('sellHouseDetail',{id:houseinfo.Id})
		}else if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==2){
			$state.go('rentHouseDetail',{id:houseinfo.Id})
		}else if(houseinfo.HouseType=='Shop'){
			$state.go('otherHouseDetail',{id:houseinfo.Id,isshop:'true'})
		}else if(houseinfo.HouseType=='Office'){
			$state.go('otherHouseDetail',{id:houseinfo.Id,isshop:'false'})
		}
	}
// 编辑
	$scope.editSref=function($event,houseinfo){
		$event.stopPropagation()
		if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==1){
			$state.go('addSell',{id:houseinfo.Id})
		}else if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==2){
			$state.go('addRent',{id:houseinfo.Id})
		}else if(houseinfo.HouseType=='Shop'){
			$state.go('addShop',{id:houseinfo.Id,type:1,behaviour:houseinfo.Behaviour})
		}else if(houseinfo.HouseType=='Office'){
			$state.go('addOther',{id:houseinfo.Id,type:2,behaviour:houseinfo.Behaviour})
		}
	}
// 删除
	$scope.deleteSellHouse=function(houseinfo,index){
		var _deleteUrl;
		if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==1){
			_deleteUrl=$Factory.NewHouseSource.delete.url+'?id='+houseinfo.Id
		}else if(houseinfo.HouseType!='Shop'&&houseinfo.HouseType!='Office'&&houseinfo.Type==2){
			_deleteUrl=$Factory.NewHouseSource.delete.url+'?id='+houseinfo.Id
		}else if(houseinfo.HouseType=='Shop' || houseinfo.HouseType=='Office'){
			_deleteUrl=$Factory.SimpleHouse.delete.url+'?id='+houseinfo.Id
		}
		console.log(_deleteUrl)
		
		var confirmPopup = $ionicPopup.confirm({
			title: '确定删除？',
			cancelText: '取消',
			okText: '删除'
		});

		confirmPopup.then(function(res){
			if(res) {
				// enterViewLoad.customload('删除成功')
				// $ionicListDelegate.closeOptionButtons();
				// $scope.myhouseList.splice(index,1)
				$scope.loadData()
				$http.post(_deleteUrl)
					.then(function(resData){
						enterViewLoad.customload('删除成功')
				 	$ionicListDelegate.closeOptionButtons();
				 	$scope.myhouseList.splice(index,1)
					}).catch(function(){
						enterViewLoad.customload('删除失败')
					})
			}else{
				$ionicListDelegate.closeOptionButtons();
			}
		});
	}

	$scope.showAction =function(houseinfo,housetype,behaviour){
		var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: '详情' },
				{ text: '编辑' },
				{ text: '查看估价' },
				{ text: '房源评测' },
            ],
            destructiveText: '删除',
            // titleText: '操作',
			cancelText: '取消',
			destructiveButtonClicked:function(){
				
				hideSheet();
			},
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				// 估价
				if(index==2){
					if(housetype=='sell'){
						$state.go('tabs.systemPrice',{query:houseinfo.CommunityName,space:houseinfo.Space,houseid:houseinfo.Id})
						return
					}else{
						enterViewLoad.customload('暂时对二手房开发')
						return true
					}
				}
				// 评测
				if(index==3){
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
