
angular.module('App').controller('personalHomePageCtl',function(appUtils,$rootScope,$ionicHistory,$ionicPopover,$ionicActionSheet,$http,$Factory,$scope,$state,$stateParams,$timeout,WechatService,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.userId=$stateParams.id
	$scope.$on('$ionicView.enter',function(){
		var initialState={
			showMySex:true,
			showMyJob:true,
			showMyChoosePrefer:true,
			showMyHouse:true,
			showMyNeed:true,
			showMyEvaluation:true,
			showMyRecruitment:true,
			showMyShop:true,
			showMyTask:true,
		}
		$http.post($Factory.Account.showinfo.url+'?id='+$stateParams.id)
			.then(function(resData){
				resData.data.ShowConfig=JSON.parse(resData.data.ShowConfig)||initialState
				$scope.hisInfo=resData.data;	
			}).catch(function(err){
				
			})
	});
})
