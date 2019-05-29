angular.module('App')
//监听Dom是否渲染完毕
.directive('onFinishRenderFilters',['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
}])
// slide-box只有两条
.directive('repeatDone', function () {
    return function (scope, element, attrs) {
      if (scope.$last) { // all are rendered
        scope.$eval(attrs.repeatDone);
      }
    }
 })
//  焦点图放大
.directive('carouselSlider', function ($compile, $timeout,$rootScope) {
  return {
    restrict: 'A',
    scope: {
      volList: '=',
      charShow: '='
    },
    template: '<div class="slider-wrap"></div>',
    link: function (scope) {
      // 用于挂载在外部的变量, 用于处理屏幕变化的变量
      scope.outWatcher = {};

      // 所有设置函数
      function setUp() {
        // 针对宽高比的判断
        // 进行轮播图的 dom 生成操作
        var $ = angular.element; // jqLite 对象
        var slideBox = scope.outWatcher.slideBox = document.querySelector('.slider-wrap'); // 获取轮播盒子对象
        var sliderInner = scope.outWatcher.sliderInner = document.createElement('ul');
        sliderInner.className = 'slider-wrap-inner';
        slideBox.appendChild(sliderInner);

        // 杂志点击的回调 可用于其他逻辑处理
        scope.magClick = function (title) {
          console.log(title);
        };
        

        // 缩放的动画
        function scale(obj, rate) {
          if (!obj) return;
          obj.style.transform = "scale(" + rate + ")";
          obj.style.webkitTransform = "scale(" + rate + ")";
        }

        // 获取数据
        function getData(list, callback) {
          // 通过获得的数据,生成节点操作
          for (var i = 0; i < list.length; i++) {
            var li = document.createElement('li');
            var img = document.createElement('img');
            var imgWrap = document.createElement('div');
            imgWrap.className = 'img-wrap';
            // img.src = '';
            // 首先先加载前三张图片的地址,其他的作懒加载处理
            if (i < 6) {
              img.setAttribute('src', list[i].coverimg);
              // img.setAttribute('style', 'background-image:url(' + list[i].coverimg + ')');
            }
            imgWrap.appendChild(img);
            li.appendChild(imgWrap);
            li.setAttribute('on-tap', 'magClick("' + list[i].index+ '")'); // 绑定事件
            $(sliderInner).append($(li));
          }
          var htmlObj = $compile($(sliderInner).html())(scope); // 对html 进行重新编译
          $(sliderInner).html(''); // 清空
          $(sliderInner).append(htmlObj); // 追加
          var lis = sliderInner.querySelectorAll('li'); // 得到当前的所有li对象
          var imgs = scope.outWatcher.imgs = []; // 用于存放图像包裹节点
          // 图像包裹节点数组, 初始化样式
          for (var k = 0; k < lis.length; k++) {
            if (!k) {
              imgs.push(lis[0].querySelector('.img-wrap')); // 第一个只 push 进去 ,不 设置样式
              continue;
            }
            var item = lis[k].querySelector('.img-wrap');
            scale(item, 252 / 291); // 样式初始化缩放
            // scale(item, 0.9); // 样式初始化缩放
            imgs.push(item); // 并push
          }
          callback && angular.isFunction(callback) && callback(imgs, list); // 将数据通过callback带走
        }

        scope.magClick=function (params) {
          scope.$emit('vipImgClickIndex', params);
        }
        // 针对杂志切换,数据同时切换
        scope.$watch('volList', function (now) {
          if (now && now.length) {
            sliderInner.innerHTML = ''; 
            // 使用$timeout来解决宽度问题,重新渲染dom.
            $timeout(function(){
              getData(now, function (imgs, now) {
                var m = new MobileMove(); // 重新new
                // slideBox包裹容器, sliderInner ul 
                m.setSwipe(slideBox, sliderInner, imgs, now,function(index){
                  scope.$emit('scaleImgIndexChanged', index);
                });
              });
            });
          }
        });     
      }

      function debounce(fn,wait) {
        var timer=null
        return function(){
          var context = this
          var args = arguments
          if (timer) {
              clearTimeout(timer);
              timer = null;
          }
          timer = setTimeout(function () {
              fn.apply(context, args)
          }, wait)
        }
      }
      // 监听屏幕变化事件, 随时构造对象
      window.onresize = function() {
        var m = new MobileMove(); // 重新new
        m.setSwipe(scope.outWatcher.slideBox, scope.outWatcher.sliderInner, scope.outWatcher.imgs, scope.volList,function(index){
          scope.$emit('scaleImgIndexChanged', index);
        });
      }

      // 页面加载完成后执行
      var contentLoaded = scope.$watch('$viewContentLoaded', function() {
        setUp(); // 全面设置
        contentLoaded(); // 取消 watch
      });
    }
  };
})
// 聊天输入框
.directive('resizeFootBar', ['$ionicScrollDelegate','$timeout', function($ionicScrollDelegate,$timeout){
  // Runs during compile
  return {
      replace: false,
      link: function(scope, iElm, iAttrs, controller) {
          // 模态框弹出会误触发 换成监听elastic:resize
          // scope.$on("taResize", function(e, ta) {
          //     if (!ta) return;
          //     var scroll = document.body.querySelector("#message-detail-content");
          //     var scrollBar = $ionicScrollDelegate.$getByHandle('dialog-message-scroll');
              
          //     var taHeight = ta[0].offsetHeight;
          //     var newFooterHeight = taHeight + 10;
          //     console.log(ta[0])
          //     console.log(newFooterHeight)
          //     newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

          //     iElm[0].style.height = newFooterHeight + 'px';
          //     scroll.style.bottom = newFooterHeight + 'px';
          //     scrollBar.scrollBottom();
          // });
          scope.$on('elastic:resize', function(event, ta, oldHeight, newHeight) {
              if (!ta) return;
              $timeout(function(){
                var scroll = document.body.querySelector("#message-detail-content");
                var scrollBar = $ionicScrollDelegate.$getByHandle('dialog-message-scroll');
                
                var taHeight = ta[0].offsetHeight;
                var newFooterHeight = taHeight + 10;
               
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                iElm[0].style.height = newFooterHeight + 'px';
                scroll.style.bottom = newFooterHeight + 'px';
                scrollBar.scrollBottom();

              })
          });
      }
  };
}])
.directive('resizeGroupfootBar', ['$ionicScrollDelegate','$timeout', function($ionicScrollDelegate,$timeout){
  // Runs during compile
  return {
      replace: false,
      link: function(scope, iElm, iAttrs, controller) {
          scope.$on('elastic:resize', function(event, ta, oldHeight, newHeight) {
              if (!ta) return;
              $timeout(function(){
                var scroll = document.body.querySelector("#groupmessage-detail-content");
                var scrollBar = $ionicScrollDelegate.$getByHandle('groupdialog-message-scroll');
                
                var taHeight = ta[0].offsetHeight;
                var newFooterHeight = taHeight + 10;
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                iElm[0].style.height = newFooterHeight + 'px';
                scroll.style.bottom = newFooterHeight + 'px';
                scrollBar.scrollBottom();
              });
          });
      }
  };
}])
// 聊天链接 先引入autolinker.min.js
.directive('autolinker', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    var eleHtml = element.html();

                    if (eleHtml === '') {
                        return false;
                    }

                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });

                    element.html(text);

                    var autolinks = element[0].getElementsByClassName('autolinker');

                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function(e) {
                            var href = e.target.href;

                            if (href) {
                                window.open(href, '_blank');
                            }

                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);
            }
        }
    }
])
.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element){
      if(/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)){

      }else{
        // 安卓自动聚焦
        $timeout(function() {
          $element[0].focus();
        });
      }
    }
  }
}])