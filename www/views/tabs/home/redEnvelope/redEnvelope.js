
angular.module('App').controller('redEnvelopeCtl',function(appUtils,$timeout,$scope,$state,$ionicModal,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.openRed=function(){
		if($scope.redTimes>0){
			$state.go('receiveRedEnvelope',{open:true})
		}else{
			$scope.openAlert()
		}
	}

	$scope.openAlert=function(){
		if($scope.nullTimeout) $timeout.cancel($scope.nullTimeout);		
		if($scope.showNull){
			$scope.showNull=false
		}else{
			$scope.showNull=true;
			$scope.nullTimeout=$timeout(function(){
				$scope.showNull=false;
			},2000);
		}
	}

	$scope.$on('$ionicView.enter',function(){
		$http.post($Factory.Draw.redtimes.url)
			.then(function(resData){
				$scope.redTimes=resData.data;
			}).catch(function(){
				$scope.redTimes=0;
			})
	})

	$ionicModal.fromTemplateUrl('redenvelope_rule_modal', {
		scope: $scope,
		animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
})
