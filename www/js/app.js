// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', [
	'ionic',
	'ionicLazyLoad',
	'ngCordova',
	'ngCookies',
	'oc.lazyLoad',
	'ionic-citypicker',
	'angularMoment',
	'monospaced.elastic',
	'ngStorage',
	'ionic-native-transitions',
	'ng-img','starter.imgservices',//双击放大enable
	'ngFileUpload',
	'ionicRipple'
])
.config([ 
	'$ionicConfigProvider',
	'$stateProvider',
	'$urlRouterProvider',
	'$httpProvider',
	'$ionicNativeTransitionsProvider',
	function ($ionicConfigProvider,$stateProvider,$urlRouterProvider,$httpProvider,$ionicNativeTransitionsProvider) {
	//禁止侧滑后退 white screen
	$ionicConfigProvider.views.swipeBackEnabled(false);

	//禁用默认切换动画
	$ionicConfigProvider.views.transition('no');
	// 删除默认滚动条
	// $ionicConfigProvider.scrolling.jsScrolling(false);
	//设置原生切换动画
	$ionicNativeTransitionsProvider.setDefaultOptions({  
	    duration: 200,  
	    slowdownfactor: 4,   
	    iosdelay: -1, 
	    androiddelay: -1, 
	    winphonedelay: -1,   
	    fixedPixelsTop: 0, 
	    fixedPixelsBottom: 0,  
	    triggerTransitionEvent: '$ionicView.afterEnter', 
	    backInOppositeDirection: false  
	}); 
	$ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
	});
	
	// $httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
	$httpProvider.interceptors.push('authInterceptor');
	$stateProvider
	.state('tabs',{
		url:'/tabs',
		abstract: true,
		templateUrl:'views/tabs.html'
	})	
	$urlRouterProvider.otherwise('/tabs/realhome');
	// $urlRouterProvider.otherwise('/tabs/percenter');
}])
.constant('views',{currentView:null})
.factory('authInterceptor', function($timeout,$q,$rootScope,$localStorage){
	var deferred = $q.defer();  
    return {
        request: function(config){
            config.headers = config.headers || {};
                if($localStorage.access_token){
                    config.headers['Authorization'] ="Bearer  " +$localStorage.access_token;
                }
            return config;
        },
        responseError: function(res){
			if(res.status==401){
				$localStorage.$reset();
                $localStorage.firstTimeOpen = true;
			}
			return $q.reject(res);	
        }
    };
})

