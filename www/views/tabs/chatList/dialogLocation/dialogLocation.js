
angular.module('App').controller('dialogLocationCtl',function(enterViewLoad,appUtils,$ionicPopup,$localStorage,$ionicModal,$rootScope,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.lng = $stateParams.lng
	$scope.lat = $stateParams.lat
	$scope.mark = $stateParams.mark
	//GPS定位
	var map = new BMap.Map("dialog_location_content");      
	map.centerAndZoom(new BMap.Point($scope.lng, $scope.lat), 16); 
	map.addOverlay(new BMap.Marker(new BMap.Point($scope.lng, $scope.lat)));      
	
	
	// com.tencent.map  腾讯地图包名
	$scope.gMap=function(){
		document.addEventListener("deviceready",function(){
			if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){
				//ios平台
				cordovaNaviMap.amapRoute('iosamap://path?sourceApplication=房田'+
				'&dlat='+$scope.lat+'&dlon='+$scope.lng+'&dname='+$scope.mark+'&dev=0&t=0'
					,function(res){
						//成功
					},function(err){
						//失败
						enterViewLoad.customload(err)
					}
				);
			}else{ 
				//android平台
				cordovaNaviMap.amapRoute('amapuri://route/plan/?sourceApplication=房田'+
				'&dlat='+$scope.lat+'&dlon='+$scope.lng+'&dname='+$scope.mark+'&dev=0&t=0'
					, function(res){
					},function(err) {
						//失败
						enterViewLoad.customload(err)
					});
			}
			// appAvailability.check("com.autonavi.minimap",function () {  
			// 	if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){
			// 		//ios平台
			// 		cordovaNaviMap.amapRoute('iosamap://path?sourceApplication=房田'+
			// 		'&dlat='+$scope.lat+'&dlon='+$scope.lng+'&dname='+$scope.mark+'&dev=0&t=0'
			// 			,function(res){
			// 				//成功
			// 			},function(err){
			// 				//失败
			// 				enterViewLoad.customload('打开失败')
			// 			}
			// 		);
			// 	}else{ 
			// 		//android平台
			// 		cordovaNaviMap.amapRoute('amapuri://route/plan/?sourceApplication=房田'+
			// 		'&dlat='+$scope.lat+'&dlon='+$scope.lng+'&dname='+$scope.mark+'&dev=0&t=0'
			// 			, function(res){
			// 			},function(err) {
			// 				//失败
			// 				enterViewLoad.customload('打开失败')
			// 			});
			// 	}
			// },function () {
			// 	//error callback 
			// 	enterViewLoad.customload('尚未安装高德地图')       
			// });

		},false)
	}

		
	$scope.bMap=function(){
		document.addEventListener("deviceready",function(){
			// appAvailability.check("com.baidu.BaiduMap",function (){   
			// 	//百度
			// 	cordovaNaviMap.bdmapRoute('baidumap://map/direction?'+
			// 	'destination=latlng:'+$scope.lat+','+$scope.lng+'|name:'+$scope.mark+'&mode=driving'
			// 	,function(res){
			// 		//成功
			// 	},function(err){
			// 		//失败
			// 		enterViewLoad.customload('打开失败')
			// 	});
			// },function () {
			// 	//error callback  
			// 	enterViewLoad.customload('尚未安装百度地图')   
			// });
			//百度
			cordovaNaviMap.bdmapRoute('baidumap://map/direction?'+
				'destination=latlng:'+$scope.lat+','+$scope.lng+'|name:'+$scope.mark+'&mode=driving'
				,function(res){
					//成功
				},function(err){
					//失败
					enterViewLoad.customload(err)
				});
		},false)
	}

	$ionicModal.fromTemplateUrl('dialog_location_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
})
