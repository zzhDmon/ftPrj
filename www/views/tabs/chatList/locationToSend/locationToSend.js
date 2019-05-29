
angular.module('App').controller('locationToSendCtl',function(enterViewLoad,appUtils,$ionicScrollDelegate,$timeout,$scope,$state,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}

	appUtils.bMapLocation(function(res){
		$scope.lng=res.longitude
		$scope.lat=res.latitude
		$scope.loadMap()
	},function(err){
		enterViewLoad.customload('获取位置失败')
	})
	
	$scope.loadMap=function(){
		//GPS定位
		var map = new BMap.Map("location_to_send_bcontent");      
		map.centerAndZoom(new BMap.Point($scope.lng, $scope.lat), 16); 
	
		/**
		 * 拖拽
		 * **/ 
		var myIcon = new BMap.Icon('imgs/定位.png',new BMap.Size(32,32));//这里先不用第三个参数IconOptions
		newMark(new BMap.Point($scope.lng, $scope.lat))
		function newMark(point){
			var mk = new BMap.Marker(point,{icon:myIcon});  
			mk.addEventListener("dragend", showInfo);
			mk.enableDragging();    //可拖拽
			
			// getAddress(point);
			map.addOverlay(mk);//把点添加到地图上 
	
			showInfo({point:new BMap.Point($scope.lng, $scope.lat)})
		  }
		//绑定Marker的拖拽事件
		function showInfo(e,point){
			var gc = new BMap.Geocoder();
			gc.getLocation(e.point, function(res){
				res.surroundingPois.unshift({
					title:res.address+res.business,
					point:res.point
				})
				$timeout(function(){
					$scope.addressList = res.surroundingPois;
					$ionicScrollDelegate.$getByHandle('location-adrlist-scroll').scrollTop();
					$scope.indexChoosed = 0;
				})
			});
		}
	}

	// 选择地址
	$scope.indexChoosed = 0;
	$scope.chooseAddress=function(index){
		$scope.indexChoosed=index;
	}
	// 点击发送
	$scope.send=function(){
		nim.sendGeo({
			scene:  $stateParams.toscene,
			to:  $stateParams.toid,
			geo: {
				lng: $scope.addressList[$scope.indexChoosed].point.lng,
				lat: $scope.addressList[$scope.indexChoosed].point.lat,
				title: $scope.addressList[$scope.indexChoosed].title
			},
			done:function(error, msg) {
				if(!error){
					enterViewLoad.customload('发送成功')
					$timeout(function(){
						$scope.back()
					},1500)
				}else{
					enterViewLoad.customload('发送失败')
				}
			}
		});
	}
	
	
})
