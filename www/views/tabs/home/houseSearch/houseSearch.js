angular.module('App')
.controller('houseSearchCtl',function(appUtils,$ionicScrollDelegate,$ionicModal,$stateParams,$timeout,$state,$Factory,$http,$scope){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.houseType=$stateParams.type?$stateParams.type*1:0;

	$scope.chooseHouseType=function(index){
		$scope.houseType=index;
		var left = 33.33*index+12.5+'%'
		$('#house_search .switch-wrapper .under-line').animate({
			left:left
		},200)
	}
	$timeout(function(){
		$scope.chooseHouseType($scope.houseType)
	})

	$scope.searchData={
		sort:'',
		roomtype:'',
		district:'',
		street:'',
		minprize:'',
		maxprize:'',
		query:''
	}


	$scope.districtList=[]
	$scope.streetList=[]
	appUtils.getCurrentDistricts(function(res){
		$scope.districtList =angular.extend({
			'不限':['不限']
		},res)
	})

	$scope.areaClicked={
		district:'',
		street:''
	}
	$scope.districtActive=null
	$scope.streetActive=null
	$scope.isShowStreet=false
	$scope.districtChoose=function(index,key,value){
		$ionicScrollDelegate.$getByHandle('housesearch-street-scroll').scrollTop();
		$scope.districtActive=index;
		$scope.streetActive=null;

		$scope.streetList=value
		if(key=='不限'){
			$scope.areaClicked.district='';
		}else{
			$scope.areaClicked.district=key;
		}
		$scope.isShowStreet=true;
	}
	$scope.streetChoose=function(index,text){
		$scope.streetActive=index;
		if(text=='不限'){
			$scope.areaClicked.street='';
		}else{
			$scope.areaClicked.street=text;
		}
	}

	$ionicModal.fromTemplateUrl('house_search_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		// $scope.isShowStreet=false;
		// $scope.districtActive=null
		$scope.modal.hide();
	}

	// 选择区域

	$scope.reset=function(){
		$scope.isShowStreet=false;
		$scope.districtActive=null;
		$scope.areaClicked.district='';
		$scope.areaClicked.street='';

	}
	$scope.confirm=function(){
		$scope.searchData.district=$scope.areaClicked.district;
		$scope.searchData.street=$scope.areaClicked.street;
		$scope.closeModal();
	}

	
	// 价格
	$("#house_price_range_new").ionRangeSlider({
		type: "double",
		min: 0,
		max: 50000,
		from: 0,
		to: 50000,
		postfix: "元/m²"
	});
	$scope.sliderNew = $("#house_price_range_new").data("ionRangeSlider");
	$("#house_price_range_sell").ionRangeSlider({
		type: "double",
		min: 0,
		max: 2000,
		from: 0,
		to: 2000,
		postfix: "万"
	});
	$scope.sliderSell = $("#house_price_range_sell").data("ionRangeSlider");
	$("#house_price_range_rent").ionRangeSlider({
		type: "double",
		min: 0,
		max: 10000,
		from: 0,
		to: 10000,
		postfix: "元/月"
	});
	$scope.sliderRent = $("#house_price_range_rent").data("ionRangeSlider");

	$scope.search=function(){
		if($scope.houseType==0){
			$scope.searchData.minprize=$scope.sliderNew.old_from
			if($scope.sliderNew.old_to==50000){
				$scope.searchData.maxprize=null;
				$state.go('tabs.newHouseArr',$scope.searchData)
			}else{
				$scope.searchData.maxprize=$scope.sliderNew.old_to;
				$state.go('tabs.newHouseArr',$scope.searchData)
			}
		}else if($scope.houseType==1){
			$scope.searchData.minprize=$scope.sliderSell.old_from
			if($scope.sliderSell.old_to==2000){
				$scope.searchData.maxprize=null;
				$state.go('ershouHouseList',angular.extend({classify:'住宅'},$scope.searchData))
			}else{
				$scope.searchData.maxprize=$scope.sliderSell.old_to
				$state.go('ershouHouseList',angular.extend({classify:'住宅'},$scope.searchData))
			}
		}else{
			$scope.searchData.minprize=$scope.sliderRent.old_from
			if($scope.sliderRent.old_to==1000){
				$scope.searchData.maxprize=null
				$state.go('rentHouseList',angular.extend({classify:'住宅'},$scope.searchData))
			}else{
				$scope.searchData.maxprize=$scope.sliderRent.old_to
				$state.go('rentHouseList',angular.extend({classify:'住宅'},$scope.searchData))
			}
		}
		
	}

	document.getElementById("house_search_keyword").addEventListener("keydown",function(e){
		if(13 == e.keyCode){
            $scope.search()
        }
    },false);
})