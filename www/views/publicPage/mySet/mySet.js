
angular.module('App').controller('mySetCtl',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicModal,$timeout,$ionicHistory,$cordovaAppVersion,$cordovaFileTransfer, $cordovaFile, $cordovaFileOpener2,$rootScope,$http,$Factory,$state,$scope,$stateParams,$ionicPopup,$ionicLoading){
	$scope.back=function(){
        appUtils.back();
    }
    // 新版本
    $scope.hasNewVersion=appUtils.statusData.hasNewVersion;

    $ionicModal.fromTemplateUrl('myset_real_name_modal', {
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

    $http.get($Factory.Account.getuserinfo.url)
        .then(res=>{
            $scope.myInfo=res.data;
        }).catch(function(){
            
        })
    // 点击实名
	$scope.realName=function(){
		if($scope.myInfo && $scope.myInfo.VStatus==2){
			enterViewLoad.customload('您已实名')
		}else if($scope.myInfo&&$scope.myInfo.VStatus==1){
			enterViewLoad.customload('审核中')
		}else{
			$scope.showRealNameModal()
		}
	}

    $scope.getBindInfo=function(){
        $http.post($Factory.Account.getexterlogins.url)
            .then(function(resData){
                for(var i=0;i<resData.data.length;i++){
                    if(resData.data[i].LoginProvider=='Weixin'){
                        $scope.weixinBindInfo=resData.data[i];
                        $scope.bindWeixinStatus=true;
                    }else if(resData.data[i].LoginProvider=='QQ'){
                        $scope.qqBindInfo=resData.data[i];
                        $scope.bindQQStatus=true;
                    }
                }
            }).catch(function(err){

            })
    }
    $scope.$on('$ionicView.enter',function(){
        $scope.bindWeixinStatus=false;
        $scope.bindQQStatus=false;
        $scope.getBindInfo()		
    })
    // 绑定微信
    $scope.bindWeixin=function(){
        appUtils.wechatUnionId(function(userinfo){
            $http.post($Factory.Account.addexterlogin.url,
            	{
                    LoginProvider:'Weixin',
                    ProviderKey:userinfo.unionid,
                    // ProviderKey:'oq1fUwyK8GtCDfah7PeVf4XhkXb0'
                }).then(function(resData){
                    enterViewLoad.customload('绑定成功');
            		$scope.getBindInfo()
            	}).catch(function(err){
                    enterViewLoad.customload('绑定失败');
            	})
        },function(){
            enterViewLoad.customload('绑定失败');
        })   
    }
    // 绑定QQ
    $scope.bindQQ=function(){
        appUtils.qqLoginAndroid(function(userinfo){
            $http.post($Factory.Account.addexterlogin.url,
            	{
                    LoginProvider:'QQ',
                    ProviderKey:userinfo.userid,
                }).then(function(resData){
                    enterViewLoad.customload('绑定成功');
            		$scope.getBindInfo()
            	}).catch(function(err){
                    enterViewLoad.customload('绑定失败');
            	})
        },function(){
            enterViewLoad.customload('绑定失败');
        })   
    }

    
    // 解绑对话框
    $scope.removeBind=function(item){
        var bindConfirmPopup= $ionicPopup.confirm({
	        title: '确定解除绑定？',
            cancelText: '取消',
            okText: '确定'
        });
        bindConfirmPopup.then(function(res) {
            if(res){
                $http.post($Factory.Account.removelogin.url,item)
                	.then(function(resData){
                        enterViewLoad.customload('解绑成功');
                        if(item.LoginProvider=='Weixin'){
                            $scope.bindWeixinStatus=false;
                        }else if(item.LoginProvider=='QQ'){
                            $scope.bindQQStatus=false;
                        }
                	}).catch(function(err){
                        enterViewLoad.customload('解绑失败')
                	})
            }else{}
        })
    }
    //confirm 对话框
   	$scope.logout = function() {
     	var confirmPopup = $ionicPopup.confirm({
	        title: '确定退出？',
            cancelText: '取消',
            okText: '退出'
        });
        
     	confirmPopup.then(function(res) {
	        if(res) {
                $http.post($Factory.Account.logout.url).then(function(resData){
                    appUtils.resetLocalStorage();
                    $scope.back()
                    // 登出云信
                    nim.disconnect();
                    // 数据清零
                    NimUtils.clearData();
                    
                }).catch(function(err){
                    if(err.status==401){
                        appUtils.resetLocalStorage()
                        $scope.back(); 
                    }
                })
	        }else{
	         
	        }
     	});
    };
    
    // 检查更新
    function checkUpdate() {
        document.addEventListener("deviceready", function () {
            $http.post($Factory.AppJson.version.url).then(function(resData){
                var serverAppVersion = resData.data.android.version; //从服务端获取最新版本号
                //获取版本
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    // if (version != serverAppVersion) {
                    if (version >= serverAppVersion) {
                        $ionicLoading.show({
                            template:'当前已是最新版本',
                            duration:2000
                        });
                    }else{
                        showUpdateConfirm(resData.data.android.versionDescription,resData.data.android.updateUrl,serverAppVersion);
                    }
                });
                
            })
        }, false);
    }

   
    // 显示是否更新对话框
    function showUpdateConfirm(updateinfo,updateurl,version){
        var confirmPopup = $ionicPopup.confirm({
            title: '检查到新版本'+version,
            template: updateinfo, //从服务端获取更新的内容
            cancelText: '取消',
            okText: '升级'
        });
        confirmPopup.then(function (res){
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

    $scope.checkVersion=function(){
        checkUpdate()
    } 

    $scope.notNow=function(){
        enterViewLoad.customload('暂未开通');
    }

})
