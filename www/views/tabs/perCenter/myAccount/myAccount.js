
angular.module('App').controller('myAccountCtl',function(appUtils,enterViewLoad,$localStorage,$ionicModal,$timeout,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		// 余额
		$http.post($Factory.Money.money.url)
			.then(function(resData){
				$scope.myBalance=((resData.data.Total)/100).toFixed(2);
				$scope.disCount=((resData.data.DisTotal)/100).toFixed(2);
				$scope.pageData=resData.data
				// resData.data.Scores 积分
				// resData.data.Vochers 抵用券
			}).catch(function(err){
			})		
	})
	$ionicModal.fromTemplateUrl('my_account_rule_modal', {
		scope: $scope,
		animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.modal = modal;
	});
	$scope.showModal=function(type){
		$scope.ruleType=type
		$scope.modal.show();
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
})

