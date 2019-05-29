angular.module('App').controller('forwardMsgCtr',function($forwardMsgData,NimUtils,appUtils,enterViewLoad,$timeout,$state,$rootScope,$scope,$ionicPopup){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.chooseMsgItem = $forwardMsgData.data;
		// 群
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
		NimUtils.myFriendsInfo(function(friendArr){
			$scope.friendArr=friendArr.filter(function(item){
				if(appUtils.isJsonString(item.custom)){
					item.custom = JSON.parse(item.custom)
				}
				return item
			});
			$timeout(function(){
				$scope.friendArr = $scope.friendArr;
			})
		})
	})
	$scope.$on('$ionicView.enter',function(){
		$forwardMsgData.data = null;
	})
	
	// 点击转发
	$scope.chooseTarget=function(scene,to,targetname){
		var confirmPopup = $ionicPopup.confirm({
			title: '确定转发给'+targetname+'？',
			cancelText: '取消',
			okText: '确认'
		});
		confirmPopup.then(function(res){
			if(res) {
				nim.forwardMsg({
					msg: $scope.chooseMsgItem,
					scene: scene,
					to: to,
					done: sendMsgDone
				})
				function sendMsgDone(e){
					if(!e){
						enterViewLoad.customload('转发成功');
						$timeout(function(){
							$scope.back()
						},1500)
					}else{
						enterViewLoad.customload('转发失败')
					}
				}
			}else{

			}
		})
	}
	$scope.forwardMsg=function(){
		
	}
})
.factory('$forwardMsgData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
		data:null,
	};

	return new Util();
}]);
