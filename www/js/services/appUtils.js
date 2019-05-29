angular.module('App')
.factory('appUtils', [
    'upImgBase',
    '$state',
    '$rootScope',
    '$timeout',
    '$ionicViewSwitcher',
    '$ionicNativeTransitions',
    '$ionicHistory',
    // '$cookies',
    '$cordovaContacts',
    '$ionicModal',
    '$ionicLoading',
    '$http',
    '$Factory',
    '$localStorage',
    '$cordovaInAppBrowser',
    '$cordovaToast',
    '$cordovaKeyboard',
    '$ionicScrollDelegate',
    '$cordovaImagePicker',
    function (upImgBase,$state,$rootScope,$timeout, $ionicViewSwitcher, $ionicNativeTransitions, $ionicHistory,$cordovaContacts,$ionicModal,$ionicLoading, 
        $http,$Factory,$localStorage,$cordovaInAppBrowser, $cordovaToast, $cordovaKeyboard, $ionicScrollDelegat,$cordovaImagePicker) {
        /* util 构造函数 */
        var Util = function () {
            
        };
        /* util 原型对象 */
        Util.prototype = {
            // 分享链接 站点
            shareHost:'https://app.fang-tian.com/app',
            /**
             * 城市Id
             * 1 厦门,2 漳州,3 泉州,4 福州,5 宁德,6 莆田,7 龙岩,8 三明,9 南平,200 中山
             * **/ 
            city:{
                name:'厦门',
                id:1
            },
            currentDistricts:null,
            getCurrentDistricts:function(suc){
                if(this.currentDistricts){
                    suc(this.currentDistricts)
                }else{
                    var _this = this;
                    $http.post($Factory.Community.cities.url+'?city='+_this.city.id).then(function(res){
                        _this.currentDistricts = res.data[_this.city.name]
						suc(_this.currentDistricts)
					}).catch(function(){
						suc(_this.currentDistricts)
					})
                }
            },
            bMapLocation:function(suc,err){
                document.addEventListener("deviceready", function () {
                    baidumap_location.getCurrentPosition(function (result){
                        result.city = result.city.substr(0,result.city.length-1);
                        suc(result)
                        //  result.city 
                    }, function (error){   
                        err(error)
                    })
                }, false);
            },
            /**
             * 微信、qq是否安装  ios是否审核中
             * @params
             * **/ 
            statusData:{
                wechatInstalled:false,
                qqInstalled:false,
                iosInReview:false,
                hasNewVersion:false
            },
            //节流函数 
            throttle:function (func, wait, mustRun) {
                console.log(func, wait, mustRun)
                var timeout,
                    startTime = new Date();
                return function() {
                    var context = this ,
                        args = arguments,
                        curTime = new Date();
                    clearTimeout(timeout);
                    // 如果达到了规定的触发时间间隔，触发 handler
                    if(curTime - startTime >= mustRun){
                        console.log(curTime , startTime , mustRun)
                        func.apply(context,args);
                        startTime = curTime;
                    // 没达到触发间隔，重新设定定时器
                    }else{
                        timeout = setTimeout(func, wait);
                    }
                };
            },
            // 软键盘高度,
            saveKeyboardHeight:function(){
                if(!$localStorage.keyboardHeight){
                    window.addEventListener('native.keyboardshow',function(e){
                        if($localStorage.keyboardHeight){
                            if($localStorage.keyboardHeight>e.keyboardHeight){
                                $localStorage.keyboardHeight=e.keyboardHeight
                            }
                        }else{
                            $localStorage.keyboardHeight=e.keyboardHeight
                        }
                    })
                }
            },
            ftIdToNim:function(id){
                if(!$localStorage.myselfInfo){
                    $state.go('login')
                    return
                }
                if($localStorage.myselfInfo.Id==id){
                    $ionicLoading.show({
                        template:'你的发布!!!',
                        duration:1500
                    })
                    return
                }else{
                    $http.post($Factory.Neteast.user.url+'?id='+id).then(function(resData){
                        if(resData.data.return_code=="SUCCESS"){
                            $state.go('dialogBox',{id:resData.data.return_msg.accid})
                        }else{
                            $ionicLoading.show({
                                template:resData.data.return_msg,
                                duration:1500
                            })
                        }
                    }).catch(function(){
                        $ionicLoading.show({
                            template:'用户未开通微聊',
                            duration:1500
                        })
                    })
                }
            },
            // 相机 获取base64
            /**
             * @params
             * options.width 照片宽 options.height 照片高，suc 成功回调，err 失败回调
             * **/ 
            cameraBase:function(options,suc,err){
                //调用cordova
                document.addEventListener("deviceready", function () {
                    navigator.camera.getPicture(onLoadImageSuccess, onLoadImageFail,{      
                        // destinationType : navigator.camera.DestinationType.FILE_URI,
                        destinationType : 0,
                        // 返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI （在andorid中 FILE_URI和NATIVE_URI返回的结果是一样的）
                        quality : 100,      //图片质量  0-100
                        targetWidth : options.width || 1000,  //照片宽度
                        targetHeight : options.height || 1000,  //照片高度
                        saveToPhotoAlbum : true,  //保存到手机相册
                        encodingType: 0,  //保存的图片格式： JPEG = 0, PNG = 1     Camera.EncodingType.JPEG,
                        allowEdit : false,      //选择之前允许修改截图 
                        cameraDirection:0,     //前后摄像头类型：Back= 0,Front-facing = 1
                        sourceType : 1, // navigator.camera.PictureSourceType.PHOTOLIBRARY ,
                        //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                        mediaType:0,        
                        //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                    }); 
                    //成功的回调
                    function onLoadImageSuccess(imageData) {// imageURI imageData  
                        // data:image/jpeg;base64,
                        var res = 'data:image/jpeg;base64,'+imageData
                        suc(res)
                    }
                    //失败的回调
                    function onLoadImageFail(error){
                        err(error)   
                    } 
                }, false);
            },
            photoLiberary:function(args,suc,err){
                document.addEventListener("deviceready", function () {
                    MediaPicker.getMedias(args,function(medias) {
                        //medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
                        for (var i = 0; i < medias.length; i++) {
                            // if(medias[i].size>1048576){ //1M
                            //     medias[i].quality=50; 
                            // } else {
                            //     medias[i].quality=100; //when the value is 100,return original image
                            // }
                            getResult(medias[i])

                            // medias[i].quality = args.quality || 30; //when the value is 100,return original image
                            // medias[i].quality = 100; //when the value is 100,return original image
                            // MediaPicker.compressImage(medias[i], function(compressData) {
                            //     // 压缩后转base64
                            //     MediaPicker.extractThumbnail(compressData,function(data){
                            //         // imgs[data.index].src = 'data:image/jpeg;base64,' + data.thumbnailBase64;
                            //         // imgs[data.index].setAttribute('style', 'transform:rotate(' + data.exifRotate + 'deg)');
                            //         // suc(data)
                            //     },function(e){
                            //         // err(e)
                            //     });
                            // }, function(e){
                            // });
                        }
                        
                    },function(e){
                        err(e) 
                    })

                    function getResult(media){
                        upImgBase.changeBase(media.path,function(base){
                            MediaPicker.extractThumbnail(media,function(data){
                                // data.exifRotate 顺时针旋转几度后摆正
                                var orientation=1
                                if(data.exifRotate==270){
                                    orientation=8
                                }else if(data.exifRotate==180){
                                    orientation=3
                                }else if(data.exifRotate==90){
                                    orientation=6
                                }else{
                                    orientation=1
                                }
                                suc(base,orientation)
                            },function(e){
                                
                            });
                        })
                    }
                    
                    function getThumbnail(medias){
                        for (var i = 0; i < medias.length; i++) {
                            //medias[i].thumbnailQuality=50; (Optional)
                            MediaPicker.extractThumbnail(medias[i],function(data){
                                // imgs[data.index].src = 'data:image/jpeg;base64,' + data.thumbnailBase64;
                                // imgs[data.index].setAttribute('style', 'transform:rotate(' + data.exifRotate + 'deg)');
                            },function(e){
                               
                            });
                        }
                    }
                },false)
            },
            // 扫描
            scanCode:function(suc,err){
                document.addEventListener("deviceready", function (){
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            suc(result)
                        },function (error) {
                            err(error)
                        },{
                            preferFrontCamera : false, // iOS and Android 前置
                            showFlipCameraButton : false, // iOS and Android
                            showTorchButton : false, // iOS and Android
                            torchOn: false, // Android, 开启手电
                            saveHistory: true, // Android, save scan history (default false)
                            prompt : "请将二维码放入框内", // Android
                            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                            // orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                            disableAnimations : true, // iOS
                            disableSuccessBeep: false // iOS and Android
                        }
                    );
                },false)
            },
            /* 通用返回函数 */
            back: function () {
                // 不同平台分别处理,此处使用了ionic-native-transitions插件
                // ionic.Platform.isIOS() ? $ionicHistory.goBack() : $ionicNativeTransitions.goBack();
                if($ionicHistory.backView()){
                    $rootScope.$ionicGoBack();
                }else{
        
                }
            },
            /* 进入某个路由模块 */ 
            /* 路由的跳转不推荐使用a标签加上相应属性来做,用事件和下面的方法来跳转有效果较好的转场动画 */
            go: function (route, params, callback) {
                $ionicViewSwitcher.nextDirection('forward');
                $state.go(route, params);
                callback && typeof callback === 'function' && callback();
            },

            /* 解决双平台刷新问题的直接进入 tab栏 on-select 时使用 直接进入模块(无动画) */
            doGo: function (url) {
                $ionicNativeTransitions.locationUrl(url, {
                    "type": "fade",
                    "duration": 0
                });
            },

            /* 字符串 trim 函数 */
            trim: function (str) {
                if (typeof str === 'string') {
                    return str.replace(/^\s+|\s+$/g, "");
                }
            },

            /* 截取字符串的方法 */
            textCut: function (str, num) {
                if (typeof str === 'string' && typeof num === 'number' && str.length >= num) {
                    var temp = str.slice(0, num);
                    var last = temp.lastIndexOf(' '); // 找到空格的索引
                    temp = null; // 内存回收
                    return str.slice(0, last) + '...';
                }
                return str;
            },

            /* 此处只演示基于cookie的存储方法 | flag标识: 0 -> ip用户(匿名) , 1 -> 正常用户 */
            /* isLogin为同步存储的登录标识 */
            // storage: function (data, flag, callback) {
            //     var expireDate = new Date();
            //     expireDate.setDate(expireDate.getDate() + 90); // 设置过期时间为3个月(90天)
            //     $cookies.put('token', data.token, {'expires': expireDate}); // cookie 存储token
            //     $cookies.put('user', JSON.stringify(data), {'expires': expireDate}); // cookie 存储 userInfo

            //     // 下面是为正常用户和匿名ip用户的设置，登录与否的标识是isLogin
            //     flag ? $cookies.put('isLogin', true, {'expires': expireDate}) : $cookies.remove('isLogin');
            //     callback && angular.isFunction(callback) && callback();
            // },

            /* 判断是否登录 */
            // isLogin: function () {
            //     return $cookies.get('isLogin');
            // },

            /* 退出功能 */
            resetLocalStorage: function () {
                $localStorage.$reset();
                $localStorage.firstTimeOpen = true;
                // $cookies.remove('user');
                // $cookies.remove('token');
                // $cookies.remove('isLogin');
                // fn && typeof fn === "function" && fn();
            },
            /* 判断是不是JSON字符串 */
            isJsonString:function(str){
                try {
                    if (typeof JSON.parse(str) == "object") {
                        return true;
                    }
                } catch(e) {
                }
                return false;
            },
            /* 获取用户信息 */
            getUser: function () {
                return $cookies.get('user');
            },
            // ft获取用户信息            

            /* 用户提示功能 */
            tips: function (prompt, index) {
                // 位置信息 0 上 , 1 中 , 2 下
                switch (index) {
                    case 0:
                        return window.cordova ? $cordovaToast.showShortTop(prompt) : alert(prompt);
                        break;
                    case 1:
                        return window.cordova ? $cordovaToast.showShortCenter(prompt) : alert(prompt);
                        break;
                    case 2:
                        return window.cordova ? $cordovaToast.showShortBottom(prompt) : alert(prompt);
                        break;
                }
            },

            /* 弹出模态窗口功能 */
            showModal: function (path, scope, animation, cb) {
                $ionicModal.fromTemplateUrl(path, {
                    scope: scope,
                    animation: animation
                }).then(function (modal) {
                    cb && angular.isFunction(cb) && cb(modal);
                });
            },

            /* 隐藏 modal */
            hideModal: function (modal) {
                modal.hide();
            },

            /* 移除 modal 支持多个modal一起移除 */
            destroyModal: function (scope, modal) {
                scope.$on('$destroy', function () {
                    // 如果是单个，则直接移出，如果是数组，则迭代移除
                    if (Array.isArray(modal)) {
                        modal.forEach(function (item) {
                            item.remove();
                        })
                    } else {
                        modal && modal.remove();
                    }
                });
            },

            /* 清除历史记录功能，每次回到tab根目录调用,修复ionic偶尔无法回退bug */
            clearHistory: function () {
                $ionicHistory.clearHistory();
            },

            /* pdf的方法 */
            openPdf: function (url) {
                // 安卓平台进入pdf模块打开，使用的是嵌入了一个pdf的h5网页(后台处理之后的页面)
                if (!ionic.Platform.isIOS()) {
                    return this.go('pdf', {pdf: url});
                }
                // iOS平台通过内置safari打开
                var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'yes'
                };
                // 下面此处只有真机能够打开,浏览器打不开
                document.addEventListener("deviceready", function () {
                    $cordovaInAppBrowser.open(url, '_system', options)
                }, false);
            },

            /* 测试用户是否登录 */
            checkAndGoLogin: function (cb1, cb2) {
                var flag = this.isLogin();  // 是否登录
                if (flag) return cb1();
                this.go('login', null, cb2);
            },

            /* 数组去重功能 */
            arrayUnique: function (arr) {
                if (!Array.isArray(arr)) return;
                var res = [];
                var json = {};
                for (var i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },

            /* 存储搜索记录 */
            getSearchTextStorage: function (searchText) {
                var searchList = [];
                var res = [];
                if (localStorage.searchList && searchText) {
                    searchList = JSON.parse(localStorage.searchList);
                    searchList.unshift(searchText); // 头部加1
                    res = this.arrayUnique(searchList); // 数组去重
                } else if (!localStorage.searchList && searchText) {
                    res.unshift(searchText);
                } else {
                    return localStorage.searchList ? JSON.parse(localStorage.searchList) : [];
                }
                localStorage.searchList = JSON.stringify(res); // 本地存储
                return res;
            },
            /* 键盘监听 只针对安卓,ios会自动处理 */
            /* 其中window.addEventListener可使用ionic内置的 ionic.EventController.on代替 */
            listenKeyBoard: function (cb_show, cb_hide) {
                if (ionic.Platform.isIOS()) return;
                window.addEventListener('native.keyboardshow', function () {
                    cb_show && typeof cb_show === 'function' && cb_show();
                });
                window.addEventListener('native.keyboardhide', function () {
                    cb_hide && typeof cb_hide === 'function' && cb_hide();
                });
            },

            /* 隐藏键盘 */
            hideKeyBoard: function () {
                if (!$cordovaKeyboard.isVisible()) return;
                $cordovaKeyboard.close();
            },

            /* 媒体文件相关功能 */

            /* 用于判断数字是否 < 10 , < 10 则补0 */
            tenFormat: function (num) {
                return num / 10 < 1 ? '0' + num : num;
            },

            /* 处理时分秒 */
            handleTime: function (hour, min, sec) {
                var hh = this.tenFormat(hour);
                var mm = this.tenFormat(min);
                var ss = this.tenFormat(sec);
                return hh + ':' + mm + ':' + ss;
            },

            /* 获取音频或视频时长 */
            getMediaDuration: function (scope, media, mediaData) {
                if (!media.duration) {
                    return;
                }
                mediaData.current = mediaData.duration = '00:00:00'; // 先初始化时间
                mediaData.durationOrigin = media.duration; // 得到音频或视频时长
                var hh = Math.floor(media.duration / 3600);
                var mm = Math.floor(media.duration % 3600 / 60);
                var ss = Math.floor(media.duration % 60);
                mediaData.duration = this.handleTime(hh, mm, ss); // 得到经过格式转换之后的音频或视频时长
                scope.$apply();
            },

            /* 检查媒体时长 */
            checkToGetMediaDuration: function (scope, media, mediaData) {
                !mediaData.durationOrigin && this.getMediaDuration(scope, media, mediaData);
            },

            /* 处理正在进行的时间 格式为: hh:mm:ss */
            handlePlayingTime: function (time) {
                var hh = Math.floor(time / 3600);
                var mm = Math.floor(time % 3600 / 60);
                var ss = Math.floor(time % 60);
                return this.handleTime(hh, mm, ss);
            },
            // 发布底部弹出动画
            fbModalShow:function(){
                $('#home_nav_modalview .close-wrapper .close').addClass('active');
                $('#home_nav_modalview .ul-list .one').css({
                    display:'block'
                })
                $timeout(function(){
                    $('#home_nav_modalview .ul-list .two').css({
                        display:'block'
                    })
                },50)
                $timeout(function(){
                    $('#home_nav_modalview .ul-list .three').css({
                        display:'block'
                    })
                },100)
                $timeout(function(){
                    $('#home_nav_modalview .ul-list .four').css({
                        display:'block'
                    })
                },150)
            },
            fbModalHidden:function(){
                $('#home_nav_modalview .close-wrapper .close').removeClass('active');
                $('#home_nav_modalview .ul-list .animated').css({
                    display:'none'
                })
            },

// 隐藏闪屏
            enterSettings: function () {
                navigator.splashscreen && navigator.splashscreen.hide && navigator.splashscreen.hide(); // 设置闪屏
                window.StatusBar && window.StatusBar.show(); // 显示状态栏
            },

            // 滚动到最顶部方法
            scrollToTop: function (name, flag) {
                $ionicScrollDelegate.$getByHandle(name).scrollTop(flag);
            },
            // 自定义imagePicker,安卓先检查权限
            customImagePicker:function(options,sucfunction,errfunction){
                function getPictures(){
                    // $cordovaImagePicker.getPictures(options).then(function (results) {
                    //     sucfunction(results)    
                    // }).catch(function(){
                    //     errfunction()
                    // })
                    window.imagePicker.getPictures(
                        function(results) {
                            sucfunction(results)
                        }, function (error) {
                            errfunction()
                        },options);
                }
                if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){
                    //ios 
                    getPictures();
                }else{ 
                    //android 检查权限
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
                                        getPictures();
                                    }
                                },errorCallback);
                        }else{
                            // 有权限 
                            getPictures();
                        }
                    }
                } 
            },
            saveImageToLocal:function (photoPath) {
                var pictrueUrl = encodeURI(photoPath);
                
                var success = function (msg) {
                    //下载成功
                    $ionicLoading.show({
                        template:'保存成功',
                        duration:1500
                    })
                };
                var error = function (err) {
                     //下载失败
                     $ionicLoading.show({
                        template:'保存失败',
                        duration:1500
                    })
                };
                if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){
                    //ios 
                    saveImageToPhone(photoPath, success, error);
                }else{ 
                    //android 检查权限
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
                                        saveImageToPhone(photoPath, success, error);
                                    }
                                },errorCallback());
                        }else{
                            // 有权限 
                            saveImageToPhone(photoPath, success, error);
                        }
                    }
                } 
               
                function saveImageToPhone(url, success, error) {
                  var canvas, context, imageDataUrl, imageData;
                  var img = new Image();
                  img.onload = function () {
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
                        'saveImageDataToLibrary',
                        [imageData]
                      );
                    }
                    catch (e) {
                      error(e.message);
                    }
                  };
                  try {
                    img.src = url;
                  }
                  catch (e) {
                    error(e.message);
                  }
                }
                
            },
            // 获取手机联系人
            contactManager:function(){
                var contacts;
                var options = {};
                options.filter = "";
                options.multiple = true;
                //get the phone contacts
                return $cordovaContacts.find(options);
            },
            WxPay:function(params,sucfunction,errfunction) {
                if (typeof Wechat === "undefined") {
                    $ionicLoading.show({
                        template:'尚未安装微信',
                        duration:1500
                    })
                    return false;
                }
                Wechat.isInstalled(function (installed) {
                    if(installed){
                    }else{
                        $ionicLoading.show({
                            template:'尚未安装微信',
                            duration:1500
                        })
                        return false;
                    }
                }, function (reason) {			
                });
                
                Wechat.sendPaymentRequest(params, function(suc) {
                    sucfunction(suc)
                }, function (err) {
                    errfunction(err)
                });
                return true;
            },
            AliPay:function(payInfo,sucfunction,errfunction) {
                document.addEventListener("deviceready", function () {
                    cordova.plugins.alipay.payment(payInfo,function success(suc){
                        sucfunction(suc)
                    },function error(err){
                        errfunction(err)
                    });
                }, false);
                return true;
            },
            // 微信获取unionid
            wechatUnionId:function(success,error){
                if (typeof Wechat === "undefined") {
                    $ionicLoading.show({
                        template:'尚未安装微信',
                        duration:1500
                    })
                    return false;
                }
                Wechat.isInstalled(function (installed) {
                    if(installed){
                    }else{
                        $ionicLoading.show({
                            template:'尚未安装微信',
                            duration:1500
                        })
                        return false;
                    }
                }, function (reason) {			
                });
                
                var scope = "snsapi_userinfo",
                    state = "_" + (+new Date());
                Wechat.auth(scope, state, function (response) {
                    // 第二步：通过code获取access_token   在这里就从微信返回了app，以下都是在app里进行的操作了  
                    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx60f2e980ba9c9e19&secret=abef4b4a88212285b1483d0d25e31336&code="+response.code +"&grant_type=authorization_code";  
                    $http.get(url)
                        .then(function(result){ 
                            var resultjson = result.data;  
                            var access_token = resultjson.access_token;  
                            var openid = resultjson.openid;  
                            // 第三步：通过access_token调用接口  
                            var url1 = "https://api.weixin.qq.com/sns/auth?access_token=" + access_token +"&openid="+ openid;  
                            $http.get(url1)
                                .then(function(result){  
                                    var statusResult = result.data;
                                    // 第四步：检验授权凭证（access_token）是否有效  
                                    if("ok" == statusResult.errmsg){  
                                        var url2 = "https://api.weixin.qq.com/sns/userinfo?access_token=" +access_token +"&openid="+ openid;  
                                        // 获取用户个人信息（UnionID机制）  
                                        $http.get(url2).then(function(result){  
                                            success(result.data)
                                        }).catch(function(err){
                                            error()
                                        }) 
                                    }else{  
                                        error()
                                    };  
                                }).catch(function(err){
                                    error()
                                });  
                        }).catch(function(err){
                            error()
                        })
                }, function (reason) {
                    error()
                });
            },
            // qq登录
            qqLoginAndroid:function(succes,error){
                YCQQ.checkClientInstalled(function(){
                    realLogin()
                },function(){
                    // 如果安装的QQ客户端版本太低，不支持SSO登录也会返回没有安装客户端的错误
                    $ionicLoading.show({
                        template:'尚未安装QQ',
                        duration:1500
                    })
                    return false;
                });
                function realLogin(){
                    var checkClientIsInstalled = 1;//默认值是 0,仅仅针对 iOS平台有效![]()
                    YCQQ.ssoLogin(function(args){
                            // args.access_token,args.userid;
                            succes(args)
                        },function(failReason){
                            error(failReason)
                    },checkClientIsInstalled);
                }
            },
            // qq退出登录
            qqLogoutAndroid:function(succes,error){
                YCQQ.checkClientInstalled(function(){
                    realLogin()
                },function(){
                    // '尚未安装QQ'
                    return false;
                });
                function realLogin(){
                    YCQQ.logout(function(){
                        succes();
                    },function(failReason){
                        error(failReason);
                    });
                }
            },
            // qq分享
            qqShareQQAndroid:function(args,succes,error){
                YCQQ.checkClientInstalled(function(){
                    realShare()
                },function(){
                    $ionicLoading.show({template:'尚未安装QQ',duration:1500})
                    return false;
                });
                function realShare(){
                    YCQQ.shareToQQ(function () {
                        $ionicLoading.show({template:'分享成功',duration:1500})
                        succes();
                    }, function (failReason) {
                        if(failReason=='cancelled by user'){
                            $ionicLoading.show({template:'取消分享',duration:1500})
                        }else{
                            $ionicLoading.show({template:'分享失败',duration:1500})
                        }
                        error(failReason);
                    }, args);
                }
            },
            // qq空间分享
            qqShareQzoneAndroid:function(args,succes,error){
                YCQQ.checkClientInstalled(function(){
                    realShare()
                },function(){
                    $ionicLoading.show({template:'尚未安装QQ',duration:1500})
                    return false;
                });
                function realShare(){
                    YCQQ.shareToQzone(function () {
                        $ionicLoading.show({template:'分享成功',duration:1500})
                        succes();
                    }, function (failReason) {
                        if(failReason=='cancelled by user'){
                            $ionicLoading.show({template:'取消分享',duration:1500})
                        }else{
                            $ionicLoading.show({template:'分享失败',duration:1500})
                        }
                        error(failReason);
                    }, args);
                }
            },
            // 过滤聊天内容，是否显示时间
            timeStampShow:function(msgarr,callback){
                if(msgarr.length==1){
                    msgarr[0].extras.showTime=true;
                    callback(msgarr);
                    return;
                }else if(msgarr.length==0){
                    callback(msgarr);
                    return;
                }
                var lastShowTimeStamp=msgarr[0].createTime;
                msgarr[0].extras.showTime=true;
                for(var i=1;i<msgarr.length;i++){
                    if((msgarr[i].createTime - msgarr[i-1].createTime) > 300000){
                        if('showTime' in msgarr[i].extras){
                            msgarr[i].extras.showTime=true;
                            lastShowTimeStamp=msgarr[i].createTime
                        }
                    }
                }
        
                callback(msgarr)
            },
/**
 * 商城相关
 * **/
            // 收货地址
            getReceiptAddress:function(suc,err){
                if(this.receiptAddress){
                    suc(this.receiptAddress)
                    return true
                }else{
                    var _this = this
                    $http.post($Factory.UserAddress.query.url).then(function(resData){
                        if(resData.data.length>0){
                            var copyData=JSON.parse(JSON.stringify(resData.data))

                            resData.data.filter(function(item){
                                return item.IsDefault
                            })
                            if(resData.data.length>0){
                                suc(resData.data[0])
                                _this.receiptAddress=resData.data[0]
                            }else{
                                suc(copyData[0])
                                _this.receiptAddress=copyData[0]
                            }
                        }
                    })
                }
            },
            receiptAddress:null,
            // 我的购物车
            shoppingCartList: $localStorage.shoppingCartList || [],
            shoppingCartCount: $localStorage.shoppingCartList ? $localStorage.shoppingCartList.length:0
        };

        return new Util();
    }]);