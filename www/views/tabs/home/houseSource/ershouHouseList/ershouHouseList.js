angular.module('App').controller('ershouHouseListCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		if($scope.filterActiveIndex){
			$scope.closeFilter()
		}else{
			appUtils.back();
		}
	}
	
	$scope.classify=$stateParams.classify
	switch($scope.classify){
		case '商铺':
			$scope.queryType=1;
			break
		case '写字楼':
			$scope.queryType=2;
			break
		case '工厂':
			$scope.queryType=3;
			break
		case '仓库':
			$scope.queryType=4;
			break
		case '车位':
			$scope.queryType=5;
			break
		default:
			$scope.queryType=1;
			break
	}

	// 改城市
	$rootScope.$on('appUtilsCityChange',function(event,value){
		$scope.oldQueryData.cityId = value.id
		$scope.simpleQueryData.cityId = value.id
		// 街道还原
		$scope.streetList=['不限'];
		$ionicScrollDelegate.scrollTop();
		
		if($scope.classify=='住宅'){
			$scope.oldRefresh()
		}else{
			$scope.simpleRefresh()
		}
	})
	$scope.$on('$ionicView.enter',function(){
		$scope.oldQueryData.cityId = appUtils.city.id;
		$scope.simpleQueryData.cityId = appUtils.city.id;
		// 筛选数据
		$scope.initFilterData()
		if($rootScope.fromStateName=='tabs.ershouPage'||$rootScope.fromStateName=='tabs.Home'){
			$scope.initFilterMore()
		}
		// 重置可加载
		$scope.oldHaveMore=true;
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

	$scope.initFilterMore=function(){
		// 更多筛选
		$http.get('jsonData/houseFilter/oldHouseFilter.json').then(function(resData){
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
				$scope.oldQueryData.district='';
			}else{
				// $scope.oldQueryData.district='';
				$scope.oldQueryData.district=key;
			}
		}else{
			if(value=='不限'){
				$scope.simpleQueryData.district='';
			}else{
				$scope.simpleQueryData.district=key;
			}
		}
		$scope.streetList=value;
		$ionicScrollDelegate.$getByHandle('ershou-filter-street-scroll').scrollTop();
	}
	// 选街道
	$scope.streetList=['不限']
	$scope.showStreetText=$stateParams.street || '';
	$scope.chooseStreet=function(value){
		$scope.closeFilter();
		
		$scope.showStreetText=value;
		if($scope.classify=='住宅'){
			if(value=='不限'){
				$scope.oldQueryData.street='';
				$scope.oldQueryData.district='';
				$scope.oldRefresh(false);
			}else{
				$scope.oldQueryData.street=value;
				$scope.oldRefresh(false);
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
		$scope.showPriceText=$stateParams.maxprize+'万以下'
	}else if($stateParams.minprize&&!$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'万以上'
	}else if($stateParams.minprize&&$stateParams.maxprize){
		$scope.showPriceText=$stateParams.minprize+'-'+$stateParams.maxprize+'万'
	}else{
		$scope.showPriceText=''
	}
	$scope.choosePrice=function(min,max){
		$scope.closeFilter();
		if(!min&&max){
			$scope.showPriceText=max+'万以下'
		}else if(min&&!max){
			$scope.showPriceText=min+'万以上'
		}else if(min&&max){
			$scope.showPriceText=min+'万-'+max+'万'
		}else{
			$scope.showPriceText='不限'
		}
		if($scope.classify=='住宅'){
			$scope.oldQueryData.minprize=min;
			$scope.oldQueryData.maxprize=max;
			$scope.oldRefresh(false);
		}else{
			$scope.simpleQueryData.minprize=min;
			$scope.simpleQueryData.maxprize=max;
			$scope.simpleRefresh(false);
		}
	}
	// 选排序
	if($stateParams.sort*1==1){
		$scope.showSortText='面积从大到小'
	}else if($stateParams.sort*1==2){
		$scope.showSortText='面积从小到大'
	}else if($stateParams.sort*1==3){
		$scope.showSortText='售价从小到大'
	}else if($stateParams.sort*1==4){
		$scope.showSortText='售价从大到小'
	}else{$scope.showSortText=''}
	$scope.chooseSort=function(text,value){
		$scope.closeFilter();
		$scope.showSortText=text;
		if($scope.classify=='住宅'){
			$scope.oldQueryData.sort=value;
			$scope.oldRefresh(false);
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
			$scope.oldQueryData.roomType=value;
			$scope.oldRefresh(false);
		}else{
		
		}
	}

	//选房源类型
	$scope.chooseHouseType=function(text,id){
		$scope.closeFilter();
		$scope.classify=text;
		
		if($scope.classify=='住宅'){
			$scope.oldRefresh(false);
		}else{
			switch($scope.classify){
				case '商铺':
					$scope.queryType=1;
					break
				case '写字楼':
					$scope.queryType=2;
					break
				case '工厂':
					$scope.queryType=3;
					break
				case '仓库':
					$scope.queryType=4;
					break
				case '车位':
					$scope.queryType=5;
					break
				default:
					$scope.queryType=1;
					break
			}
			$scope.simpleRefresh(false);
		}
	} 

	// 更多 确认筛选
	$scope.confirmFilter=function(){
		if($scope.classify=='住宅'){
			$scope.oldRefresh(false);
		}else{
			$scope.simpleRefresh(false);
		}
		$scope.closeFilter()
	}
	$scope.resetFilter=function(){
		$scope.moreFilterData=JSON.parse(JSON.stringify($scope.moreFilterRes));
		$scope.oldQueryData.sort=null
		$scope.simpleQueryData.sort=null
	}	
	


	$scope.showQueryText=$stateParams.query;
	//二手房加载 
	$scope.oldQueryData={
		cityId: appUtils.city.id,
		pagesize:10,
		pagenum:0,
		type:1,
		query:$stateParams.query,
		district:$stateParams.district,
		street:$stateParams.street,
		minprize:$stateParams.minprize,
		maxprize:$stateParams.maxprize,
		roomType:$stateParams.roomtype,
		sort:$stateParams.sort,
		date:$stateParams.date,
		Orientation:[],
		Fitment:[],
		BuildType:[],
		Special:[],
		Spaces:[],
		Floor:[]
	}
	function _loadOld(){
		$scope.oldHaveMore=true;
		$scope.oldhousearr=[];
		function loadOld(ifloadmore){
			$http.post($Factory.NewHouseSource.publicquery.url,$scope.oldQueryData)
			.success(function(resData){
				$ionicLoading.hide();

				if(resData.length<=0){
					$scope.oldHaveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.oldHaveMore = true;
				if(ifloadmore){
					$scope.oldQueryData.pagenum += 1;
					$scope.oldhousearr=$scope.oldhousearr.concat(resData);
					// $scope.oldhousearr=[...$scope.oldhousearr,...resData];
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.oldQueryData.pagenum=1;
					$scope.oldhousearr=resData;
					$scope.$broadcast('scroll.refreshComplete');
				}
				
			}).error(function(){
				$scope.oldHaveMore = false;
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1000
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
		}
		$scope.oldLoadMore = function(ifloadmore){
			loadOld(true);
		}
		$scope.oldRefresh = function(ifloadmore){
			// 更多筛选数据转换
			for(var i=0;i<$scope.moreFilterData.length;i++){
				if($scope.moreFilterData[i].field){
					$scope.oldQueryData[$scope.moreFilterData[i].field]=[];
					for(var j=0;j<$scope.moreFilterData[i].list.length;j++){
						if($scope.moreFilterData[i].list[j].isChecked){
							var _value = $scope.moreFilterData[i].list[j].value
							$scope.oldQueryData[$scope.moreFilterData[i].field].push(_value)
						}
					}
				}
			}
			$scope.oldQueryData.pagenum=0;
			loadOld(false);
			$ionicScrollDelegate.$getByHandle('ershouhouse-list-scroll').scrollTop();
		}
	}
			
	
	//二类房源加载 
	$scope.simpleQueryData={
		cityId:appUtils.city.id,
		pagesize:10,
		pagenum:0,
		type:$scope.queryType,
		date:1,
		query:'',
		district:'',
		street:'',
		minprize:'',
		maxprize:'',
		roomType:'',
		sort:'',
		date:$stateParams.date,
		behaviour:1,
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
			$http.post($Factory.SimpleHouse.publicquery.url,$scope.simpleQueryData)
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
					// $scope.simplehousearr=[...$scope.simplehousearr,...resData];
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

			$scope.simpleQueryData.pagenum=0
			loadSimple(false);
			$ionicScrollDelegate.$getByHandle('ershouhouse-list-scroll').scrollTop();
		}
	}
	

	_loadOld();
	_loadSimple();
	if($scope.classify=='住宅'){
	}else{
	}


	$scope.renderdone=true;
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		$scope.renderdone=false;
		
    });
	
})