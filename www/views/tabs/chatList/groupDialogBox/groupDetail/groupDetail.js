angular.module('App').controller('groupDetailCtr',function(NimUtils,appUtils,enterViewLoad,$ionicModal,$ionicPopup,$timeout,$localStorage,$rootScope,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.targetId=$stateParams.id;
	

	$scope.getTeamInfo=function(){
		nim.getTeam({
			teamId: $scope.targetId,
			done: getTeamDone
		});
		function getTeamDone(error, obj){
			if(!error){
				$scope.targetInfo=obj
			}
		}
	}
	

	$scope.$on('$ionicView.enter',function(){
		// 显示踢人
		$scope.showRemove=false;
		// 是否静音
		nim.notifyForNewTeamMsg({
			teamIds: [$scope.targetId],
			done: notifyForNewTeamMsgDone
		})
		function notifyForNewTeamMsgDone(error,res){
			if(!error){
				$scope.isMute=res[$scope.targetId] == '1'?true:false;
			}
		}
		// 我的网易云信 和群信息
		$scope.myselfInfo=NimUtils.myselfInfo;
		$scope.getTeamInfo()

		nim.getTeamMembers({
			teamId: $scope.targetId,
			done: getTeamMembersDone
		});
		function getTeamMembersDone(error, obj) {
			if (!error) {
				var _myFriendsAccount=[]
				for(var i=0;i<obj.members.length;i++){
					_myFriendsAccount.push(obj.members[i].account)
				}
				_getFriendsInfo(_myFriendsAccount)
			}
		}
	})

	// 群成员信息
	$scope.groupMembers=[]
	var _getFriendsInfo=function(accounts){
		if(accounts.length<=0){
			return
		}
		
		NimUtils.getUsers({
			accounts: accounts,
			done: getUsersDone
		});
		function getUsersDone(error,members){
			$timeout(function(){
				$scope.groupMembers=members;
				// 群主排位房第一
				if($scope.targetInfo){
					for (var i = 0; i < $scope.groupMembers.length; i++) {
						if ($scope.groupMembers[i].account === $scope.targetInfo.owner) {
							var tem = $scope.groupMembers[i]
							$scope.groupMembers.splice(i, 1);
							$scope.groupMembers.unshift(tem)
							break;
						}
					}
				}
			})
		}
	}
	

	// 解散
	$scope.dismissTeam=function(){
		var dismissConfirmPopup= $ionicPopup.confirm({
			title: '确定解散群聊？',
			cancelText: '取消',
			okText: '确定'
		});
		dismissConfirmPopup.then(function(res) {
			if(res){
				nim.dismissTeam({
					teamId: $scope.targetId,
					done: dismissTeamDone
				});
				function dismissTeamDone(error, obj){
					if(!error){
						enterViewLoad.customload('操作成功')
						$timeout(function(){
							$state.go('tabs.chatList')
						})
					}else{
						enterViewLoad.customload('操作失败')
					}
				}
			}else{}
		})
	}
	// 退出
	$scope.exitGroup=function(){
		var bindConfirmPopup= $ionicPopup.confirm({
			title: '确定退出该群？',
			cancelText: '取消',
			okText: '确定'
		});
		bindConfirmPopup.then(function(res) {
			if(res){
				nim.leaveTeam({
					teamId: $scope.targetId,
					done: leaveTeamDone
				});
				function leaveTeamDone(error, obj) {
					if(!error){
						enterViewLoad.customload('操作成功')
						$timeout(function(){
							$state.go('tabs.chatList')
						},1500)	
						// 删除该会话
						for(var i=0;i<NimUtils.sessionList.length;i++){
							var teamid = 'team-'+$scope.targetId
							if(teamid == NimUtils.sessionList[i].id){
								NimUtils.sessionList.splice(i,1)
							}
						}
						NimUtils.sessionList = NimUtils.sessionList
					}else{
						enterViewLoad.customload(error.message)
					}
				}
			}else{}
		})
	}

	
	// 踢人
	$scope.changeShowRemove=function(){
		$scope.showRemove=!$scope.showRemove
	}
	$scope.removeTeamMembers=function(account,index){
		nim.removeTeamMembers({
			teamId: $scope.targetId,
			accounts: [account],
			done: removeTeamMembersDone
		});
		function removeTeamMembersDone(error, obj){
			if(!error){
				$scope.groupMembers.splice(index,1)
				$timeout(function(){
					$scope.groupMembers=$scope.groupMembers
				})
			}else{
				enterViewLoad.customload('操作失败')
			}
		}
	}

	//群昵称 描述修改
	$scope.changeModalView=1;
	$ionicModal.fromTemplateUrl('group_detail_name_desc_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.shareModal = modal;
	});
	$scope.showChangeInfoModal=function(index){
		if($scope.myselfInfo.account!=$scope.targetInfo.owner){
			return //不是群主无法修改
		}
		$scope.shareModal.show();
		$scope.changeModalView=index;	
	}
	$scope.closeChangeInfoModal=function(){
		$scope.shareModal.hide();
	}
	// 修改群信息
	$scope.changeData={
		Name:'',
		Intro:''
	}
	$scope.changeName=function(){
		nim.updateTeam({
			teamId: $scope.targetId,
			name: $scope.changeData.Name,
			done: updateTeamDone
		});
		function updateTeamDone(error,team) {
			if(!error){
				$scope.closeChangeInfoModal()
				$scope.getTeamInfo()
				enterViewLoad.customload('修改成功')
			}else{
				enterViewLoad.customload('修改失败')
			}
		}
	}
	$scope.changeIntro=function(){
		nim.updateTeam({
			teamId: $scope.targetId,
			intro: $scope.changeData.Intro,
			done: updateTeamDone
		});
		function updateTeamDone(error,team) {
			if(!error){
				$scope.closeChangeInfoModal()
				$scope.getTeamInfo()
				enterViewLoad.customload('修改成功')
			}else{
				enterViewLoad.customload('修改失败')
			}
		}
	}
// 是否需要邀请人同意
	$scope.changeInviteMode=function(){
		// console.log($scope.targetInfo.beInviteMode)
		// return
		nim.updateTeam({
			teamId: $scope.targetId,
			beInviteMode: $scope.targetInfo.beInviteMode,
			done: updateTeamDone
		});
		function updateTeamDone(error,team) {
			if(!error){
				$scope.getTeamInfo()
				enterViewLoad.customload('修改成功')
			}else{
				enterViewLoad.customload('修改失败')
			}
		}
	}


	var timeout;
	$scope.blockChange=function(){
		// 切换屏蔽 节流
		if(timeout) {
			$timeout.cancel(timeout);
		}
		timeout = $timeout(function(){
			nim.updateInfoInTeam({
				teamId: $scope.targetId,
				// 此参数为可选参数
				muteTeam: !$scope.isMute,
				done: updateInfoInTeamDone
			});
			function updateInfoInTeamDone(error, obj) {
				if(!error){
					$scope.isMute=!$scope.isMute
				}else{
					enterViewLoad.customload('修改失败')
				}
			}
		},500)
	}
/****/
	
})