angular.module('App').controller('waitForPayingCtl',function(enterViewLoad,appUtils,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()

		$scope.timeLeft=90;
		$scope.startCountDown()
	})
	$scope.$on('$ionicView.leave',function(){
		if($scope.clock){
			$scope.timeLeft=90;
			$interval.cancel($scope.clock);
		}
	})
	// 房产时报
	$scope.loadhousetimes=function(){
		$http.post($Factory.News.query.url,{type:1,pagenum:0,pagesize:4})
			.then(function(resData){
				$scope.housetimesList=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取房产时报失败')
			})
	}

	
	$scope.startCountDown=function(){
		$scope.clock = $interval(function(){
			$scope.timeLeft--
			if($scope.countDownNum<1){
				$scope.endCountDownNum()
			}
		},1000);
	}

	$scope.cancelOrder=function(){
		var confirmPopup = $ionicPopup.confirm({
			title: '确定取消订单？',
			cancelText: '取消',
			okText: '确认'
		});
		
		confirmPopup.then(function(res) {
		if(res) {
			
		}else{
			
		}
		});
	}
	
})