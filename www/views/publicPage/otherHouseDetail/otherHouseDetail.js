
angular.module('App').controller('otherHouseDetailCtl',function(appUtils,enterViewLoad,WechatService,wechatLinkBase,$location,$localStorage,$ionicScrollDelegate,$ionicModal,$timeout,$ionicHistory,$scope,$state,$stateParams,$http,$Factory,$ionicSlideBoxDelegate,$ionicPopup,$ionicPopover){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.id=$stateParams.id;
	$scope.isshop=$stateParams.isshop;
	$scope.goChat=function(id){
		appUtils.ftIdToNim(id)
	}
	$scope.myselfInfo = $localStorage.myselfInfo;

	
	// 滚动监听
	$scope.scrollListen=function(){
		try{
			$scope.detailScrollTop = $ionicScrollDelegate.$getByHandle('other-house-detail-Scroll').getScrollPosition().top;
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

	$http.get($Factory.SimpleHouse.getdetail.url,({params:{id:$stateParams.id,isShop:$stateParams.isshop}})).then(function(resData){	
		if(resData.data.ConfigurJson){
			resData.data.ConfigurJson=JSON.parse(resData.data.ConfigurJson)
		}

		$scope.houseinfo=resData.data;

		$scope.bannerarr=resData.data.IndoorShowImages;
		$scope.totalbanner=resData.data.IndoorShowImages.length;
		
		if($scope.bannerarr.length>0){
			$ionicSlideBoxDelegate.update();//重绘，显示轮播图
			if($scope.bannerarr.length>2){
				$ionicSlideBoxDelegate.loop(true);
			}
		}
		

		// 地图
		// 创建地址解析器实例     
		var myGeo = new BMap.Geocoder();      
		// 将地址解析结果显示在地图上，并调整地图视野    
		myGeo.getPoint(resData.data.CommunityName, function(point){
			$timeout(function(){
				var map = new BMap.Map("other_house_detail_map");      
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
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeindex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('other-house-detail-handle').currentIndex();
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
				enterViewLoad.customload('申请成功')
			} else {
				enterViewLoad.customload('申请失败')
			}
		});
	};
	
	// 分享
	$ionicModal.fromTemplateUrl('other_house_detail_share_modal', {
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
		$scope.shareImgUrl=$scope.bannerarr.slice(0,1)&&$scope.bannerarr.slice(0,1)[0].length>0 ? 
							$scope.bannerarr.slice(0,1)[0]:'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.houseinfo.Title||'二类房出售',
						thumb: base64,
						description:$scope.Discription || '房田网为您推荐',
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
			args.title = $scope.houseinfo.Title||'二类房出售';
			args.description = $scope.Discription || '房田网为您推荐';
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
	
})
