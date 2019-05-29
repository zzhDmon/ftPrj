
angular.module('App').controller('newHouseDetailCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$ionicScrollDelegate,$location,$localStorage,$ionicModal,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicSlideBoxDelegate,$ionicPopup){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.id=$stateParams.id;
	$scope.goChat=function(id){
		appUtils.ftIdToNim(id)
	}
	
	// 滚动监听
	$scope.scrollListen=function(){
		try{
			$scope.detailScrollTop = $ionicScrollDelegate.$getByHandle('new-house-detail-Scroll').getScrollPosition().top;
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
		
	$http.get($Factory.NewHouse.getdetail.url,{params:{id:$stateParams.id}})
	.then(function(resData){
		$scope.newHouseInfo=resData.data;

		$scope.bannerarr=resData.data.ShowBuildingImg;
		$scope.totalbanner=resData.data.ShowBuildingImg.length;
		if($scope.bannerarr.length>0){
			$ionicSlideBoxDelegate.update();//重绘，显示轮播图
			if($scope.bannerarr.length>2){
				$ionicSlideBoxDelegate.loop(true);//循环
			}
		}

		// 地图
		// 创建地址解析器实例     
		var myGeo = new BMap.Geocoder();      
		// 将地址解析结果显示在地图上，并调整地图视野    
		myGeo.getPoint(resData.data.Address, function(point){
			$timeout(function(){
				var map = new BMap.Map("newhousedetail_map");      
				if (point) {    
					map.centerAndZoom(point, 16);      
					map.addOverlay(new BMap.Marker(point));    
				}else{
					map.centerAndZoom(new BMap.Point(118.181163, 24.488326), 16);      
					map.addOverlay(new BMap.Point(118.063663,24.606958)); 
				}    
			},500)
		},"厦门市"); 

	})

	// 户型图渲染完成
	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		// swiper
		var mySwiper = new Swiper('#new_house_detail_swiper', {
			freeMode: true,
			freeModeMomentumRatio: 0.5,
			slidesPerView: 'auto',
		});
    });	
	
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeindex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('fydetail-handle').currentIndex();
	}


	$scope.applyAgent = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: '申请代理',
			template: '确认申请代理这套房子?',
			cancelText:'取消',
			okText:'确认'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$http.post($Factory.NewHouseProxy.applicant.url,$scope.newHouseInfo.Id)
					.then(function(res){
						enterViewLoad.customload('申请成功')
						$scope.newHouseInfo.IsProxed=true;
					})
				
			} else {
				enterViewLoad.customload('取消')
			}
		});
	};
	
	// 分享
	$ionicModal.fromTemplateUrl('new_house_detail_share_modal', {
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
	
	$scope.share = function (shareto) {
		// 保存分享记录
		$scope.saveShare();

		$scope.shareImgUrl=$scope.bannerarr.slice(0,1)&&$scope.bannerarr.slice(0,1)[0].length>0 ?
							$scope.bannerarr.slice(0,1)[0]:'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.newHouseInfo.NewHouseName||'新房出售',
						thumb: base64,
						description:$scope.newHouseInfo.SupportingFacilities||'房田网为您推荐',
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
			args.title =  $scope.newHouseInfo.NewHouseName||'新房出售';
			args.description = $scope.newHouseInfo.SupportingFacilities||'房田网为您推荐';
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
	}
	// 保存分享记录
	$scope.saveShare=function(){
		$http.post($Factory.Share.save.url,{ 
			ShareType: 1,
			ObjectId:$stateParams.id,
			Phone :$localStorage.myselfInfo ? $localStorage.myselfInfo.UserName : ''
		}).then(function(res){
		}).catch(function(e){
		})
	}

	
})
