angular.module('App').controller('blackListCtr',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicModal,$timeout,$window,$state,$ionicActionSheet,$ionicTabsDelegate,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicLoading,$ionicSlideBoxDelegate){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.blacklist=NimUtils.blacklist
		$scope.blacklistAcids = []
		for(var i=0;i<$scope.blacklist.length;i++){
			$scope.blacklistAcids.push($scope.blacklist[i].account)
		}
		$scope.getUserInfo($scope.blacklistAcids)
		
	})
	
	$scope.blackList=[]
	$scope.getUserInfo=function(accounts){
		if(accounts.length<=0){
			$scope.blackList=[]
			return
		}
		NimUtils.getUsers({
			accounts: accounts,
			done: getUsersDone
		});
		function getUsersDone(error,friendsinfo){
			if (!error) {
				$timeout(function(){
					$scope.blackList=friendsinfo
				})
			}else{
				$timeout(function(){
					$scope.blackList=[]
				})
			}
		}
	}
	// 移除
	$scope.removeBlack=function(item,index){
		nim.removeFromBlacklist({
			account: item.account,
			done: removeFromBlacklistDone
		});
		function removeFromBlacklistDone(error, obj) {
			if (!error) {
				enterViewLoad.customload('移除成功')
				NimUtils.blacklist = nim.cutRelations(NimUtils.blacklist, obj.record);
				$scope.blackList.splice(index,1)
			}
		}
	}
})
