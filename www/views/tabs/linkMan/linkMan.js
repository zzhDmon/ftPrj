angular.module('App').controller('linkManCtr',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicPopover,$ionicModal,$timeout,$window,$state,$ionicActionSheet,$ionicTabsDelegate,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicSlideBoxDelegate){
	$scope.tabActiveName='secondTab'
	
	// 右上角加号
	$ionicPopover.fromTemplateUrl('link_man_popover.html', {
		scope: $scope
		}).then(function(popover) {
			$scope.popover = popover;
		});          
	$scope.openPopover = function($event) {
		$scope.popover.show($event);
	};
	$scope.closePopover = function() {
		$scope.popover.hide();
	};
	$scope.createGroupchat=function(){
		$state.go('tabs.createGroup')
	}

	//创建Modal 
	$scope.createModal=function(){
		//弹窗导航
		$ionicModal.fromTemplateUrl('beAgent_nav_modal', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.showModal=function(){
			$scope.modal.show();	
		}
		$scope.closeModal=function(){
			$scope.modal.hide();
		}	
		// 添加联系人
		$ionicModal.fromTemplateUrl('add_friend_modal', {
			scope: $scope,
			animation: 'slide-in-left'
		}).then(function(modal) {
			$scope.searchModal = modal;
		});
		$scope.showSearchModal=function(){
			$scope.searchModal.show();	
		}
		$scope.closeSearchModal=function(){
			$scope.searchModal.hide();
		}
	}
	$scope.$on('modal.shown', function() {
		appUtils.fbModalShow()
	});
	$scope.$on('modal.hidden', function() {
	 	appUtils.fbModalHidden()
 	});


	// 搜索添加好友
	$scope.search_world={
		key:''
	}
	$scope.clear_search=function(){
		$scope.search_world.key='';
		$scope.searchContactRes=null
	}
	$scope.searchContact=function(){
		$http.post($Factory.Neteast.queryphone.url+'?phone='+$scope.search_world.key)
		.then(function(res){
			$scope.searchContactRes=res.data
		}).catch(function(err){
			enterViewLoad.customload('搜索失败')
		})
	}

	
	document.addEventListener('deviceready',function(){
		// 扫描二维码
		$scope.scanCode=function(){
			appUtils.scanCode(function(result){
				if(result.cancelled){
					// 取消
					return
				}else{
					if(result.text.indexOf('fangtian_')>=0){
						// 网易云账号
						var NimId=result.text.substr(result.text.indexOf('_')+1)
						
						$state.go('linkManDetail',{account:NimId})
					}else{
						$state.go('scanResult',{result:result.text})
					}
				}
			},function(){
				enterViewLoad.customload('扫描失败');
			})
		}
	},false)

	$scope.$on('$ionicView.leave',function(){
		$scope.modal.remove()
		$scope.searchModal.remove()
	})
	// 系统消息	
	$rootScope.$on('SYSMSGUPDATE',function(event,data){
		$timeout(function(){
			$scope.sysMsgCount=NimUtils.sysMsg.allSysMsgUnread
		})
	})
	$scope.friendArr=[]
	$scope.$on('$ionicView.beforeEnter',function(){
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
			})
		})
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		// 创建Modal
		$scope.createModal()
		// 获取好友
		NimUtils.myFriendsInfo(function(friendArr){
			$scope.friendArr=friendArr.filter(function(item){
				if(appUtils.isJsonString(item.custom)){
					item.custom = JSON.parse(item.custom)
				}
				return item
			});
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
		},function(){

		})
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
	
	
	//返回顶部
	$scope.backTop=function(){
		$ionicScrollDelegate.$getByHandle('clientScroll').scrollTop(true)
	}  
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
		if(document.getElementById("cliindex-"+$scope.hint)){
			var scroll = document.getElementById("cliindex-"+$scope.hint).offsetTop - $ionicScrollDelegate.$getByHandle("clientScroll").getScrollPosition().top; 	  	
		}else{
			return
		}
		$ionicScrollDelegate.scrollBy(0,scroll,true);
		var ele = document.getElementsByTagName("ion-content");  
		ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的
	};
})
