angular.module('App').controller('getBonusCtl',function(enterViewLoad,appUtils,$rootScope,$timeout,$interval,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}


	$scope.$on('$ionicView.enter',function(){
		$scope.initData()
	})
	$scope.$on('$ionicView.leave',function(){
		if($scope.intervalName)$interval.cancel($scope.intervalName)
	})
	$scope.goOpenvip=function(){
		$state.go('openVip')
	}
	$scope.initData=function(){
		$http.post($Factory.WaitReceive.bonuslist.url+'?uid='+$stateParams.id).then(function(res){
			if(res.data.result.length>0){
				var result=res.data.result[0]
				result.Attach=JSON.parse(result.Attach)
				$scope.pageData = result
				if($scope.pageData.DataStaus!==0){
					enterViewLoad.customload('该奖励记录已失效')
				}
				console.log($scope.pageData)
				$scope.intervalName = $interval(function(){
					for(var i=0;i<$scope.pageData.Attach.length;i++){
						--$scope.pageData.Attach[i].EndedSec
					}
					--$scope.pageData.StartSec 
				},1000)
				// $scope.userRoles=res.data.userRole ? res.data.userRole.split('|') : [];//可领奖励金的身份
				// $scope.pageData=res.data.result.filter(function(item){
				// 	item.Attach=JSON.parse(item.Attach)
				// 	item.Attach=item.Attach.reverse()
				// 	item.Attach=item.Attach.filter(function(attach){
				// 		if($scope.userRoles.indexOf(attach.Role)>=0){
				// 			attach.canGet=true
				// 		}else{
				// 			attach.canGet=false
				// 		}
				// 		return attach
				// 	})
				// 	return item
				// })
			}else{
				enterViewLoad.customload('该奖励记录已失效')
				$scope.pageData={}
			}
			// $scope.intervalName = $interval(function(){
			// 	for(var i=0;i<$scope.pageData.length;i++){
			// 		$scope.pageData[i].StartSec=$scope.pageData[i].StartSec-1
			// 	}
			// },1000)
		}).catch(function(){
			enterViewLoad.customload('请求数据失败')
		})
	}

	
	// 暂不可领取
	$scope.disGet=function(){
		enterViewLoad.customload('未到领取时间',2000)
	}
	// 领取奖励金
	$scope.getBonus=function(item){
		$http.post($Factory.WaitReceive.getbonus.url+'?id='+$scope.pageData.Id+'&role='+item.Role)
		.then(function(res){
			enterViewLoad.customload('领取成功')
			$timeout(function(){
				$scope.back()
			},1500)
		}).catch(function(err){
			var msg = err.data.Message || '领取失败'
			enterViewLoad.customload(msg)
		})
	}
	// 领取累积人数
	$scope.getUser=function(item){
		$http.post($Factory.WaitReceive.getuser.url+'?id='+$scope.pageData.Id+'&role=user')
		.then(function(res){
			enterViewLoad.customload('累积成功')
			$timeout(function(){
				$scope.back()
			},1500)
		}).catch(function(err){
			var msg = err.data.Message || '领取失败'
			enterViewLoad.customload(msg)
		})
	}

	// 领取累积人数
	$scope.getVip=function(item){
		$http.post($Factory.WaitReceive.getvip.url+'?id='+$scope.pageData.Id+'&role='+null)
		.then(function(res){
			enterViewLoad.customload('领取成功')
			$timeout(function(){
				$scope.back()
			},1500)
		}).catch(function(err){
			var msg = err.data.Message || '领取失败'
			enterViewLoad.customload(msg)
		})
	}
})


