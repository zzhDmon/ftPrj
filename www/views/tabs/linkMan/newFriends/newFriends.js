angular.module('App').controller('newFriendsCtr',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicModal,$timeout,$window,$state,$ionicActionSheet,$ionicTabsDelegate,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicLoading,$ionicSlideBoxDelegate){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.beforeLeave',function(){
		// 清除好友申请数
		NimUtils.sysMsg.allSysMsgUnread=0;
	})
	
	var usersInfo={}
	$scope.getUserInfo=function(users){
		var userArr=[]
		if(!(users.length>0)){
			return //没有系统消息 返回
		}
		for(var i=0;i<users.length;i++){
			userArr.push(users[i].from)
		}
		NimUtils.getUsers({
			accounts: userArr,
			done: getUsersDone
		});
		function getUsersDone(error, resusers) {
			if (!error){
				// 转成对象
				resusers.map(function(e,i){
					usersInfo[e.account]=e;
				});

				$scope.sysMsgs=users.filter(function(item){
					item.name = ''
					item.avatar = ''
					item.reason= ''
					var iteminfo = null
					iteminfo = usersInfo[item.from]
					item.avatar = iteminfo.avatar || ''
					item.name = iteminfo.alias || iteminfo.nick || item.from
					item.reason = (iteminfo.alias || iteminfo.nick || item.from)+'添加您为好友'	
					return item
				});
				$timeout(function(){
					$scope.sysMsgs=$scope.sysMsgs
				})
			}
		}
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.getUserInfo(NimUtils.sysMsg.allSysMsg)
		
		$rootScope.$on('SYSMSGUPDATE',function(event,data){
			$scope.getUserInfo(data)
		})
	})
	// 同意进群
	$scope.acceptTeam=function(item){
		nim.acceptTeamInvite({
			idServer: item.idServer,
			teamId: item.to,//to
			from: item.from,
			done: acceptTeamInviteDone
		});
		function acceptTeamInviteDone(error, obj){
			if(!error){
				item.state = 'passed'
			}else{
				enterViewLoad.customload(error.message)
			}
		}
	}
	// 拒绝进群
	$scope.rejectTeam=function(item){
		nim.rejectTeamInvite({
			idServer: item.idServer,
			teamId: item.to,//to
			from: item.from,
			ps: '拒绝',
			done: rejectTeamInviteDone
		});
		function rejectTeamInviteDone(error, obj) {
			if(!error){
				item.state = 'rejected'
			}else{
				enterViewLoad.customload(error.message)
			}
		}
	}
	// 同意添加好友
	$scope.acceptFriend=function(item){
		nim.passFriendApply({
			idServer: item.idServer,
			account: item.from,
			ps: '同意添加你为好友',
			done: passFriendApplyDone
		});
		function passFriendApplyDone(error, obj) {
			if(!error){
				item.state = 'passed'
			}else{
				enterViewLoad.customload(error.message)
			}
		}
	}
	// 拒绝添加好友
	$scope.rejectFriend=function(item){
		nim.rejectFriendApply({
			idServer: item.idServer,
			account: item.from,
			ps: '拒绝添加你为好友',
			done: rejectFriendApplyDone
		});
		function rejectFriendApplyDone(error, obj) {
			if(!error){
				item.state = 'rejected'
			}else{
				enterViewLoad.customload(error.message)
			}
		}
	}
	
})
