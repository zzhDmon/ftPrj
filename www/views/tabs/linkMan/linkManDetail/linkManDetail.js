angular.module('App').controller('linkManDetailCtr',function($hisBusinessCardData,actionImgShow,NimUtils,appUtils,enterViewLoad,$ionicLoading,$ionicPopup,$timeout,$localStorage,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.targetId=$stateParams.account
	$scope.myselfInfo=NimUtils.myselfInfo
	// 他的个人主页
	$scope.goHisBusiness=function(id,slide){
		$hisBusinessCardData.slide = slide;
		$state.go('hisBusinessCard',{id:id})
	}
	// 点击查看大图
	$scope.showBigImg=function(imgurl){
		var arrImgs = new Array(),
			parImgs = [imgurl]
		for(var i=0; i<parImgs.length; i++) {
			var img = new Image();
			img.src = parImgs[i];
			img.onload = function(i) {
				arrImgs[i] = img;
			}(i);
		}
		
		actionImgShow.show({
			"larImgs": arrImgs, 
			"currentImg": 0,
			imgClose : function() {
				actionImgShow.close();
			}
		})
	}

	$http.post($Factory.Account.showinfo.url+'?id='+$stateParams.account)
		.then(function(resData){
			$scope.ftInfo=resData.data;	
			//其他个人品牌信息
			$http.post($Factory.Zone.home.url+'?uid='+resData.data.Id,{
				type:0
				}).then(function(resData){
					for(var i=0;i<resData.data.length;i++){
						if(resData.data[i].Type==10){
							$scope.dynamicData=resData.data[i].List.filter(function(item){
								if(appUtils.isJsonString(item.Content)){
									item.Content=JSON.parse(item.Content)
								}
								return item
							})
							$scope.newsList=[]
							$scope.newsList = resData.data[i].List.map(function(item){
								return item.Content.text
							})
							
							new Swiper('.linkman-detail-tl-swiper', {
								direction : 'vertical',
								autoplay:true, //自动滑动
								loop: $scope.newsList.length>1 ? true : false,
							});
						}else if(resData.data[i].Type==20){
							$scope.imagesData=resData.data[i].List
						}else if(resData.data[i].Type==30){
							$scope.videosData=resData.data[i].List.filter(function(item){
								item.Content=JSON.parse(item.Content)
								return item
							})
						}else if(resData.data[i].Type==60){
							if(resData.data[i].List.length>0){
								if(appUtils.isJsonString(resData.data[i].List[0].Content)){
									$scope.honorImageUrl=JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
								}
								$scope.honorImageId=resData.data[i].List[0].Id
							}else{
								$scope.honorImageUrl=''
							}
						}else if(resData.data[i].Type==50){
							if(resData.data[i].List.length>0){
								var time_now = new Date().getTime()
								if(appUtils.isJsonString(resData.data[i].List[0].Content)){
									$scope.posterImageUrl=JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
								}
								$scope.posterImageId=resData.data[i].List[0].Id
							}else{
								$scope.posterImageUrl=''
							}
						}else if(resData.data[i].Type==80){
							if(resData.data[i].List.length>0){
								$scope.photoBgImg=resData.data[i].List[0].Content;
							}else{
								$scope.photoBgImg=''
							}
						}else if(resData.data[i].Type==90){
							if(resData.data[i].List.length>0){
								$scope.videoBgImg=resData.data[i].List[0].Content;
							}else{
								$scope.videoBgImg=''
							}
						}
					}
				}).catch(function(){
					enterViewLoad.customload('加载数据失败');
					$scope.photoBgImg='';
					$scope.videoBgImg=''
					$scope.posterImageUrl=''
					$scope.honorImageUrl=''
				})
			}).catch(function(err){
				
			})

	// 关注
	$scope.followAction=function(item){
		enterViewLoad.load()
		$http.post($Factory.Zone.follow.url+'?uid='+$scope.ftInfo.Id)
		.then(function(resData){
			$ionicLoading.hide()
			$scope.ftInfo.IsFollow=true;
			++$scope.ftInfo.FollowNum
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}
	$scope.unFollowAction=function(){
		enterViewLoad.load()
		$http.post($Factory.Zone.unfollow.url+'?uid='+$scope.ftInfo.Id)
		.then(function(resData){
			$ionicLoading.hide()
			$scope.ftInfo.IsFollow=false;
			--$scope.ftInfo.FollowNum
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}

	// 网易云个人信息
	$scope.getNimInfo=function(account){
		nim.getUser({
			account: account,
			done: getUserDone,
			sync:true
		});
		function getUserDone(error, user){
			if (!error) {
				$timeout(function(){
					$scope.targetInfo=user
					$scope.targetInfo=angular.extend({
						isFriend : NimUtils.isFriend($scope.targetId)
					},$scope.targetInfo)
				})
			}
		}
	}
	if($stateParams.phone){
		$http.post($Factory.Neteast.queryphone.url+'?phone='+$stateParams.phone).then(function(res){
			$scope.targetId=res.data.accid
			$scope.getNimInfo($scope.targetId)
		}).catch(function(err){
			$scope.targetId=null;
			$scope.errMsg=err.data.Message
			enterViewLoad.customload(err.data.Message)
		})
	}
	if($stateParams.account){
		$scope.getNimInfo($scope.targetId)
	}
	

	$scope.addFriend=function(account){
		NimUtils.addFriend(account,function(){
			enterViewLoad.customload('发送好友申请成功')
			$timeout(function(){
				// $scope.targetInfo.isFriend=true;
				// $scope.reloadMyFriends()
				$scope.back();
			},1500)
		},function(){
			enterViewLoad.customload('发送好友申请失败')
		})
	}
	$scope.deleteFriend=function(account){
		var deleteConfirmPopup= $ionicPopup.confirm({
			title: '确定删除好友？',
			cancelText: '取消',
			okText: '确定'
		});
		
		deleteConfirmPopup.then(function(res) {
			if(res){
				NimUtils.deleteFriend(account,function(){
					$timeout(function(){
						$scope.targetInfo.isFriend=false;
						$scope.reloadMyFriends()
					})
				},function(){

				})
			}else{}
		})
	}

	$scope.reloadMyFriends=function(){
		nim.getFriends({
			done: getFriendsDone
		});
		function getFriendsDone(error, friends){
			if (!error) {
				NimUtils.myFriends=friends;
			}else{err()}
		}
	}
	
})