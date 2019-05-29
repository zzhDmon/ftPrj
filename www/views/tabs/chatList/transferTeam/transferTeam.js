angular.module('App').controller('transferTeamCtr',function(NimUtils,enterViewLoad,appUtils,$timeout,$stateParams,$rootScope,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.targetId=$stateParams.id
	$scope.myselfInfo=NimUtils.myselfInfo
	$scope.subData={
		account:''
	}
	$scope.transferDone=function(){
		if(!$scope.subData.account){
			enterViewLoad.customload('请选择新群主');
			return
		}
	
		nim.transferTeam({
			teamId: $scope.targetId,
			account: $scope.subData.account,
			leave: false,
			done: transferOwnerDone
		});
		function transferOwnerDone(error, obj) {
			if(!error){
				enterViewLoad.customload('操作成功');
				$timeout(function(){
					$scope.back()
				},1500)
			}else{
				enterViewLoad.customload(error.message);
			}
		}
	}
// 

// 
	$scope.friendArr=[]
	$scope.$on('$ionicView.enter',function(){
		$scope.friendArr=[]
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
		// 群成员信息
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
					$scope.friendArr=members
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
				})
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
		if(document.getElementById("transfer_team_index-"+$scope.hint)){
			var scroll = document.getElementById("transfer_team_index-"+$scope.hint).offsetTop - $ionicScrollDelegate.$getByHandle("transferTeamScroll").getScrollPosition().top; 	  	
		}else{
			return
		}
		$ionicScrollDelegate.scrollBy(0,scroll,true);
		var ele = document.getElementsByTagName("ion-content");  
		ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的
	};
	  
	
})
