angular.module('App').controller('clientDetailCtl',function(appUtils,$timeout,$ionicPopup,$state,$stateParams,$ionicActionSheet,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicLoading,$ionicSlideBoxDelegate){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.gochat=function(){
		$state.go('dialogBox',{id:'上帝'})
	}
			
})
.filter('customFilter',function(){
		//返回的方法中参数
		//1.要过滤的数据  2.过滤器第一个冒号后面参数 3.过滤器第二个冒号后面参数
		return function(value,symbol,fraction){
			//console.log(arguments)
			//如果没有传递保留位数，默认保留两位
			fraction = fraction || 2;
			//防止value没有值
			if(!value){
				return
			}
			value = value.toFixed(fraction);
			var dotIndex = value.indexOf('.');
			while(dotIndex>3){
				dotIndex -=3;
				value=value.substring(0,dotIndex)+','+value.substring(dotIndex)
			}
			symbol = symbol || ""
			return symbol+ value;
		}
	})
