angular.module('App').controller('clickShareCtl',function(appUtils,enterViewLoad,WechatService,$location,wechatLinkBase,$ionicModal,$rootScope,$ionicPopover,$ionicHistory,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	
	// $http.get($Factory.Account.getuserinfo.url).then(function(resData){
	// 	$scope.myinfo=resData.data;
	// 	$scope.qcode=$Factory.Account.qcode.url+'?id='+resData.data.Id;	
	// }).catch(function(err){
	// })
	$scope.qcode=$Factory.Account.qcode.url+'?id='+$stateParams.id;	

	$scope.downloadImage = function(photoPath) {
		if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){		
		}else{
			//检查权限
			var permissions = cordova.plugins.permissions;
			permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
			function checkPermissionCallback(status) {
				if (!status.hasPermission) {
					// 没有权限
					var errorCallback = function() {
						console.warn('Storage permission is not turned on');
					}
					permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE,
						function(status){
							if (!status.hasPermission) {
								// 拒绝权限
								return
							} else {
								// 打开权限 
							}
						},errorCallback);
				}else{
				   // 有权限 		   
				}
			}
		}

		var pictrueUrl = encodeURI(photoPath);
		function saveImageToPhone(url, success, error) {
			var canvas, context, imageDataUrl, imageData;
			var img = new Image();
			img.onload = function() {
				canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				context = canvas.getContext('2d');
				context.drawImage(img, 0, 0);
				try {
					imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
					imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
					cordova.exec(
						success,
						error,
						'Canvas2ImagePlugin',
						'saveImageDataToLibrary', [imageData]
					);
				}catch(e){
					error(e.message);
				}
			};
			try{
				img.src = url;
			}catch(e){
				
			}
		}
	
		var success = function(msg) {
			enterViewLoad.customload('保存图片成功')
		};
		var error = function(err) {
			enterViewLoad.customload('未设置存储权限，保存失败')
		};
		saveImageToPhone(photoPath, success, error);
		$scope.closePopoverView()
	}


	//把浮动框读取到作用域中
	$ionicModal.fromTemplateUrl('click_share_share_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.shareModal = modal;
	});
	$scope.showBottomShareModal=function($e,iftrue){
		$scope.shareModal.show();	
		$scope.showShare=iftrue
	}
	$scope.closeBottomShareModal=function(){
		$scope.shareModal.hide();
	}


	$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.myinfo=resData.data;	
			$scope.ParPhone=window.btoa(resData.data.UserName)		
		}).catch(function(err){
			if(err.status=401){
				enterViewLoad.customload('登录超时')			
			}
		})
	$scope.share = function (shareto) {
		$scope.shareImgUrl=$scope.myinfo.ShowImage?$scope.myinfo.ShowImage:'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.myinfo.Name || '房田用户',
						thumb: base64,
						description:$scope.myinfo.Name+'邀您上房田',
						media: {
							   type: Wechat.Type.LINK,
							//    webpageUrl:appUtils.shareHost+"/#"+$location.path()
							   webpageUrl:appUtils.shareHost+'/#/shareregister/'+$scope.ParPhone
						}
					}
				};			   
				WechatService.share($scope.params);
			})
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
