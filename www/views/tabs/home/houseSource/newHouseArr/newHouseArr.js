angular.module('App').controller('newHouseArrCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		if($scope.filterActiveIndex){
			$scope.closeFilter()
		}else{
			appUtils.back();
		}
	}
	
	// 改城市
	$rootScope.$on('appUtilsCityChange',function(event,value){
		$scope.newQueryData.cityId = value.id;
		// 街道还原
		$scope.streetList=['不限'];
		$ionicScrollDelegate.scrollTop();
		
		$scope.newRefresh()
	})
	$scope.$on('$ionicView.enter',function(){
		$scope.newQueryData.cityId = appUtils.city.id
		$scope.initFilterData()
		// 多选
		if($rootScope.fromStateName=='newHousePage'||$rootScope.fromStateName=='tabs.Home'){
			$scope.initFilterMore()
		}
	})
	$scope.$on('$ionicView.leave',function(){
		$scope.closeFilter()
	})
	$scope.initFilterData=function(){
		// 筛选数据
		$http.get('jsonData/houseFilter/filterData.json').then(function(resData){
			appUtils.getCurrentDistricts(function(res){
				resData.data.utilsDistricts = angular.extend({
					'不限':['不限']
				},res)
				$scope.filterData=resData.data;
			})
		})
	}
	$scope.initFilterMore=function(){
		// 更多筛选
		$http.get('jsonData/houseFilter/newHouseFilter.json').then(function(resData){
			// 初始数据
			$scope.moreFilterRes=resData.data;
			$scope.moreFilterData=JSON.parse(JSON.stringify($scope.moreFilterRes));
		}).catch(function(){
			$scope.moreFilterRes=[]
			$scope.moreFilterData=[]
		})
	}

	// 筛选开关
	$scope.filterActiveIndex=null
	$scope.openFilter=function(index){
		if($scope.filterActiveIndex==index){
			$scope.filterActiveIndex=null
		}else{
			$scope.filterActiveIndex=index
		}
	}
	$scope.closeFilter=function(){
		$scope.filterActiveIndex=null
	}

	$scope.chooseDistrict=function(key,value){
		if(value=='不限'){
			$scope.newQueryData.district='';
		}else{
			$scope.newQueryData.district=key;
		}
		$scope.streetList=value;
		$ionicScrollDelegate.$getByHandle('new-filter-street-scroll').scrollTop();
	}
	// 选街道
	$scope.streetList=['不限']
	$scope.showStreetText=$stateParams.street || ''
	$scope.chooseStreet=function(value){
		$scope.closeFilter();
		if(value=='不限'){
			$scope.showStreetText='';
			$scope.newQueryData.district='';
			$scope.newQueryData.street='';
		}else{
			$scope.showStreetText=value;
			$scope.newQueryData.street=value;
		}
		$scope.newRefresh(false);
	}
	// 选价格
	if(!$stateParams.minprize&&$stateParams.maxprize){
		$scope.showPriceText=$stateParams.maxprize+'元/m²以下'
	}else if($stateParams.minprize&&!$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'元/m²以上'
	}else if($stateParams.minprize&&$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'-'+$stateParams.maxprize+'元/m²'
	}else{
		$scope.showPriceText=''
	}

	$scope.choosePrice=function(min,max){
		$scope.closeFilter();
		if(!min&&max){
			$scope.showPriceText=max+'元/m²以下'
		}else if(min&&!max){
			$scope.showPriceText=min+'元/m²以上'
		}else if(min&&max){
			$scope.showPriceText=min+'元/m²-'+max+'元/m²'
		}else{
			$scope.showPriceText='不限'
		}
		$scope.newQueryData.minprize=min;
		$scope.newQueryData.maxprize=max;
		$scope.newRefresh(false);
	}
	// 选排序
	if($stateParams.sort*1==1){
		$scope.showSortText='面积从大到小'
	}else if($stateParams.sort*1==2){
		$scope.showSortText='面积从小到大'
	}else if($stateParams.sort*1==3){
		$scope.showSortText='单价从小到大'
	}else if($stateParams.sort*1==4){
		$scope.showSortText='单价从大到小'
	}else{$scope.showSortText=''}

	$scope.chooseSort=function(text,value){
		$scope.closeFilter();
		$scope.showSortText=text;

		$scope.newQueryData.sort=value;
		$scope.newRefresh(false);
		
	}
	// 选房型
	if($stateParams.roomtype*1==1){
		$scope.showroomType='一室'
	}else if($stateParams.roomtype*1==2){
		$scope.showroomType='二室'
	}else if($stateParams.roomtype*1==3){
		$scope.showroomType='三室'
	}else if($stateParams.roomtype*1==4){
		$scope.showroomType='四室'
	}else if($stateParams.roomtype*1==5){
		$scope.showroomType='五室'
	}else if($stateParams.roomtype*1==6){
		$scope.showroomType='五室以上'
	}else{$scope.showroomType=''}
	
	$scope.chooseRoomType=function(text,value){
		$scope.closeFilter();
		$scope.showroomType=text;
		
		$scope.newQueryData.roomType=value;
		$scope.newRefresh(false);
	}

	// 更多 确认筛选
	$scope.confirmFilter=function(){
		$scope.newRefresh(false);
		$scope.closeFilter()
	}
	$scope.resetFilter=function(){
		$scope.moreFilterData=JSON.parse(JSON.stringify($scope.moreFilterRes));
		$scope.newQueryData.sort=null
	}
	
	//新手房加载	 
	$scope.showQueryText=$stateParams.query;
	$scope.newQueryData={
		cityId:appUtils.city.id,
		pagesize:10,
		pagenum:0,
		type:null,
		query:$stateParams.query,
		district:$stateParams.district,
		street:$stateParams.street,
		minprize:$stateParams.minprize,
		maxprize:$stateParams.maxprize,
		roomType:$stateParams.roomtype,
		sort:$stateParams.sort,
		Special:[],
		HousePeriod:[],
		BuildType:[],
		Fitment:[],
	}
	$scope.newHaveMore=true;
	$scope.newhousearr=[];
 	function loadNew(ifloadmore){

		$http.post($Factory.NewHouse.publicquery.url+'?cityId='+$scope.newQueryData.cityId,
				$scope.newQueryData)
			.success(function(resData){
				$ionicLoading.hide();
				
				if(resData.length<=0){
					$scope.newHaveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.newHaveMore = true;
				if(ifloadmore){
					$scope.newQueryData.pagenum += 1;
					$scope.newhousearr=$scope.newhousearr.concat(resData);
					// $scope.newhousearr=[...$scope.newhousearr,...resData];
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.newQueryData.pagenum=1
					$scope.newhousearr=resData;	
				}
			}).error(function(){
				$scope.newHaveMore = false;
				$ionicLoading.hide();
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.newLoadMore = function(ifloadmore){
		loadNew(true);
	}
	$scope.newRefresh = function(ifloadmore){
		// 更多筛选数据转换
		for(var i=0;i<$scope.moreFilterData.length;i++){
			if($scope.moreFilterData[i].field){
				$scope.newQueryData[$scope.moreFilterData[i].field]=[];
				for(var j=0;j<$scope.moreFilterData[i].list.length;j++){
					if($scope.moreFilterData[i].list[j].isChecked){
						var _value = $scope.moreFilterData[i].list[j].value
						$scope.newQueryData[$scope.moreFilterData[i].field].push(_value)
					}
				}
			}
		}

		$scope.newQueryData.pagenum=0;
		loadNew(false);
		$ionicScrollDelegate.$getByHandle('newhouse-list-scroll').scrollTop();
	}

	


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
		
    });
	
})