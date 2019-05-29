angular.module('App').controller('rentHouseListCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		if($scope.filterActiveIndex){
			$scope.closeFilter()
		}else{
			appUtils.back();
		}
	}
	$scope.pageType=$stateParams.type || 2;
	
	
	$scope.classify=$stateParams.classify
	switch ($scope.classify){
		// case '住宅':
		// 	$scope.queryType=2;
		// 	break;
		case '商铺':
			$scope.queryType=1;
			break;
		case '写字楼':
			$scope.queryType=2;
			break;
		case '厂房':
			$scope.queryType=3;
			break;
		case '仓库':
			$scope.queryType=4;
			break;
		case '车位':
			$scope.queryType=5;
			break;
		default:
			$scope.queryType=1;
			break;
	}
	
	
	// 改城市
	$rootScope.$on('appUtilsCityChange',function(event,value){
		$scope.rentQueryData.cityId = value.id;
		$scope.simpleQueryData.cityId = value.id;
		// 街道还原
		$scope.streetList=['不限']
		$ionicScrollDelegate.scrollTop();

		if($scope.classify=='住宅'){
			$scope.rentRefresh()
		}else{
			$scope.simpleRefresh()
		}
	})

	$scope.$on('$ionicView.enter',function(){
		$scope.rentQueryData.cityId = appUtils.city.id
		$scope.simpleQueryData.cityId = appUtils.city.id
		// 筛选
		$scope.initFilterData();
		// 多选
		if($rootScope.fromStateName=='tabs.rentPage'||$rootScope.fromStateName=='tabs.Home'){
			$scope.initFilterMore()
		}
		// 重置可加载
		$scope.rentHaveMore=true;
		$scope.simpleHaveMore=true;
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
	// 更多筛选
	$scope.initFilterMore=function(){
		$http.get('jsonData/houseFilter/rentHouseFilter.json').then(function(resData){
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
		if($scope.classify=='住宅'){
			if(value=='不限'){
				$scope.rentQueryData.district='';
			}else{
				$scope.rentQueryData.district=key;
			}
		}else{
			if(value=='不限'){
				$scope.simpleQueryData.district='';
			}else{
				$scope.simpleQueryData.district=key;
			}
		}
		$scope.streetList=value;
		$ionicScrollDelegate.$getByHandle('rent-filter-street-scroll').scrollTop();
	}
	// 选街道
	$scope.streetList=['不限']
	$scope.showStreetText=$stateParams.street || ''
	$scope.chooseStreet=function(value){
		$scope.closeFilter();
		$scope.showStreetText=value;
		if($scope.classify=='住宅'){
			if(value=='不限'){
				$scope.rentQueryData.street='';
				$scope.rentQueryData.district='';
				$scope.rentRefresh(false);
			}else{
				$scope.rentQueryData.street=value;
				$scope.rentRefresh(false);
			}

		}else{
			if(value=='不限'){
				$scope.simpleQueryData.street='';
				$scope.simpleQueryData.district='';
				$scope.simpleRefresh(false);
			}else{
				$scope.simpleQueryData.street=value;
				$scope.simpleRefresh(false);
			}
		}
	}
	// 选价格
	if(!$stateParams.minprize&&$stateParams.maxprize){
		$scope.showPriceText=$stateParams.maxprize+'元/月以下'
	}else if($stateParams.minprize&&!$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'元/月以上'
	}else if($stateParams.minprize&&$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'-'+$stateParams.maxprize+'元/月'
	}else{
		$scope.showPriceText=''
	}

	$scope.choosePrice=function(min,max){
		$scope.closeFilter();
		if(!min&&max){
			$scope.showPriceText=max+'元/月以下'
		}else if(min&&!max){
			$scope.showPriceText=min+'元/月以上'
		}else if(min&&max){
			$scope.showPriceText=min+'-'+max+'元/月'
		}else{
			$scope.showPriceText='不限'
		}
		if($scope.classify=='住宅'){
			$scope.rentQueryData.minprize=min;
			$scope.rentQueryData.maxprize=max;
			$scope.rentRefresh(false);
		}else{
			$scope.simpleQueryData.minprize=min;
			$scope.simpleQueryData.maxprize=max;
			$scope.simpleRefresh(false);
		}
	}
	// 选排序
	// 选排序
	if($stateParams.sort*1==1){
		$scope.showSortText='面积从大到小'
	}else if($stateParams.sort*1==2){
		$scope.showSortText='面积从小到大'
	}else if($stateParams.sort*1==3){
		$scope.showSortText='租金从小到大'
	}else if($stateParams.sort*1==4){
		$scope.showSortText='租金从大到小'
	}else{$scope.showSortText=''}
	$scope.chooseSort=function(text,value){
		$scope.closeFilter();
		$scope.showSortText=text;
		if($scope.classify=='住宅'){
			$scope.rentQueryData.sort=value;
			$scope.rentRefresh(false);
		}else{
			$scope.simpleQueryData.sort=value;
			$scope.simpleRefresh(false);
		}
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
		if($scope.classify=='住宅'){
			$scope.rentQueryData.roomType=value;
			$scope.rentRefresh(false);
		}else{
		
		}
	}

	//选房源类型
	$scope.chooseHouseType=function(text,id){
		$scope.closeFilter();
		$scope.classify=text;
		
		if($scope.classify=='住宅'){
			$scope.rentRefresh(false);
		}else{
			switch ($scope.classify){
				// case '住宅':
				// 	$scope.queryType=2;
				// 	break;
				case '商铺':
					$scope.queryType=1;
					break;
				case '写字楼':
					$scope.queryType=2;
					break;
				case '厂房':
					$scope.queryType=3;
					break;
				case '仓库':
					$scope.queryType=4;
					break;
				case '车位':
					$scope.queryType=5;
					break;
				default:
					$scope.queryType=1;
					break;
			}
			$scope.simpleRefresh(false);
		}
	} 

	// 更多 确认筛选
	$scope.confirmFilter=function(){
		if($scope.classify=='住宅'){
			$scope.rentRefresh(false);
		}else{
			$scope.simpleRefresh(false);
		}
		$scope.closeFilter()
	}
	$scope.resetFilter=function(){
		$scope.moreFilterData=JSON.parse(JSON.stringify($scope.moreFilterRes));
		$scope.rentQueryData.sort=null
		$scope.simpleQueryData.sort=null
	}	

	$scope.showQueryText=$stateParams.query;
	//租房手房加载 
	$scope.rentQueryData={
		cityId:appUtils.city.id,
		pagesize:10,
		pagenum:0,
		type:2,
		date:$stateParams.date,//整租合租直租中介
		query:$stateParams.query,
		district:$stateParams.district,
		street:$stateParams.street,
		minprize:$stateParams.minprize,
		maxprize:$stateParams.maxprize,
		roomType:$stateParams.roomtype,
		sort:$stateParams.sort,
		Orientation:[],
		Fitment:[],
		BuildType:[],
		Special:[],
		Spaces:[],
		Floor:[]
	}
	function _loadRent(){
		$scope.rentHaveMore=true;
		$scope.renthousearr=[];
			function loadRent(ifloadmore){
			$http.post($Factory.NewHouseSource.publicquery.url,$scope.rentQueryData)
			.success(function(resData){
				$ionicLoading.hide();
				
				if(resData.length<=0){
					$scope.rentHaveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
					if(ifloadmore)return;
				}
				$scope.rentHaveMore = true;
				if(ifloadmore){
					$scope.rentQueryData.pagenum += 1;
					$scope.renthousearr=$scope.renthousearr.concat(resData);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.rentQueryData.pagenum = 1;
					$scope.renthousearr=resData;
					$scope.$broadcast('scroll.refreshComplete');
				}
			}).error(function(){
				$ionicLoading.hide();
				$scope.rentHaveMore = false;
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
		}
		$scope.rentLoadMore = function(ifloadmore){
			loadRent(true);
		}
		$scope.rentRefresh = function(ifloadmore){
			// 更多筛选数据转换
			for(var i=0;i<$scope.moreFilterData.length;i++){
				if($scope.moreFilterData[i].field){
					$scope.rentQueryData[$scope.moreFilterData[i].field]=[];
					for(var j=0;j<$scope.moreFilterData[i].list.length;j++){
						if($scope.moreFilterData[i].list[j].isChecked){
							var _value = $scope.moreFilterData[i].list[j].value
							$scope.rentQueryData[$scope.moreFilterData[i].field].push(_value)
						}
					}
					
				}
			}

			$scope.rentQueryData.pagenum=0
			loadRent(false);
			$ionicScrollDelegate.$getByHandle('renthouse-list-scroll').scrollTop();
		}
	}

	//二类房源加载 
	$scope.simpleQueryData={
		cityId:appUtils.city.id,
		pagesize:10,
		pagenum:0,
		type:$scope.queryType,
		date:2,
		query:'',
		district:'',
		street:'',
		minprize:'',
		maxprize:'',
		roomType:'',
		sort:'',
		date:$stateParams.date,
		behaviour:2,
		Orientation:null,
		Fitment:null,
		BuildType:null,
		Special:null,
		Spaces:null,
		Floor:null
	}
	function _loadSimple(){
		$scope.simpleHaveMore=true;
		$scope.simplehousearr=[];
		 function loadSimple(ifloadmore){
			var req = {
				method: 'POST',
				url: $Factory.SimpleHouse.publicquery.url,
				headers: {
				'Content-Type': 'application/json'
				},
				data: $scope.simpleQueryData
			}
			$http(req)
			.success(function(resData){
				$ionicLoading.hide();

				if(resData.length<=0){
					$scope.simpleHaveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.simpleHaveMore = true;
				if(ifloadmore){
					$scope.simpleQueryData.pagenum += 1;
					$scope.simplehousearr=$scope.simplehousearr.concat(resData);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.simpleQueryData.pagenum=1;
					$scope.simplehousearr=resData;
					$scope.$broadcast('scroll.refreshComplete');
				}
				
			}).error(function(){
				$ionicLoading.hide();
				$scope.simpleHaveMore = false;
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
		}
		$scope.simpleLoadMore = function(ifloadmore){
			loadSimple(true);
		}
		$scope.simpleRefresh = function(ifloadmore){
			// 更多筛选数据转换
			for(var i=0;i<$scope.moreFilterData.length;i++){
				if($scope.moreFilterData[i].field){
					$scope.simpleQueryData[$scope.moreFilterData[i].field]=[];
					for(var j=0;j<$scope.moreFilterData[i].list.length;j++){
						if($scope.moreFilterData[i].list[j].isChecked){
							var _value = $scope.moreFilterData[i].list[j].value
							$scope.simpleQueryData[$scope.moreFilterData[i].field].push(_value)
						}
					}
					
				}
			}

			$scope.simpleQueryData.pagenum=0;
			loadSimple(false);
			$ionicScrollDelegate.$getByHandle('renthouse-list-scroll').scrollTop();
		}
	}

	_loadRent()
	_loadSimple()
	if($scope.classify=='住宅'){
	}else{
	}


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
		
    });
	
})