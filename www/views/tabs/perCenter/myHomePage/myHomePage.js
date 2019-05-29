
angular.module('App').controller('myHomePageCtl',function(appUtils,$ionicHistory,$http,$Factory,$scope,$state,$stateParams,$timeout,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	
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
		$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				resData.data.ShowConfig=JSON.parse(resData.data.ShowConfig)||initialState
				$scope.myInfo=resData.data;	
			}).catch(function(err){
				
			})
	});

	



})
