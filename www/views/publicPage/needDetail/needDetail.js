angular.module('App').controller('needDetailCtl',function(appUtils,WechatService,wechatLinkBase,$localStorage,$ionicModal,$http,$Factory,$state,$stateParams,$scope,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};
	
	$scope.$on('$ionicView.enter',function(){
		$scope.myselfInfo = $localStorage.myselfInfo;
	})
	$scope.goChat=function(id){
		if($localStorage.myselfInfo.Id==id){
			$ionicLoading.show({
				template:'你的需求',
				duration:1500
			})
			return
		}
		$state.go('dialogBox',{id:'fangtian_'+id})
	}

	$http.get($Factory.HouseNeed.detail.url,{params:{id:$stateParams.id}})
		.then(function(res){
			$scope.needInfo=res.data;
			$scope.needUserInfo=res.data.UserInfo
		})
	// 分享
	$ionicModal.fromTemplateUrl('need_detail_share_modal', {
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
		switch($scope.needInfo.Type){
			case 0:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购新房';
				break;
			case 1:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购二手房';
				break;
			case 2:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租房';
				break;
			case 3:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租商铺';
				break;
			case 4:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租写字楼';
				break;
			case 5:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购商铺';
				break;
			case 6:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租工厂';
				break;
			case 7:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购工厂';
				break;
			case 8:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租仓库';
				break;
			case 9:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购仓库';
				break;
			case 10:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租车位';
				break;
			case 11:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购车位';
				break;
			case 12:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购新房';
				break;
			case 13:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租合租';
				break;
			case 14:
				$scope.shareTitle=$scope.needUserInfo.Name+'求租品牌公寓';
				break;
			case 15:
				$scope.shareTitle=$scope.needUserInfo.Name+'个人房源';
				break;
			case 16:
				$scope.shareTitle=$scope.needUserInfo.Name+'房东委托';
				break;
			case 17:
				$scope.shareTitle=$scope.needUserInfo.Name+'求购写字楼';
				break;
			default:
				$scope.shareTitle=$scope.needUserInfo.Name+'的房源需求';
				break;
		}
		$scope.shareImgUrl=$scope.needUserInfo.ShowImage || 'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.shareTitle || '房田用户房源需求',
						thumb: base64,
						description:$scope.needInfo.Attach||'需求详情',
						media: {
							   type: Wechat.Type.LINK,
							   webpageUrl:appUtils.shareHost+"/#/needdetail/params/"+$stateParams.id
						}
					}
				};
				WechatService.share($scope.params);
			})
		}else{
			if(shareto==2){
				var args = {};
				args.url = appUtils.shareHost+"/#/needdetail/params/"+$stateParams.id;
				args.title =  $scope.shareTitle || '房田用户房源需求';
				args.description = $scope.needInfo.Attach||'需求详情';
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var args = {};
				args.url = appUtils.shareHost+"/#/needdetail/params/"+$stateParams.id;
				args.title =  $scope.shareTitle || '房田用户房源需求';
				args.description = $scope.needInfo.Attach||'需求详情';
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
					
				}, function (failReason) {
					
				}, args);
			}
		}
    }
})