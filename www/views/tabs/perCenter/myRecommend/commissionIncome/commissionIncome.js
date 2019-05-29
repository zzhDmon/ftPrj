angular.module('App').controller('commissionIncomeCtl',function(appUtils,enterViewLoad,WechatService,$location,wechatLinkBase,$ionicModal,$rootScope,$ionicPopover,$ionicHistory,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$http.post($Factory.Account.gethier.url)
			.then(function(res){
				res.data.total=(res.data.total/100).toFixed(2)
				$scope.myInvitation=res.data;
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
	
		$scope.subListActive=null
		$scope.showSubList=function(index){
			if($scope.subListActive==index){
				$scope.subListActive=null
			}else{
				$scope.subListActive=index;
			}
		}
		
	})
	
})
