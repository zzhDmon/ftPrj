angular.module('App').controller('mobileContactCtr',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicLoading,$ionicModal,$timeout,$state,$ionicScrollDelegate,$ionicHistory,$Factory,$scope,$http){
	$scope.back=function(){
		appUtils.back();
	}
	enterViewLoad.loadcontacts()
// 搜索
	$scope.searchInfo={
		name:''
	}
	$scope.searchEmpty=function() {
		$scope.searchInfo.name=''
	}
	$scope.inputChange=function(){
		$ionicScrollDelegate.resize()
	}
	
	
	$scope.friendArr=[]
	// 云信 添加好友
	$scope.beFriend=function(item){
		if(item.PhoneNumber==$localStorage.myselfInfo.UserName){ 
			enterViewLoad.customload('你的手机');
	        return false; 
	    }else if(!item.Accid){
			enterViewLoad.customload('需要该用户重新登录房田才可以添加',2000);
	        return false; 
		}
		NimUtils.addFriend(item.Accid,function(){
			enterViewLoad.customload('添加好友成功')
			$timeout(function(){
				item.IsFriend=true;
			})
		},function(){
			enterViewLoad.customload('添加好友失败')
		})
	}
	//邀请好友
	$scope.inviteFriend=function(phone){
		if(!(/^1[34578]\d{9}$/.test(phone))){ 
			enterViewLoad.customload('该号码不是手机号');
	        return false; 
	    }
		$http.post($Factory.Account.sendinvit.url+'?toPhone='+phone,{
			toPhone:phone
		}).then(function(resData){
			enterViewLoad.customload('发送邀请成功')
		}).catch(function(err){
			enterViewLoad.customload('发送邀请失败')
		})
	}
	
	$scope.$on('$ionicView.enter',function(){
		// 获取列表
		$scope.getNimFriends()
	})
	
	$scope.getNimFriends =function(){
		nim.getFriends({
			done: getFriendsDone
		});
		function getFriendsDone(error, friends){
			if (!error) {
				$scope.friendsAccount=[]
				for(var i=0;i<friends.length;i++){
					$scope.friendsAccount.push(friends[i].account)
				}
				
				$scope.matchContacts()
			}else{
				$scope.matchContacts()
			}
		} 
	}

	// 匹配通讯录
	$scope.matchContacts=function(){
		document.addEventListener("deviceready", function () {
			appUtils.contactManager().then(function(allContacts){		   	
				var contacts = []; 
				angular.forEach(allContacts, function (contact, index) { 
					if (contact.phoneNumbers != null && 
					contact.phoneNumbers[0].type == 'mobile' && 
					contact.name != null){ 
						if (contact.name.givenName && contact.name.familyName) { 
							contacts.push({ 
							"Name": contact.name.familyName+contact.name.givenName, 
							"PhoneNumber": contact.phoneNumbers[0].value 
							}); 
						} else { 
							contacts.push({ 
							"Name": contact.name.givenName ? contact.name.givenName : '', 
							"PhoneNumber": contact.phoneNumbers[0].value 
							}); 
						} 
					} 
				});
		
				$http.post($Factory.Neteast.usermatch.url,contacts)
				.then(function(resData){
					$ionicLoading.hide()
					
					// 判断是否好友
					resData.data.filter(function(item){
						item.IsFriend=false
						if($scope.friendsAccount.indexOf(item.Accid)>=0){
							item.IsFriend=true
						}
						return item
					})
					
					$scope.friendArr=resData.data;
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
	
				}).catch(function(err){
					$ionicLoading.hide()
					enterViewLoad.customload('获取手机联系人失败')
				})
			}, function(_error){
				$ionicLoading.hide()
				enterViewLoad.customload('获取手机联系人失败')
			});			
		}, false); 	
	}


	

	//返回顶部
	$scope.backTop=function(){
		$ionicScrollDelegate.scrollTop(true)
	}
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
			var firstLetter=pinyinUtil.getFirstLetter($scope.friendArr[i].Name).substr(0,1).toUpperCase()
		
			for(var j=0;j<$scope.formatContacts.length;j++){
				if(firstLetter==$scope.formatContacts[j].key) {  
					$scope.formatContacts[j].value.push($scope.friendArr[i]);  
					break;  
				}
				if(j == $scope.formatContacts.length-1) { 
					$scope.formatContacts[26].value.push($scope.friendArr[i]); 
				} 
			}
		}					
	}
	$scope.changeToPinyinArr()
	
	
	  
	//右侧导航点击跳转
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
		if(document.getElementById("mobilecontindex-"+$scope.hint)){
			var scroll = document.getElementById("mobilecontindex-"+$scope.hint).offsetTop - $ionicScrollDelegate.$getByHandle("mobileContScroll").getScrollPosition().top; 	  	
		}else{
			return
		}
		$ionicScrollDelegate.scrollBy(0,scroll,true);
		var ele = document.getElementsByTagName("ion-content");  
		ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的
	};
})
