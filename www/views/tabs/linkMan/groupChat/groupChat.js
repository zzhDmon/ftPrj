angular.module('App').controller('groupChatCtr',function(NimUtils,appUtils,$timeout,$state,$rootScope,$scope){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		nim.getTeams({
			done: getTeamsDone
		});
		function getTeamsDone(error, teams) {
			if (!error) {
				$timeout(function(){
					$scope.groupList=teams
				})
			}
		}
	})
	
})
