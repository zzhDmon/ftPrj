angular.module('App').controller('addSellAddressCtl',function($addSellData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.placeholder="请输入房地坐落，请根据房产证上填写！！！"
	$timeout(function(){
		$scope.ershoutd= {content: $addSellData.data.Address || ''};
	
	})
			$scope.save=function(){
				console.log(1)
				$addSellData.data.Address=$scope.ershoutd.content;
				$scope.back();
			}

	
})
