angular.module('App').controller('mallMessageCtl',function(NimUtils,appUtils,$interval,$localStorage,$ionicLoading,$ionicModal,$ionicListDelegate,$ionicHistory,$scope,$rootScope,$state,$ionicPopover,$timeout){
	$scope.activeTabName='mall-message'


	// 跳转
	$scope.goDialogBox=function(con){
		if(con.scene=='team'){
			$state.go('groupDialogBox',{id:con.to})
		}else if(con.scene=='p2p'){
			$state.go('dialogBox',{id:con.to})
		}
	}

	$scope.$on('$ionicView.leave',function(){
		$ionicListDelegate.closeOptionButtons();
	})
	
	// 系统消息	
	$rootScope.$on('SYSMSGUPDATE',function(event,data){
		$timeout(function(){
			$scope.sysMsgCount=NimUtils.sysMsg.allSysMsgUnread
		})
	})
	$scope.$on('$ionicView.enter',function(){
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		// 计算会话未读数
		var _calcUnread = function(sessions){
			for(var i=0;i<sessions.length;i++){
				$scope.totalUnread=$scope.totalUnread+sessions[i].unread
			}
		}
		
		// 系统消息
		$scope.sysMsgCount=NimUtils.sysMsg.allSysMsgUnread

		// 会话未读数
		$scope.totalUnread=0;
		_calcUnread(NimUtils.sessionList)
		// 会话列表 未读数 更新
		$rootScope.$on('updateSessions',function(event,data){
			$timeout(function(){
				$scope.totalUnread=0;
				_calcUnread(data)
				
				$scope.conList=data.filter(function(item){
					item.name = ''
					item.avatar = ''
					if(item.scene=='p2p'){
						var userinfo = null
						userinfo = NimUtils.sessionUsersInfo[item.to]
						item.avatar = userinfo.avatar || ''
						item.name = userinfo.nick || ''
						item.custom = userinfo.custom || ''
					}else if(item.scene=='team'){
						var teamInfo = NimUtils.myTeams.find(function(team){
							return team.teamId === item.to
						})
						if(teamInfo){
							item.name = teamInfo.name || ''
							item.avatar = teamInfo.avatar || ''
						}else{
							item.name = '群'+item.to
							item.avatar = item.avatar || ''
						}
					}
					if(item.lastMsg.type=='custom'){
						if(typeof(item.lastMsg.content)=='string'){
							item.lastMsg.content=JSON.parse(item.lastMsg.content)
						}
					}
					return item
				});
			})
		})
			

		// 会话列表
		$scope.conList = NimUtils.sessionList.filter(function(item){
			item.name = ''
			item.avatar = ''
			if(item.scene=='p2p'){
				var userinfo = null
				userinfo = NimUtils.sessionUsersInfo[item.to]
				item.avatar = userinfo.avatar || ''
				item.name = userinfo.alias || userinfo.nick || ''
				item.custom = userinfo.custom || ''
			}else if(item.scene=='team'){
				var teamInfo = NimUtils.myTeams.find(function(team){
					return team.teamId === item.to
				})
				if(teamInfo){
					item.name = teamInfo.name || ''
					item.avatar = teamInfo.avatar || ''
				}else{
					item.name = '群'+item.to
					item.avatar = item.avatar || ''
				}
			}
			if(item.lastMsg.type=='custom'){
				if(typeof(item.lastMsg.content)=='string'){
					item.lastMsg.content=JSON.parse(item.lastMsg.content)
				}
			}
			return item
		});
	})

	// 添加会话用户信息
	$scope.extendPtPInfo=function(){

	}


	$scope.deleteSession=function(con,index,unread){
		$ionicListDelegate.closeOptionButtons();
		nim.deleteSession({
			scene: con.scene,
			to: con.to,
			done: deleteSessionDone
		});
		function deleteSessionDone(error, obj){
			if(!error){
				$scope.conList.splice(index,1)
				NimUtils.sessionList.splice(index,1)
				
				$timeout(function(){
					$scope.totalUnread=$scope.totalUnread - unread;
					NimUtils.sessionUnread=$scope.totalUnread
					$scope.conList=$scope.conList
				})
			}else{
				enterViewLoad.customload('删除失败')
			}
		}
	}	
})