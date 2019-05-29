// 添加 translateY(-50%) 移除 bar-footer图片居中显示
;(function(window, angular, undefined) {
    // 'use strict';
    var img = angular.module('ng-img', []);
  
    img.run(['$templateCache', function($templateCache) {
      $templateCache.put('ng-img-slide-large.html',
        '<div class="action-img-backdrop active" ng-click="imgClose()">'+
            '<div class="img-sheet-wrapper large-img-group">'+
                '<ion-slide-box class="img-slide-box" show-pager="false" active-slide="imgActiveSlide" delegate-handle="slide-imgs-large" on-slide-changed="slideImgChange($index)">'+
                '<ion-slide class="img-slide" on-hold="saveImage()" img-show ng-repeat="largeImg in larImgs">'+
                '</ion-slide>'+ 
                '</ion-slide-box>'+
            '</div>'+
            // '<div class="bar bar-footer img-bar-footer">'+
            //     '<div class="row">'+
            //       '<div class="col" style="color:#ffffff">{{currentLargeImg}}/{{::imgsNum}}</div>'+
            //       '<div class="col"></div>'+
            //       '<div class="col"></div>'+
            //       '<div class="col" style="color:#ffffff"></div>'+
            //     '</div>'+
            // '</div>'+             
        '</div>'
      );
             
    }]);
  
    img.directive('imgShow',['$compile','$timeout','$ionicGesture',function($compile, $timeout, $ionicGesture) {
      return {
        restrict: 'EA',
        transclude: true,
        replace: false,
        scope:false,
        link:function($scope,$element,$attrs) {
          if($scope.largeImg.imgsrc != undefined) {
            angular.element($element).append('<img ng-click="saveImage('+$scope.largeImg.imgsrc+')" src='+$scope.largeImg.imgsrc+'>').css({
              "background-color":"rgba(5, 5, 5, 5.96)"
            });
          }else {
            angular.element($element).append($scope.largeImg).css({
              "background-color":"rgba(5, 5, 5, 5.96)"
            });
          }
  
          var this_img = angular.element($element).find('img').css({
              "transform-origin":"50% 50%",
              "-webkit-transform": "scale(1,1) translateY(-50%)",
              "transform":"scale(1,1) translateY(-50%)",
              "transition": "all 100ms linear",
          });
  
          var this_imgbar = angular.element(document.querySelector('div.img-bar-footer')).css({
              'height':"20%",
              'background-color':"rgb(5, 5, 5)",
              "background-size":'100% 0'
          });
   
          /**
          *创建一个hammer对象
          */


    // var hammer = new Hammer($element[0].querySelector('img'));
    //     hammer.get('pinch').set({ enable: true });
    //     hammer.add(new Hammer.Pinch());
    // /**
    // *捏开点监听
    // */
    var initScale = 1,
        // 缩放中心点
        pinchX    = 0,
        pinchY    = 0;

    // hammer.on("pinchstart",function (e) {
    //   // 缩放中心点
    //   pinchX = e.center.x;
    //   pinchY = e.center.y;

    //   this_img.css({
    //       "transform-origin": +pinchX+'px'+' '+pinchY+'px',
    //   });

    // });

    // hammer.on("pinchout", function (e) {
    //     var scale = e.scale.toFixed(2) * initScale;
    //     /**
    //     *放大动画
    //     */
    //     this_img.css({
    //       "-webkit-transform": "scale("+scale+","+scale+") translateY(-50%)",
    //       "transform": "scale("+scale+","+scale+") translateY(-50%)",
    //       "transition": "all 100ms linear",
    //     });
        
    //     // 设置footer透明度等于0.2
    //     this_imgbar.css({
    //       "opacity": "0.2",
    //     });
        
    // });

    // hammer.on("pinchend", function (e) {
    //   initScale = e.scale.toFixed(2) * initScale;
        
    // });
    
    // /**
    // *捏合缩小，回弹原来大小
    // */
    // hammer.on("pinchin", function (e) {

    //     var scale = e.scale.toFixed(2) * initScale;

    //     if(scale <= 0.8) {
    //       this_img.css({
    //         "transform-origin": "50% 50%",
    //         "-webkit-transform": "scale(0.8,0.8) translateY(-50%)",
    //         "transform": "scale(0.8,0.8) translateY(-50%)",
    //         "transition": "all 200ms linear",
    //       });

    //       initScale = 0.8;

    //     }else {
    //       this_img.css({
    //         "transform-origin": "50% 50%",
    //         "-webkit-transform": "scale("+scale+","+scale+") translateY(-50%)",
    //         "transform": "scale("+scale+","+scale+") translateY(-50%)",
    //         "transition": "all 200ms linear",
    //       });

    //       initScale = scale;
    //     }
    //     // 设置footer不透明
    //     this_imgbar.css({
    //       "opacity":"1",
    //     });
    // });

  
          /**
          *左滑动事件
          *图片恢复缩放
          */
          var swipeleftFn = function(evt) {
              if(initScale >1) {
                this_img.css({
                  "transform-origin":"50% 50%",
                  "-webkit-transform": "scale(1,1) translateY(-50%)",
                  "transform": "scale(1,1) translateY(-50%)",
                  "transition": "all 100ms linear",
                });
                initScale = 1;
              }
  
            };
          var swipeleft = $ionicGesture.on('swipeleft', swipeleftFn, this_img);
  
          /**
          *右滑动事件
          *图片恢复缩放
          */
          var swiperightFn = function() { 
                if(initScale >1) {
                  this_img.css({
                    "transform-origin":"50% 50%",
                    "-webkit-transform": "scale(1,1) translateY(-50%)",
                    "transform":"scale(1,1) translateY(-50%)",
                    "transition": "all 100ms linear",
                  });
                  initScale = 1;
              }
            };
  
          var swiperight = $ionicGesture.on('swiperight', swiperightFn, this_img);
  
          // 销毁作用域时解绑手势事件
          $scope.$on("$destroy", function() {
              $ionicGesture.off(swipeleft, 'swipeleft', swipeleftFn);
              $ionicGesture.off(swiperight, 'swiperight', swiperightFn);
              $scope.$destroy();
          });
          
        }
      }
    }]);
  
    img.directive('imgSlideLarge', ['$rootScope','$timeout', function($rootScope, $timeout) {
      return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
          larImgs: '=',
          currentImg: '@',
          imgClose: '&',
        },
        templateUrl: function(element, attrs) {
          return attrs.templateUrl || 'ng-img-slide-large.html';
        },
        controller: ['$scope', '$attrs','$timeout','$ionicActionSheet','$ionicLoading','$ionicPlatform', function($scope, $attrs, $timeout, $ionicActionSheet,$ionicLoading, $ionicPlatform) {
          if($scope.currentImg != undefined)  {
           
            $scope.imgActiveSlide = $scope.currentImg;
            $scope.currentLargeImg = parseInt($scope.currentImg) + 1; 
          }
  
          // slide的总个数
          $scope.imgsNum = $scope.larImgs.length;
  
          $scope.slideImgChange = function($index) {
            $scope.currentLargeImg = $index+1;
          }
          
          // 保存图片
          $scope.saveImage=function(){
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                  { text: '保存图片' },
                ],
                cancelText: '取消',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index){
                  try{
                    var photoPath = $scope.larImgs[$scope.currentLargeImg].src;
                    var pictrueUrl = encodeURI(photoPath);

                    function success(msg) {
                      //下载成功
                      $ionicLoading.show({
                          template:'保存成功',
                          duration:1500
                      })
                    };
                    function error(err) {
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
                        }catch (e) {
                          error(e.message);
                        }
                      };
                      try {
                        img.src = url;
                      }catch (e) {
                        error(e.message);
                      }
                    }
                  }catch(e){
                    alert(JSON.stringify(e))
                  }
                  
            
                  return true;
                }
              });
          }
        }],
      };
    }]);
   
  })(window, angular);