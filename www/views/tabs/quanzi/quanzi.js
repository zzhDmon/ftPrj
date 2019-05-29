angular.module('App').controller('quanziCtl',
	function(NimUtils,appUtils,enterViewLoad,actionImgShow,$ionicPopup,$ionicSlideBoxDelegate,$localStorage,$interval,$ionicPopover,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.tabActiveName='thirdTab'
	$scope.isLoged=false;
	$scope.refreshTxt='房在心田才是家';
	
	// 欢迎页
	$scope.$on('$ionicView.beforeEnter',function(){
		if(!$localStorage.firstTimeOpen){
			$ionicLoading.hide();
			$state.go('welcomePage');
			return
		}
	})

	$scope.scanQrcode=function(){
		if($scope.isLoged){
			// 扫描二维码
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
			
		}else{
			$state.go('login')
		}
	}

	// 系统消息	
	$rootScope.$on('SYSMSGUPDATE',function(event,data){
		$timeout(function(){
			$scope.sysMsgCount=NimUtils.sysMsg.allSysMsgUnread
		})
	})
	
	$timeout(function(){
		$scope.totalUnread=0;
		for(var i=0;i<NimUtils.sessionList.length;i++){
			$scope.totalUnread=$scope.totalUnread+NimUtils.sessionList[i].unread
		}
	},1000)	
	$scope.$on('$ionicView.enter',function(){
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		// 计算会话未读数
		var _calcUnread = function(sessions){
			for(var i=0;i<sessions.length;i++){
				$scope.totalUnread=$scope.totalUnread+sessions[i].unread
			}		
		}

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
		
		// 系统消息
		$scope.sysMsgCount=NimUtils.sysMsg.allSysMsgUnread;	
		
		// 加载数据
		$scope.initData();

		// 重置是否可以加载更多
		$scope.tlFollowHaveMore=true;
		$scope.timeLineHaveMore=true;
		// 显示回复输入
		$scope.showBotReply=false
	})
	
	



	
	
	
	// 加载前缓冲动画
	enterViewLoad.load()


	
	// 资讯 动态 关注切换
	$scope.firstSortIndex=1;
	$scope.switchFirstSortIndex=function(index){
		$scope.firstSortIndex=index;
		$ionicScrollDelegate.resize();
		if(index==0){
			if($scope.tlFollowArr.length>0){
				$scope.tlFollowRefresh()
			}
		}else if(index==1){
			$scope.timeLineRefresh()
		}else{
			$scope.loadArticle()
			$timeout(function(){
				// 初始化swiper
				$scope.initSwiper()
			})
		}
	}
	// 资讯分类
	$scope.secondSortIndex=1;
	$scope.switchSecondSortIndex=function(index){
		$scope.secondSortIndex=index
		$ionicScrollDelegate.resize();
	}
	
	/*
	加载关注动态分页
	*/ 
	$scope.tlFollowQuery={
		isOnlyFollow:true,
		type:10,
		pagenum:0,
		pagesize:10
	}
	$scope.tlFollowHaveMore=true;
	$scope.tlFollowArr=[];
	function _loadTLFollow(ifloadmore){
		$http.post($Factory.Zone.indexlist.url,$scope.timeLineQuery)
		.success(function(resData){
			$ionicLoading.hide();
			if(resData[0].List<=0){
				$scope.tlFollowHaveMore = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(ifloadmore)return;
			}
			$scope.tlFollowHaveMore = true;
			// 数据处理
			var _resData = resData[0].List.filter(function(item){
				if(appUtils.isJsonString(item.Content)) item.Content=JSON.parse(item.Content)
				if($localStorage.myselfInfo){
					item.agreed = item.AgressUsers.indexOf($localStorage.myselfInfo.Id)>=0 ? true:false;
				}else{
					item.agreed=false
				}
				item.showCom=false
				item.agreeNum=item.AgressUsers.length
				item.showAll=false
				item.showAllBtn=false
				return item
			});
			if(ifloadmore){
				$scope.tlFollowQuery.pagenum += 1;
				$scope.tlFollowArr=$scope.tlFollowArr.concat( _resData);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				$scope.tlFollowQuery.pagenum=1;
				$scope.tlFollowArr = _resData
				$scope.$broadcast('scroll.refreshComplete');
			}
			// 是否需要展开全文
			$timeout(function(){
				$.each($(".follow-cont-wrapper p"), function(i, o){
					if($('.follow-cont-wrapper p').eq(i).height() > 60){
						$scope.tlFollowArr[i].showAllBtn=true
					}else {
					}
				});
			})
		}).error(function(){
			$ionicLoading.hide();
			$scope.tlFollowHaveMore  = false;
			enterViewLoad.customload('获取数据失败');
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	$scope.tlFollowLoadMore = function(ifloadmore){
		_loadTLFollow(true);
	}
	$scope.tlFollowRefresh = function(ifloadmore){
		$scope.tlFollowQuery.pagenum=0
		_loadTLFollow(false);
		$ionicScrollDelegate.resize();
	}
	// 展开 收起 全文
	$scope.switchFollowShowAll=function(item){
		item.showAll=!item.showAll
	}

	
	/*
	加载动态分页
	*/ 
	$scope.timeLineQuery={
		isOnlyFollow:false,
		type:10,
		pagenum:0,
		pagesize:10
	}
	$scope.timeLineHaveMore=true;
	$scope.timeLineArr=[];
	function _loadTimeLine(ifloadmore){
		$http.post($Factory.Zone.indexlist.url,$scope.timeLineQuery)
		.success(function(resData){
			$ionicLoading.hide();
			if(resData[0].List<=0){
				$scope.timeLineHaveMore = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
				if(ifloadmore)return;
			}
			$scope.timeLineHaveMore = true;
			// 数据处理
			var _resData = resData[0].List.filter(function(item){
				if(appUtils.isJsonString(item.Content)) item.Content=JSON.parse(item.Content)
				if($localStorage.myselfInfo){
					item.agreed = item.AgressUsers.indexOf($localStorage.myselfInfo.Id)>=0 ? true:false;
				}else{
					item.agreed=false
				}
				item.showCom=false
				item.agreeNum=item.AgressUsers.length
				item.showAll=false
				item.showAllBtn=false
				return item
			});
			if(ifloadmore){
				$scope.timeLineQuery.pagenum += 1;
				$scope.timeLineArr=$scope.timeLineArr.concat( _resData);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				$scope.timeLineQuery.pagenum=1;
				$scope.timeLineArr = _resData
				$scope.$broadcast('scroll.refreshComplete');
			}
			// 显示展示全文
			$timeout(function(){
				$.each($(".tl-cont-wrapper p"), function(i, o){
					if($('.tl-cont-wrapper p').eq(i).height() > 60){
						$scope.timeLineArr[i].showAllBtn=true
					}else {
					}
				});
			})
		}).error(function(){
			$ionicLoading.hide();
			$scope.timeLineHaveMore  = false;
			enterViewLoad.customload('获取数据失败');
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	$scope.timeLineLoadMore = function(ifloadmore){
		_loadTimeLine(true);
	}
	$scope.timeLineRefresh = function(ifloadmore){
		$scope.timeLineQuery.pagenum=0
		_loadTimeLine(false);
		$ionicScrollDelegate.resize();
	}
	// 展开 收起 全文
	$scope.switchShowAll=function(item){
		item.showAll=!item.showAll
	}




	// 加载资讯
	$scope.loadArticle=function(){
		$http.post($Factory.Zone.indexlist.url,{
			isOnlyFollow:false,
			type:40,
			pagenum:0,
			pagesize:100
		}).then(function(resData){
			if(resData.data.length){
				$scope.articleList=resData.data[0].List.filter(function(item){
					if(appUtils.isJsonString(item.ShowInList)) item.ShowInList=JSON.parse(item.ShowInList)
					return item
				})
			}else{
				$scope.articleList=[]
			}
		}).catch(function(){
			enterViewLoad.customload('获取失败');
		})
	}
	// 点击查看大图
	$scope.showBigImg=function(parImgs,$index){
		var arrImgs = new Array();
		for(var i=0; i<parImgs.length; i++) {
			var img = new Image();
			img.src = parImgs[i];
			img.onload = function(i) {
				arrImgs[i] = img;
			}(i);
		}
		
		actionImgShow.show({
			"larImgs": arrImgs, 
			"currentImg": $index,
			imgClose : function() {
				actionImgShow.close();
			}
		})
	}
	
	// 点赞
	$scope.agreeAction=function(item){
		if(!$localStorage.myselfInfo){
			$state.go('login')
			return
		}
		if(item.agreed) return
		$http.post($Factory.Zone.agree.url+'?id='+item.Id).then(function(resData){
			item.agreed=true
			item.agreeNum++
			if(item.agreeUsers){
				item.agreeUsers.push({
					Image:$localStorage.myselfInfo.ShowImage
				})
			}else{
				item.agreeUsers=[]
				item.agreeUsers.push({
					Image:$localStorage.myselfInfo.ShowImage
				})
			}
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}
	
	// 关注
	$scope.followAction=function(item){
		if(!item.IsFollow){
			$http.post($Factory.Zone.follow.url+'?uid='+item.UserId).then(function(resData){
				item.IsFollow=true
			}).catch(function(err){
				enterViewLoad.customload('操作失败');
			})
		}else{
			$http.post($Factory.Zone.unfollow.url+'?uid='+item.UserId).then(function(resData){
				item.IsFollow=false
			}).catch(function(err){
				enterViewLoad.customload('操作失败');
			})
		}
		$scope.loadVideos();
	}
	/*
    动态 删除popover
	*/
	$ionicPopover.fromTemplateUrl('del_quanzi_tl_popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openDelTLPopover = function($event,item,index,list) {
		$scope.popover.show($event);
		$scope.delTLItem={
			item:item,
			index:index,
			list:list
		}
	};
	$scope.closeDelTLPopover = function() {
		$scope.popover.hide();
	};

	$scope.deleteTL=function(){
		$scope.closeDelTLPopover()
		$http.post($Factory.Zone.delete.url+'?id='+$scope.delTLItem.item.Id)
			.then(function(res){
				enterViewLoad.customload('删除成功')
				$ionicScrollDelegate.resize();
				$scope.delTLItem.list.splice($scope.delTLItem.index,1);
			}).catch(function(){
				enterViewLoad.customload('删除失败')
			})
	}
	// 删除回复
	$scope.deleteCom=function(item,list,index){
		if(!$localStorage.myselfInfo)return
		if(item.UserId==$localStorage.myselfInfo.Id){
			var confirmPopup = $ionicPopup.confirm({
				title: '删除评论？',
				cancelText: '取消',
				okText: '删除'
			});
			confirmPopup.then(function(res) {
				if(res){
					$http.post($Factory.Zone.delete.url+'?id='+item.Id)
						.then(function(res){
							list.splice(index,1);
							$ionicScrollDelegate.resize();
						}).catch(function(){
							enterViewLoad.customload('删除失败')
						})
				}
			})
		}
	}
	
	// 切换显示评论列表
	$scope.switchShowCom=function(item){
		item.showCom=!item.showCom;
		if(item.showCom&&(item.AgressUsers.length>0)){
			$http.post($Factory.Zone.agreeuser.url,item.AgressUsers).then(function(res){
				item.agreeUsers=res.data;
			})
		}
		$ionicScrollDelegate.resize();
	}
	// 回复
    $scope.replyData={
        data:''
    }
    $scope.clickComment=function(item){
        $scope.showBotReply= $scope.showBotReply?false:true;
        $scope.replyTo=item
    }
    $scope.replyComment=function(){
        if(!$scope.replyData.data) return
        $http.post($Factory.Zone.save.url,{
            type:70,
            ParentId:$scope.replyTo.Id,
            Content:$scope.replyData.data
        }).then(function(res){
			$scope.replyTo.Children.push({
				UserId:$localStorage.myselfInfo.Id,
				UserName:$localStorage.myselfInfo.NickName,
				UserImage:$localStorage.myselfInfo.ShowImage,
				Content:$scope.replyData.data
			})
			$scope.replyTo.ChildrenCount +=1
			$scope.replyData.data='';
        }).catch(function(){
            $scope.replyData.data=''
            enterViewLoad.customload('评论失败');
        })
    }
    $scope.keyboardHeight=null
    window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
            if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
                $scope.keyboardHeight=e.keyboardHeight
            }
            $scope.keyboardShow=true  
        })
    }) 
    window.addEventListener('native.keyboardhide',function(e){
        $timeout(function(){
            $scope.keyboardShow=false;
            $scope.showBotReply=false;
        })
	})
	
	// 点击用户头像
	$scope.toLinkMan=function(uid){
		if(!$localStorage.myselfInfo){
			$state.go('login')
			return
		}
		$http.post($Factory.Neteast.user.url+'?id='+uid).then(function(resData){
			if(resData.data.return_code=="SUCCESS"){
				$state.go('linkManDetail',{account:resData.data.return_msg.accid})
			}else{
				$ionicLoading.show({
					template:resData.data.return_msg,
					duration:1500
				})
			}
		}).catch(function(){
			$ionicLoading.show({
				template:'用户未开通微聊',
				duration:1500
			})
		})
	}
	
})