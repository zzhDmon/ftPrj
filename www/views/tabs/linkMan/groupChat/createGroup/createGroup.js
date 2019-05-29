angular.module('App').controller('createGroupCtr',function(NimUtils,enterViewLoad,appUtils,$ionicPopover,$ionicModal,$timeout,$window,$state,$ionicActionSheet,$ionicTabsDelegate,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicSlideBoxDelegate){
	//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
	$scope.back=function(){
		appUtils.back();
	}

	$scope.groupSubArr=[]
	$scope.confirmGroup=function(){
		$.each($("#create_group .letterli").find("input:checked"), function () {
			$scope.groupSubArr.push($(this).val())
		});
		if($scope.groupSubArr.length<1){
			enterViewLoad.customload('请选择至少一位群成员');
			return
		}
		$scope.showModal()
	}

	$scope.subData={
		groupName:'',
		groupDesc:''
	}
	$scope.createGroup=function(){
		if(!$scope.subData.groupName){
			enterViewLoad.customload('请输入群名称');
			return
		}
		$scope.closeModal()

		// 创建普通群
		// nim.createTeam({
		// 	type: 'normal',
		// 	name: $scope.subData.groupName,
		// 	avatar: '',
		// 	accounts: $scope.groupSubArr,
		// 	ps: $scope.subData.groupDesc || '群描述',
		// 	done: createTeamDone
		// });

		// 创建高级群
		nim.createTeam({
			type: 'advanced',
			name: $scope.subData.groupName,
			avatar: '',
			accounts: $scope.groupSubArr,
			ps: $scope.subData.groupDesc || '群描述',
			intro: '',
			announcement: '',
			custom: '',
			joinMode: 'noVerify',  //群加入方式'noVerify' (不需要验证) 'needVerify' (需要验证) 'rejectAll' (禁止任何人加入)
			inviteMode: 'all',  //谁可以邀请all manager
			beInviteMode: 'noVerify', //被邀请人 'noVerify' (不需要邀请方同意) 'needVerify' (需要邀请方同意)
			// updateTeamMode: 'manager', //群信息修改权限 manage all
			// updateCustomMode: 'manager', //群自定义字段修改权限 manage all
			done: createTeamDone
		});
		function createTeamDone(error, obj){
			if (!error) {
				enterViewLoad.customload('创建群成功');
				$timeout(function(){
					$scope.back()
				})
			}else{
				enterViewLoad.customload('添加群成员失败');
			}
		}
		
	}

	// 添加联系人
	$ionicModal.fromTemplateUrl('create_group_modal', {
	    scope: $scope,
	    animation: 'slide-in-left'
	}).then(function(modal) {
	    $scope.groupNmaeModal = modal;
	});
	$scope.showModal=function(){
		$scope.groupNmaeModal.show();	
	}
	$scope.closeModal=function(){
		$scope.groupNmaeModal.hide();
	}

	$scope.friendArr=[]
	$scope.$on('$ionicView.enter',function(){
		nim.getFriends({
			done: getFriendsDone
		});
		function getFriendsDone(error, friends) {
			if (!error) {
				var _myFriendsAccount=[]
				for(var i=0;i<friends.length;i++){
					_myFriendsAccount.push(friends[i].account)
				}
				_getFriendsInfo(_myFriendsAccount)
			}
		}
		var _getFriendsInfo=function(accounts){
			if(accounts.length<=0){
				return
			}
			NimUtils.getUsers({
				accounts: accounts,
				done: getUsersDone
			});
			function getUsersDone(error, friendArr){
				if (!error) {
					$scope.friendArr=friendArr;
					$scope.friendsNum=friendArr.length;//好友数量
					$scope.formatContacts=[{key:'A',value:[]},{key:'B',value:[]},
											{key:'C',value:[]},{key:'D',value:[]},
											{key:'E',value:[]},{key:'F',value:[]},
											{key:'G',value:[]},{key:'H',value:[]},
											{key:'I',value:[]},{key:'J',value:[]},
											{key:'K',value:[]},{key:'L',value:[]},
											{key:'M',value:[]},{key:'N',value:[]},
											{key:'O',value:[]},{key:'P',value:[]},
											{key:'Q',value:[]},{key:'R',value:[]},
											{key:'S',value:[]},{key:'T',value:[]},
											{key:'U',value:[]},{key:'V',value:[]},
											{key:'W',value:[]},{key:'X',value:[]},
											{key:'Y',value:[]},{key:'Z',value:[]},
											{key:'#',value:[]}];
					$scope.changeToPinyinArr()
				}
			}
		}
	})
	$scope.formatContacts=[{key:'A',value:[]},{key:'B',value:[]},
						{key:'C',value:[]},{key:'D',value:[]},
						{key:'E',value:[]},{key:'F',value:[]},
						{key:'G',value:[]},{key:'H',value:[]},
						{key:'I',value:[]},{key:'J',value:[]},
						{key:'K',value:[]},{key:'L',value:[]},
						{key:'M',value:[]},{key:'N',value:[]},
						{key:'O',value:[]},{key:'P',value:[]},
						{key:'Q',value:[]},{key:'R',value:[]},
						{key:'S',value:[]},{key:'T',value:[]},
						{key:'U',value:[]},{key:'V',value:[]},
						{key:'W',value:[]},{key:'X',value:[]},
						{key:'Y',value:[]},{key:'Z',value:[]},
						{key:'#',value:[]}];	
	/*评音转字母*/
	$scope.changeToPinyinArr=function(){
		for(var i=0;i<$scope.friendArr.length;i++){
			var firstLetter=pinyinUtil.getFirstLetter($scope.friendArr[i].nick).substr(0,1).toUpperCase()
		
			for(var j=0;j<$scope.formatContacts.length;j++){
				if(firstLetter==$scope.formatContacts[j].key){ 
					$scope.formatContacts[j].value.push($scope.friendArr[i]);  
					break;  
				}
				if(j == $scope.formatContacts.length-1) {
					$scope.formatContacts[26].value.push($scope.friendArr[i]); 
				} 
			}
		}
		$timeout(function(){
			$scope.formatContacts=$scope.formatContacts;
		})					
	}
	$scope.changeToPinyinArr()
	
	
	  
	// //右侧导航点击跳转
	$scope.letterarr=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"]
    $scope.mTouch=function(event,letter){ 
		enterViewLoad.customload(letter,500)
		
	  	var positionX=event.pageX || event.touches[0].pageX;
		var positioinY=event.pageY || event.touches[0].pageY;
		var ele = document.elementFromPoint(positionX,positioinY);  
		if(!ele){
			return;
		}
		var c=ele.innerText;
		if(!c || c==" " || c.length!=1){
			return;
		}
		$scope.hint=c; 
		if(document.getElementById("create_group_index-"+$scope.hint)){
			var scroll = document.getElementById("create_group_index-"+$scope.hint).offsetTop - $ionicScrollDelegate.$getByHandle("clientScroll").getScrollPosition().top; 	  	
		}else{
			return
		}
		$ionicScrollDelegate.scrollBy(0,scroll,true);
		var ele = document.getElementsByTagName("ion-content");  
		ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动
	};
	  
	
})
