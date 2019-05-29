
angular.module('App').controller('sellHouseDetailCtl',function(appUtils,enterViewLoad,$ionicScrollDelegate,$location,$localStorage,actionImgShow,$ionicModal,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicSlideBoxDelegate,$ionicPopover,wechatLinkBase,WechatService){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.id=$stateParams.id;	
	$scope.goChat=function(id){
		appUtils.ftIdToNim(id)
	}
	$scope.myselfInfo = $localStorage.myselfInfo;

	
	// 滚动监听
	$scope.scrollListen=function(){
		try{
			$scope.detailScrollTop = $ionicScrollDelegate.$getByHandle('sell-house-detail-Scroll').getScrollPosition().top;
		}catch(e){}
		if($scope.detailScrollTop>61){
			$timeout(function(){
				$scope.showHeader=true;
			})
		}else{
			$timeout(function(){
				$scope.showHeader=false;
			})
		}
	}

	$scope.commentArr=[]
	$scope.loadComment=function(){
		$http.get($Factory.NewHouseSource.getcomment.url,{params:{id:$stateParams.id}})
			.then(function(resData){
				$scope.commentArr=JSON.parse(resData.data.ContentJson) || []
			}).catch(function(){
				// enterViewLoad.customload('获取评论列表失败')
			})
	}
	$scope.loadComment()
	// 封装请求
	$scope.reqComment=function(){
		$http.post($Factory.NewHouseSource.savecomment.url,{
			HouseId:$stateParams.id,
			ContentJson:JSON.stringify($scope.commentArr)
		}).then(function(resData){
			$scope.loadComment()
			enterViewLoad.customload('操作成功')
		}).catch(function(err){
			if(err.status==401){
				$state.go('login')
			}else{
				enterViewLoad.customload('操作失败')
			}
		})
	}
	
	$scope.clickLike=function(index){
		$scope.commentArr[index].comment.likeNum++
		$scope.reqComment()		
	}
	$scope.subComment=function(){
		var addData={
			comment:{
				userinfo:$localStorage.myselfInfo,
				content:$scope.commentInput.comment,
				likeNum:0,
				createTime:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
			}
		}
		$scope.commentArr.push(addData)
		$scope.reqComment()	
		$scope.closeCommentModal()
	}
	
	// 房源信息
	var req = {
		method: 'POST',
		url: $Factory.NewHouseSource.postdetail.url+'/'+$stateParams.id,
		headers: {
		'Content-Type': 'application/json'
		},
	};

	$http(req).then(function(resData){
		if(resData.data.house.ExProp){
			resData.data.house.ExProp=JSON.parse(resData.data.house.ExProp)
		}
		$scope.houseinfo=resData.data.house;
		$scope.bannerarr=resData.data.house.IndoorShowImages;
		$scope.totalbanner=resData.data.house.IndoorShowImages.length;
		$scope.userinfo=resData.data.info;
		if($scope.bannerarr.length>0){
			$ionicSlideBoxDelegate.update();//重绘，显示轮播图
			if($scope.bannerarr.length>2){
				$ionicSlideBoxDelegate.loop(true);//循环
			}
		}
		if($scope.bannerarr.length==1){
			$('sell_house_detail .slider-pager').css('display','none')
		}
		
		
		$scope.FirstPayment = parseInt(resData.data.house.Price / 4);
		var mp = 3.05 / 100 / 12;
		$scope.Monthly = parseInt(resData.data.house.Price * 10000 * 0.75 * mp * Math.pow((1 + mp), 360) / (Math.pow((1 + mp), 360) - 1));
		$scope.UnitPrice = parseInt(resData.data.house.Price * 10000 / resData.data.house.Space)

		
		//房源描述两种格式显示
		if(resData.data.house.Discription){
			$scope.Discription=resData.data.house.Discription
			$scope.sliceDiscription=resData.data.house.Discription.substring(0,1)=='{'
			if($scope.sliceDiscription){
				$scope.cutDiscription=JSON.parse(resData.data.house.Discription).SellingPoint;
				$scope.cutMind=JSON.parse(resData.data.house.Discription).Mind;
				$scope.cutSupport=JSON.parse(resData.data.house.Discription).Support;
				$scope.cutService=JSON.parse(resData.data.house.Discription).Service;
				
			}
		}
		
		//其它最多显示五个
		if(resData.data.others.length>5){
			$scope.otherArr=resData.data.others.slice(0,5);					
		}else{
			$scope.otherArr=resData.data.others;
		}

		// 地图
		// 创建地址解析器实例     
		var myGeo = new BMap.Geocoder();      
		// 将地址解析结果显示在地图上，并调整地图视野    
		myGeo.getPoint(resData.data.house.CommunityAddress, function(point){
			$timeout(function(){
				var map = new BMap.Map("sellhousedetail_map");      
				if (point) {    
					map.centerAndZoom(point, 16);      
					map.addOverlay(new BMap.Marker(point));    
				}else{
					map.centerAndZoom(new BMap.Point(118.181163, 24.488326), 16);      
					map.addOverlay(new BMap.Point(118.063663,24.606958)); 
				}    
			},500)
		},"厦门市"); 
	

	  
		/**
		 *图片预加载
		*/
		var arrImgs = new Array();
		for(var i=0; i<$scope.bannerarr.length; i++) {
	
		var img = new Image();
		img.src = $scope.bannerarr[i];
		img.onload = function(i) {
			arrImgs[i] = img;
		}(i);
		
		}
		/**
		 *双击触发事件
		*$index表示是第几张图片的索引，直接从该图片放大显示。
		*/
		$scope.onDoubleTap = function($index) {
			actionImgShow.show({
				"larImgs": arrImgs,
				//"larImgs": allimgs,配置成这个也是可以的，只是图片没有预加载，每次放大预览都需要重新加载图片 
				"currentImg": $index,
				imgClose : function() {
					actionImgShow.close();
				}
			})
		}
	  
	})

	
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeindex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('sell-house-detail-handle').currentIndex();
	}

	
	// 分享
	$ionicModal.fromTemplateUrl('sell_house_detail_share_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.shareModal = modal;
	});
	$scope.showBottomShareModal=function(){
		$scope.shareModal.show();	
	}
	$scope.closeBottomShareModal=function(){
		$scope.shareModal.hide();
	}
	
	// 评论
	$scope.commentInput={
		comment:''
	}
	$ionicModal.fromTemplateUrl('sell_house_detail_comment_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.commentModal = modal;
	});
	$scope.showCommentModal=function(){
		$scope.commentModal.show();	
	}
	$scope.closeCommentModal=function(){
		$scope.commentModal.hide();
	}

	// 代理方法
	$ionicPopover.fromTemplateUrl('sell_house_detail_popover', {
		scope: $scope
	}).then(function(popover) {
		$scope.agencyPopover = popover;
	});
	$scope.openPopover = function($event) {
		$scope.agencyPopover.show($event);
	};
	$scope.closePopover = function() {
		$scope.agencyPopover.hide();
	};
	$scope.chooseAgencyType=function(type){
		$scope.closePopover()
		$state.go('agencyAgreement',{houseid:$scope.houseinfo.Id,agencytype:type})
	}

