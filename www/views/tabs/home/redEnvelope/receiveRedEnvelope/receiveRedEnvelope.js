
angular.module('App').controller('receiveRedEnvelopeCtl',function(appUtils,$timeout,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		if($stateParams.open){
			$scope.redPack()
		}else{
			$scope.myReds()
		}
	})

	$scope.redPack=function(){
		$http.post($Factory.Draw.redpack.url)
			.then(function(resData){
				$scope.redNum=resData.data;
				$scope.myReds()
			}).catch(function(){
				$scope.redNum=0;
				$scope.myReds()
			})
	}
	$scope.myReds=function(){
		$http.post($Factory.Draw.myreds.url)
			.then(function(resData){
				$scope.myRedList=resData.data.filter(function(item){
					item.CreateTime=item.CreateTime.replace(/T/, " ")
					return item
				})
			}).catch(function(){
				$scope.myRedList=[];
			})
	}
})
