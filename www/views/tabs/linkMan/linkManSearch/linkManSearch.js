angular.module('App').controller('linkManSearchCtl',function(enterViewLoad,NimUtils,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		// 好友
		NimUtils.myFriendsInfo(function(friendArr){
			$scope.friendArr=friendArr.filter(function(item){
				if(appUtils.isJsonString(item.custom)){
					item.custom = JSON.parse(item.custom)
				}
				return item
			});
		},function(err){
			$scope.friendArr=[]
		})
		// 群组
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

	$scope.searchData={
		data:''
	}
	$scope.searchEmpty=function(){
		$scope.searchData.data=''
	}
	$scope.inputChange=function(){
		$scope.moreFriend=false;
		$scope.moreGroup=false;
	}
// 更多
	$scope.moreFriend=false;
	$scope.showMoreFriend=function(){
		$scope.moreFriend=true;
	}
	$scope.moreGroup=false;
	$scope.showMoreGroup=function(){
		$scope.moreGroup=true;
	}
})