angular.module('App').controller('bonusListCtl',function(enterViewLoad,appUtils,wechatLinkBase,WechatService,$localStorage,$ionicModal,$rootScope,$timeout,$interval,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.initData()
	})
	$scope.$on('$ionicView.leave',function(){
		if($scope.intervalName)$interval.cancel($scope.intervalName)
	})

	// 个人或列表
	$scope.pageId=$stateParams.id || 0
	$scope.initData=function(){
		$http.post($Factory.WaitReceive.bonuslist.url+'?uid='+$scope.pageId).then(function(res){
			if(res.data.result.length>0){}
			$scope.pageData=res.data.result
			$scope.intervalName = $interval(function(){
				for(var i=0;i<$scope.pageData.length;i++){
					$scope.pageData[i].StartSec=$scope.pageData[i].StartSec-1
				}
			},1000)


			// $scope.userRoles=res.data.userRole ? res.data.userRole.split('|') : [];//可领奖励金的身份
			// $scope.pageData=res.data.result.filter(function(item){
			// 	item.Attach=JSON.parse(item.Attach)
			// 	item.Attach=item.Attach.reverse()
			// 	item.Attach=item.Attach.filter(function(attach){
			// 		if($scope.userRoles.indexOf(attach.Role)>=0){
			// 			attach.canGet=true
			// 		}else{
			// 			attach.canGet=false
			// 		}
			// 		return attach
			// 	})
			// 	return item
			// })
		}).catch(function(){
			enterViewLoad.customload('请求数据失败')
		})
	}
	
	
	// 暂不可领取
	$scope.disGet=function(){
		enterViewLoad.customload('未到领取时间',2000)
	}
	// 领取奖励金
	$scope.getBonus=function(item){
		console.log($scope.pageData)
		return
		$http.post($Factory.WaitReceive.getbonus.url+'?id='+$scope.pageData.Id+'&role='+item.Role)
		.then(function(res){
			enterViewLoad.customload('领取成功')
			$scope.initData()
		}).catch(function(err){
			var msg = err.data.Message || '领取失败'
			enterViewLoad.customload(msg)
		})
	}

	//把分享浮动框读取到作用域中
	$ionicModal.fromTemplateUrl('bonus_list_share_modal', {
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
				args.url = appUtils.shareHost+'/#/registershareposter/'+$scope.ParPhone
				args.title = $scope.myinfo.Name || '房田用户';
				args.description =$scope.myinfo.Name+'邀您上房田';
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var args = {};
				args.url = appUtils.shareHost+'/#/registershareposter/'+$scope.ParPhone;
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