.run(function(JpushUtils,NimUtils,appUtils,views,$localStorage,$ionicTabsDelegate,$cordovaKeyboard,
	$ionicPopup,$cordovaAppVersion,$cordovaFileTransfer, $cordovaFile, 
	$cordovaFileOpener2,$ionicPlatform,$rootScope,$q,$http,$Factory,
	$state,$ionicHistory,$cordovaToast,$location,$cordovaStatusbar,
	$ionicLoading,$cordovaNetwork,$window,$timeout) {
	//极光推送初始化 
	JpushUtils.init();

	// 已登录网易云 初始化
	if($localStorage.myNimAccount){
		NimUtils.init($localStorage.myNimAccount)
	}
	//不看到 tab-bar
	$rootScope.$on('$ionicView.beforeEnter',function(event,data){
		views.currentView=data.stateName;
		$ionicTabsDelegate.showBar(false)
		// $ionicTabsDelegate.showBar(views.currentView == 'tabs.home')	
		
	})
	$rootScope.$on('$ionicView.beforeLeave',function(event,data){
		//console.log('离开'+data.stateName+'视图');
	})


	//登录拦截，判断后跳转到登录页面可跳转页面
	$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
		$rootScope.fromStateName=fromState.name; //上一路由页面名称
		$rootScope.currentStateName=toState.name; //当前路由页面名称

		var isPublic = angular.isObject(toState.data) && toState.data.isPublic === true;
		var token = $localStorage.access_token;

		if(isPublic){
			return 
		}else if(!isPublic&&!token){
			// 私有页面未登录
			event.preventDefault();// 取消默认跳转行为
			$state.go('login')//跳转到登录界面	
		}else{

		}
	});	
	//ios风格
 	ionic.Platform.setPlatform('ios');
  	$ionicPlatform.ready(function() {
		

	    if(window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		
			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
	    }
	    if(window.StatusBar) {
	        //StatusBar.styleDefault();
	        //StatusBar.styleBlackTranslucent();
	        //StatusBar.hide();     
		}
		
		document.addEventListener("deviceready",function(){
			//啟動頁面消失 取消自动隐藏启动页
			navigator.splashscreen.hide();
		// function f([x,y,z]){
		// 	console.log(x,y,z)
		// }
			// 友盟
			// Umeng.Analytics.config({
			// 	appkey: '59f668bc734be44eb9000352', 
			// 	channel: 'your_channel'
			// }, function (suc) {
			// }, function (err) {
			// });

			// 微信安装
			Wechat.isInstalled(function (installed) {
				if(installed){
					appUtils.statusData.wechatInstalled=true
				}else{
					appUtils.statusData.wechatInstalled=false
				}
			}, function(reason){			
			});
			// qq安装
			YCQQ.checkClientInstalled(function(){
				appUtils.statusData.qqInstalled=true
			},function(){
				appUtils.statusData.qqInstalled=false
			});

			if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){
				//ios 
			}else{ 
				// 检查权限
				var permissions = cordova.plugins.permissions;
				// 多项
				var list = [
					permissions.READ_EXTERNAL_STORAGE,
					permissions.CAMERA,
					permissions.ACCESS_FINE_LOCATION,
					permissions.READ_CONTACTS,
				];

				function error() {
					// some one permission turned on
				}
				// 检查权限列表
				permissions.hasPermission(list, checkPermissionCallback, null);
				function checkPermissionCallback(status){
					if(!status.hasPermission) {
						// 没授权 申请权限
						permissions.requestPermissions(list,function(status){
							if( !status.hasPermission ) error();
						},error);
					}else{
						// 有权限
					}
				}
			} 
			// 检查新版本
			$http.post($Factory.AppJson.version.url).then(function(resData){
				var serverAppVersion = resData.data.android.version; //从服务端获取最新版本号
				//获取版本
				$cordovaAppVersion.getVersionNumber().then(function (version) {
					if (version >= serverAppVersion) {
					}else{
						appUtils.statusData.hasNewVersion=true;
						showUpdateConfirm(resData.data.android.versionDescription,resData.data.android.updateUrl,serverAppVersion)
					}
				});
				
			})
		},false)
		// 检查更新对话框
		function showUpdateConfirm(updateinfo,updateurl,version){
			var confirmPopup = $ionicPopup.confirm({
				title: '检查到新版本'+version,
				template: updateinfo, //从服务端获取更新的内容
				cancelText: '取消',
				okText: '升级'
			});
			confirmPopup.then(function (res) {
				if (res) {
					function downloadFile(){
						var url = updateurl;
						var timestamp = new Date().getTime()
						var targetPath = cordova.file.externalRootDirectory + 'fangtian'+timestamp+'.apk'; //APP下载存放的路径      
						var trustHosts = true;
						var options = {};
						$cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
							// 打开下载下来的APP
							$cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function (){
							}, function (err) {
							});
								   
							$ionicLoading.hide();
						}, function (err) {
							 $ionicLoading.show({
									template: "未设置存储权限，下载失败",
									duration:2000
							   });
						}, function (progress) {
							$timeout(function () {
								var downloadProgress = (progress.loaded / progress.total) * 100;
								$ionicLoading.show({
									template: "已经下载：" + Math.floor(downloadProgress) + "%"
								});
								if (downloadProgress > 99){
									$ionicLoading.hide();
								}
							})
						});
					}
	
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
										errorCallback();
									} else {
										downloadFile();
									}
								},errorCallback);
						}else{
						   // 有权限 
						   downloadFile();
						}
					}
				// 取消下载   
				} else {
					
				}
			});
		}
	});
	
  
	// 双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
		// 滚动选择关闭
		$timeout(function(){
			$('.sel-boxs').hide();
		},100)
		// 关闭查看大图
		if($('#pasp_wrapper').is('.pswp--open')){
			$("#pasp_wrapper").attr("class", "pswp");
			return
		}
        //可以双击退出的页面
		if ($location.path() == '/tabs/realhome'||$location.path() == '/tabs/linkman'||
			$location.path() == '/tabs/chatlist'||$location.path() == '/tabs/percenter' ){
			if($rootScope.tabsType=='HOUSE' && ($location.path() == '/tabs/chatlist'||$location.path() == '/tabs/percenter')){
				// 消息和我的共用页面
				$state.go('tabs.Home')
			}else{
				// 退出/后台运行 选择

				// if ($rootScope.backButtonPressedOnceToExit) {
				// 	ionic.Platform.exitApp();
				// } else {
				// 	$rootScope.backButtonPressedOnceToExit = true;
				// 	$cordovaToast.showShortCenter('再按一次退出房田网');
				// 	$timeout(function () {
				// 		$rootScope.backButtonPressedOnceToExit = false;
				// 	}, 2000);
				// }
				cordova.plugins.backgroundMode.moveToBackground();
			}
		}else if($ionicHistory.backView()) {
			if($cordovaKeyboard.isVisible()) {
				$cordovaKeyboard.close();
			}else{
				// 我的房源页
				if($location.path()=='/percenter/myhouses/'||
					$location.path()=='/percenter/myhouses/1'||
					$location.path()=='/percenter/myhouses/2'||
					$location.path()=='/percenter/myhouses/3'||
					$location.path()=='/percenter/myhouses/4'){

					if(
						$ionicHistory.backView()&&(
						$ionicHistory.backView().stateName=='tabs.Home'|| 
						$ionicHistory.backView().stateName=="guessPrice")
					){
						$rootScope.$ionicGoBack();
					}else{
						$state.go('tabs.perCenter')
					}
				}else if($location.path()=='/percenter/openvip/payvip/paydone'){
					// 支付完成
					$state.go('tabs.perCenter')
				}else if($location.path().substring(0,23)=='/home/noctrvideo/params'){
					// 首页视频播放
					$state.go('tabs.realHome')
				}else{
					$rootScope.$ionicGoBack();
				}
			}
        }else {
			if($location.path()=='/mall/classify'||
				$location.path()=='/mall/cart'||
				$location.path()=='/mall/message'||
				$location.path()=='/mall/mine'){
					$state.go('mallHome')
			}else if($location.path()=='/mall/home'||$location.path()=='/tabs/home'){
				$state.go('tabs.realHome')
			}else if($location.path()=='/home/homeclassify'){
				$state.go('tabs.Home')
			}
        }
        e.preventDefault(); 
        return false;
	}, 101);

	if($window.wx){
		$http.post($Factory.WxJs.jsconfig.url,{url:$location.$$absUrl.split('#')[0]})
			.then(function(res){
				var cfg = angular.extend({
					debug: true,
					appId: '',
					timestamp: '',
					nonceStr: '',
					signature: '',
					jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
				}, res.data);

				$window.wx.config(cfg);
				$window.wx.error(function (res) {
				});
			})
	}
   
})


