
angular.module('App').controller('productDetailCtl',function(appUtils,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	
	$scope.back=function(){
		appUtils.back();
	}
	

	$scope.goodsCount=1;
	$scope.changeGoodsCount=function(iftrue){
		if(iftrue){
			$scope.goodsCount++;
		}else{
			$scope.goodsCount--
		}
	}


})

