
angular.module('App').controller('addNewAddressCtl',function($addNewData,appUtils,$localStorage,$rootScope,$scope,$stateParams,$ionicLoading,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			$scope.address=$addNewData.data.Address || '';
			$scope.newaddress={
				location: $scope.address,
				longitude:$addNewData.data.Longitude,
				latitude:$addNewData.data.Latitude
			};
		})
		
	})
	
	
	

	$scope.getAddr = function(){
		var map = new BMap.Map("add_new_address_map");      
		map.centerAndZoom(new BMap.Point(118.181163, 24.488326), 11);      
		var myGeo = new BMap.Geocoder();         
		myGeo.getPoint($scope.newaddress.location, function(point){   
			if (point) {  
				$scope.newaddress.longitude=point.lng; 
				$scope.newaddress.latitude=point.lat; 
				map.centerAndZoom(point, 16);      
				map.addOverlay(new BMap.Marker(point));      
			}else{
				$scope.newaddress.longitude=''; 
				$scope.newaddress.latitude='';
				$ionicLoading.show({
					template:'请输入详细地址',
					duration:1500
				})
			}     
		}, 
		"厦门市"); 
	}

	$scope.save=function(){
		$addNewData.data.Address=$scope.newaddress.location;		
		$addNewData.data.Longitude=$scope.newaddress.longitude;		
		$addNewData.data.Latitude=$scope.newaddress.latitude;		
		// $ionicHistory.goBack();
		$timeout(function(){
			$rootScope.$ionicGoBack();
		},50)	
	}
	  
})
