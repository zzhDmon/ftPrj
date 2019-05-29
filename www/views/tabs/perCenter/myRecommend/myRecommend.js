angular.module('App').controller('myRecommendCtl',function(appUtils,wechatLinkBase,WechatService,$localStorage,$ionicModal,$rootScope,$ionicHistory,$timeout,$scope,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.getData()
		$scope.createModal()
	})
	$scope.$on('$ionicView.leave',function(){
		$scope.modal.remove()
		$scope.shareModal.remove()
	})

	$scope.myId=$localStorage.myselfInfo.Id

	$scope.getData=function(){
		$http.post($Factory.Account.gethier.url)
			.then(function(res){
				res.data.total=(res.data.total/100).toFixed(2)
				$scope.myInvitation=res.data;
			})
	}
	
	$scope.createModal=function(){
		$ionicModal.fromTemplateUrl('vip_rule_modal', {
				scope: $scope,
				animation: 'slide-in-left'
			}).then(function(modal) {
				$scope.modal = modal;
		});
		$scope.showModal=function(){
			$scope.modal.show();
		}
		$scope.closeModal=function(){
			$scope.modal.hide();
		}

		//把分享浮动框读取到作用域中
		$ionicModal.fromTemplateUrl('my_recommend_share_modal', {
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
	}




	// 点击分享
	$scope.myinfo=$localStorage.myselfInfo;	
	$scope.ParPhone=window.btoa($localStorage.myselfInfo.UserName)		
	$scope.share = function(shareto){
		$scope.shareImgUrl=$Factory.Account.qcode.url+'?id='+$localStorage.myselfInfo.Id;
		if(shareto==0||shareto==1){
			var mycans = document.createElement("canvas");
			mycans.width = 375;
			mycans.height = 468;
			var cxt = mycans.getContext("2d");
			var img = new Image();
			img.src = $scope.shareImgUrl;
			img.onload = function(){
				cxt.drawImage(img,0,0,375,468);	
				var base = mycans.toDataURL("image/png");
				$scope.params ={
					scene: shareto,
					message: {
						title: "【房田网】为您推荐",
						thumb: base,
						description: 'Discription',
						media: {
							type: Wechat.Type.IMAGE,
							image:base// 分享的url
						}
					}
				};
				WechatService.share($scope.params);
				return;
			}
		}else{
			if(shareto==2){
				var args = {};
				args.url = appUtils.shareHost+'/#/shareregister/'+$scope.ParPhone
				args.title = $scope.myinfo.Name || '房田用户';
				args.description =$scope.myinfo.Name+'邀您上房田';
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var args = {};
				args.url = appUtils.shareHost+'/#/shareregister/'+$scope.ParPhone;
				args.title =  $scope.myinfo.Name || '房田用户';
				args.description = $scope.myinfo.Name+'邀您上房田';
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
					
				}, function (failReason) {
					
				}, args);
			}
		}

	}
	

})
