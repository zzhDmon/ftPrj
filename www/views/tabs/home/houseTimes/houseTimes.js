
angular.module('App').controller('houseTimesCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$ionicPopover,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.hasLike=false;
	$scope.loadhousetimes=function(){	
		$http.get($Factory.News.get.url,{params:{id:$stateParams.id}}).then(function(resData){
			$scope.dataDetail=resData.data
			$timeout(function(){
				$('br').parent().css("height","10");
			})
			$scope.likeNum=resData.data.Persons ? resData.data.Persons.length : 0;
			if(resData.data.Persons && resData.data.Persons.indexOf($localStorage.myselfInfo.Id+'')>=0){
				$scope.hasLike=true;
			}
		}).catch(function(){
			enterViewLoad.customload('获取房产时报失败')
		})
	}	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()
	})

	$scope.clickLike=function(){
		$http.post($Factory.News.approve.url+'?id='+$stateParams.id)
			.then(function(res){
				$scope.likeNum++;
				$scope.hasLike=true;
			}).catch(function(){
				enterViewLoad.customload('点赞失败')
			})
	}

	
	$ionicModal.fromTemplateUrl('house_times_share_modal', {
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
		$scope.shareImgUrl=$scope.dataDetail.ShowImage || 'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0 || shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.dataDetail.Title || '房源资讯',
						thumb: base64,
						description:$scope.dataDetail.Brief || '房田网为您推荐资讯',
						media: {
								type: Wechat.Type.LINK,
								webpageUrl:appUtils.shareHost+"/#/housetimes/"+$stateParams.id
						}
					}
				};
				WechatService.share($scope.params);
			})
		}else{
			if(shareto==2){
				var args = {};
				args.url = appUtils.shareHost+"/#/housetimes/"+$stateParams.id;
				args.title =  $scope.dataDetail.Title || '房源资讯';
				args.description = $scope.dataDetail.Brief || '房田网为您推荐资讯';
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var args = {};
				args.url = appUtils.shareHost+"/#/housetimes/"+$stateParams.id;
				args.title =  $scope.dataDetail.Title || '房源资讯';
				args.description = $scope.dataDetail.Brief || '房田网为您推荐资讯';
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
					
				}, function (failReason) {
					
				}, args);
			}
		}
    }
})

