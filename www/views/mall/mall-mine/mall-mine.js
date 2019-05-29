angular.module('App').controller('mallMineCtl',function($myBusinessData, NimUtils, appUtils, enterViewLoad, $localStorage, $ionicScrollDelegate, $ionicModal, $ionicLoading, $timeout, $interval, $ionicHistory, $Factory, $scope, $state, $http, $rootScope){
	$scope.activeTabName='mall-mine';
	$scope.statusData=appUtils.statusData;

	// 去我的个人主页
	$scope.goMyBusiness = function (tag) {
		$myBusinessData.tag = tag;
		$state.go('myBusiness')
	}

	// 实名弹窗
	$ionicModal.fromTemplateUrl('mallmine_real_name_modal', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.realnameModal = modal;
    });
    $scope.showRealNameModal=function(){
        $scope.realnameModal.show();	
    }
    $scope.closeRealNameModal=function(){
        $scope.realnameModal.hide();
    }

	// 切换进入相应子页面
	$scope.childPageName = null
	$scope.showChildPage = function (name) {
		if (!$scope.Logined) {
			$state.go('login')
		} else {
			$scope.childPageName = name
		}
		$ionicScrollDelegate.resize();
	}
	$scope.hideChildPage = function () {
		$scope.childPageName = null
		$ionicScrollDelegate.resize();
	}
	// 人脉图谱列表显示
	$scope.showMapType = false;
	$scope.toggleMapType = function () {
		$scope.showMapType = !$scope.showMapType;
	}

	$scope.$on('$ionicView.leave', function () {
	})
	
	$scope.Logined = false;
	$scope.myShopInfo=''//我的商品信息

	$scope.$on('$ionicView.enter', function () {
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		// 计算会话未读数
		var _calcUnread = function (sessions) {
			for (var i = 0; i < sessions.length; i++) {
				$scope.totalUnread = $scope.totalUnread + sessions[i].unread
			}
		}
		// 会话未读数
		$scope.totalUnread = 0;
		_calcUnread(NimUtils.sessionList)
		// 会话列表 未读数 更新
		$rootScope.$on('updateSessions', function (event, data) {
			$timeout(function () {
				$scope.totalUnread = 0;
				_calcUnread(data)
			})
		})

		// 个人信息
		$http.get($Factory.Account.getuserinfo.url)
			.then(function (res) {
				$scope.myInfo = res.data;
				$scope.Logined = true;

			}).catch(function (err) {
				$scope.childPageName = null
				$scope.Logined = false;
				if (err.status = 401) {
				} else {
					enterViewLoad.customload(err.Message)
				}
			})
		// 我的商铺信息
		$http.get($Factory.Shoper.get.url)
			.then(function(resData){
				$scope.myShopInfo=resData.data;
			}).catch(function(err){
				$scope.myShopInfo=''
			})
		//其他个人品牌信息
		$http.post($Factory.Zone.home.url + '?uid=0', {
			type: 0,
			pagesize: 0
		}).then(function (resData) {
			for (var i = 0; i < resData.data.length; i++) {
				if (resData.data[i].Type == 10) {
					$scope.dynamicData = resData.data[i].List.filter(function (item) {
						if (appUtils.isJsonString(item.Content)) {
							item.Content = JSON.parse(item.Content)
						} else {
							item.Content = {}
						}
						return item
					})
					$scope.newsList = []
					$scope.newsList = resData.data[i].List.map(function (item) {
						return item.Content.text
					})

					new Swiper('.personal-tl-swiper', {
						direction: 'vertical',
						autoplay: true, //自动滑动
						loop: $scope.newsList.length > 1 ? true : false,
					});
				} else if (resData.data[i].Type == 20) {
					$scope.imagesData = resData.data[i].List
				} else if (resData.data[i].Type == 30) {
					$scope.videosData = resData.data[i].List.filter(function (item) {
						if (appUtils.isJsonString(item.Content)) {
							item.Content = JSON.parse(item.Content)
						} else {
							item.Content = {}
						}
						return item
					})
				} else if (resData.data[i].Type == 60) {
					if (resData.data[i].List.length > 0) {
						if (appUtils.isJsonString(resData.data[i].List[0].Content)) {
							$scope.honorImageUrl = JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
						}
						$scope.honorImageId = resData.data[i].List[0].Id
					} else {
						$scope.honorImageUrl = ''
					}
				} else if (resData.data[i].Type == 50) {
					if (resData.data[i].List.length > 0) {
						var time_now = new Date().getTime()
						if (appUtils.isJsonString(resData.data[i].List[0].Content)) {
							$scope.posterImageUrl = JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
						}
						$scope.posterImageId = resData.data[i].List[0].Id
					} else {
						$scope.posterImageUrl = ''
					}
				} else if (resData.data[i].Type == 80) {
					if (resData.data[i].List.length > 0) {
						$scope.photoBgImg = resData.data[i].List[0].Content;
					} else {
						$scope.photoBgImg = ''
					}
				} else if (resData.data[i].Type == 90) {
					if (resData.data[i].List.length > 0) {
						$scope.videoBgImg = resData.data[i].List[0].Content;
					} else {
						$scope.videoBgImg = ''
					}
				}
			}
		}).catch(function () {
			enterViewLoad.customload('加载数据失败');
			$scope.photoBgImg = '';
			$scope.videoBgImg = ''
			$scope.posterImageUrl = ''
			$scope.honorImageUrl = ''
		})
	});
})