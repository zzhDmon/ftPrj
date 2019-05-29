angular.module('App').controller('chooseHouseTagsCtl',function(enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();	
	}
	
	$scope.chooseData={
		brt:'',
		bus:'',
		subway:'',
		business:'',
		school:'',
		scenic:'',
	}
	// $scope.brtArr=['暂无']
	// $scope.busArr=['暂无']
	// $scope.subwayArr=['暂无']
	// $scope.businessArr=['暂无']
	// $scope.schoolArr=['暂无']
	// $scope.scenicArr=['暂无']
	
	// $scope.createChoose=function(){
	// 	$.scrEvent({
	// 		data: $scope.brtArr,  
	// 		evEle: '.brt-tags',       
	// 		title: '请选择brt站',         
	// 		defValue: '',          
	// 		afterAction: function (data) { 
	// 			$(".brt-tags").val(data);
	// 			$scope.chooseData.brt=data;  
	// 		}
	// 	 });
	// 	$.scrEvent({
	// 		data: $scope.busArr,  
	// 		evEle: '.bus-tags',       
	// 		title: '请选择公交站',         
	// 		defValue: '',          
	// 		afterAction: function (data) { 
	// 			$(".bus-tags").val(data);
	// 			$scope.chooseData.bus=data;  
	// 		}
	// 	 });
	// 	$.scrEvent({
	// 		data: $scope.subwayArr,  
	// 		evEle: '.subway-tags',       
	// 		title: '请选择地铁站',         
	// 		defValue: '',          
	// 		afterAction: function (data) { 
	// 			$(".subway-tags").val(data);
	// 			$scope.chooseData.subway=data;  
	// 		}
	// 	 });
	// 	$.scrEvent({
	// 		data: $scope.businessArr,  
	// 		evEle: '.business-tags',       
	// 		title: '请选择商圈',         
	// 		defValue: '',          
	// 		afterAction: function (data){ 
	// 			$(".business-tags").val(data);
	// 			$scope.chooseData.business=data;  
	// 		}
	// 	 });
	// 	$.scrEvent({
	// 		data: $scope.schoolArr,  
	// 		evEle: '.school-tags',       
	// 		title: '请选择学校',         
	// 		defValue: '',          
	// 		afterAction: function (data) { 
	// 			$(".school-tags").val(data);
	// 			$scope.chooseData.school=data;  
	// 		}
	// 	});
	// 	$.scrEvent({
	// 		data: $scope.scenicArr,  
	// 		evEle: '.scenic-tags',       
	// 		title: '请选择景区',         
	// 		defValue: '',          
	// 		afterAction: function (data) { 
	// 			$(".scenic-tags").val(data);
	// 			$scope.chooseData.scenic=data;  
	// 		}
	// 	});
	// }
	// $scope.createChoose()
	 
	var filterArr=function(oldArr,newArr){		
		if(oldArr.length<1){
			newArr=['暂无']
		}else{
			for(var i=0;i<oldArr.length;i++){
				newArr.push(oldArr[i].title)
			}
		}
		return newArr
	}

	var extendArr=function(oldArr,newArr){
		for(var i=0;i<oldArr.length;i++){
			newArr.push(angular.extend({
									isChecked: false
								}, oldArr[i]))			
		}
		return newArr
	}

	// 百度地图API功能
	var map = new BMap.Map("choose_house_tags_map");    
  	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint("厦门 国金广场", function(point){
		if (point) {
          	map.centerAndZoom(point, 18);
			map.addOverlay(new BMap.Marker(point));
			var local = new BMap.LocalSearch(map, {
				renderOptions:{map: map},
				onSearchComplete:function(res){
					
					$scope.brtArr=extendArr(res[0].Br,[])
					$scope.busArr=extendArr(res[1].Br,[])
					$scope.subwayArr=extendArr(res[2].Br,[])
					$scope.businessArr=extendArr(res[3].Br,[])
					$scope.schoolArr=extendArr(res[4].Br,[])
					$scope.scenicArr=extendArr(res[5].Br,[])
				}  
			});		
			local.searchNearby(['BRT','公交站','地铁站','商圈','学校','景区']
							,point,1000);
							
			}
    })
})