//调用微信分享 
	$scope.share = function(shareto){
		$scope.shareImgUrl=$scope.bannerarr.slice(0,1)&&$scope.bannerarr.slice(0,1)[0].length>0 ? 
						$scope.bannerarr.slice(0,1)[0]:'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0 || shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.houseinfo.Title||'二手房出售',
						thumb: base64,
						description: ($scope.sliceDiscription ? $scope.cutDiscription :$scope.Discription) || '房田网为您推荐',
						media: {
							type: Wechat.Type.LINK,
								webpageUrl:appUtils.shareHost+"/#"+$location.path()
							}
					}
				};
				WechatService.share($scope.params);
			})
			
		}else{
			var args = {};
			args.url = appUtils.shareHost+"/#"+$location.path();
			args.title = $scope.houseinfo.Title||'二手房出售';
			args.description = ($scope.sliceDiscription ? $scope.cutDiscription :$scope.Discription) || '房田网为您推荐';
			if(shareto==2){
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
					
				}, function (failReason) {
					
				}, args);
			}
		}

		// var cfg = {
		// 	title: $scope.houseinfo.Title||'二手房出售',
		// 	desc: $scope.Discription || '房田网为您推荐',
		// 	link: appUtils.shareHost+"/#/sellhousedetail/"+$stateParams.id,
		// 	imgUrl: $scope.shareImgUrl || 'http://imgs.wujiuyun.com/images/logo.png'
		// };
	
		// if ($window.wx) {
		// 	$window.wx.ready(function () {
		// 		if(shareto==0){
		// 			$window.wx.onMenuShareAppMessage(cfg);
		// 		}else{
		// 			$window.wx.onMenuShareTimeline(cfg);
		// 		}
		// 	});
		// }
    }
	
})
