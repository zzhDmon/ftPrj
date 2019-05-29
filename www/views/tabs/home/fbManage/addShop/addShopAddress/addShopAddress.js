angular.module('App').controller('addShopAddressCtl',function($addShopData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.placeholder="请输入房地坐落，请根据房产证上填写！！！"
	$timeout(function(){
		$scope.ershoutd= {content: $addShopData.data.Address || ''};
	
		$scope.save=function(){
			$addShopData.data.Address=$scope.ershoutd.content;
			$scope.back();
		}
	})

	
})
