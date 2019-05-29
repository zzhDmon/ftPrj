angular.module('App').controller('shippingAddressCtl',function(appUtils,enterViewLoad,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.paramsId=$stateParams.id
	
	$scope.subData={
		Name: "",
		Phone: "",
		Province: "",
		City: "",
		District: "",
		Street: "",
		Address: "",
		Tag: 0,
		IsDefault: true,
	}

	$scope.$on('$ionicView.enter',function(){
		if($stateParams.id){
			$http.get($Factory.UserAddress.get.url+'?id='+$stateParams.id).then(function(resData){
				$scope.subData=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
		}else{
		}
	})

	$scope.tagList=[
		{id:0,text:'家'},
		{id:10,text:'公司'},
		{id:250,text:'学校'},
	]

	var vm=$scope.vm={};
	vm.cb = function(){
		$scope.subData.Province=vm.CityPickData1.areaData[0] || ''
		$scope.subData.City=vm.CityPickData1.areaData[1] || ''
		$scope.subData.District=vm.CityPickData1.areaData[2] || ''
	}
	if($stateParams.province){
		vm.CityPickData1 = {
			areaData: [],
			defaultAreaData: [$stateParams.province, $stateParams.city, $stateParams.district],
			title: '省、市、区县',
			buttonClicked: function () {
			  vm.cb()
			},
			tag: '/',
		}
	}else{
		vm.CityPickData1 = {
			areaData: [],
			title: '省、市、区县',
			buttonClicked: function () {
			  vm.cb()
			},
			tag: '/',
		}
	}


	$scope.saveAddress=function(){
		$http.post($Factory.UserAddress.save.url,$scope.subData)
		.then(function(resData){
			var msg = $scope.paramsId ? '修改成功' : '新增成功'
			enterViewLoad.customload(msg)
			$timeout(function(){$scope.back()},1500)
		}).catch(function(){
			var msg = $scope.paramsId ? '修改失败' : '新增失败'
			enterViewLoad.customload(msg)
		})
	}
})

