angular.module('App')
.directive('noctrVideoContainer', function(appUtils) {
    return {
        restrict: 'EA',
        templateUrl: 'views/publicPage/videoDirective/noCtrVideo/noCtrVideo.directive.html',
        scope: {
            source: '=',
            image:'='
        },
        link: function(scope, element) {
            // 初始化数据成员
            // 视频默认是要点击后播放的
            var video = element.find('video')[0]; // 获取视频元素
            var videoFlag = 0; // 用于检测video播放
            var videoData = scope.videoData = {};
            videoData.playing = false; // 控制是否播放中
            videoData.currentOrigin = 0; // 当前播放进度
            videoData.fullscreenStatus = false; // 当前全屏状态

            // 点击播放按钮或暂停功能
            scope.play = function(){
                if (!videoData.playing) {
                    video.autoplay = videoData.playing = true;
                    video.play();
                } else {
                    video.autoplay = videoData.playing = false;
                    video.pause();
                }
            };

            // 接收广播 暂停播放
            scope.$on('pauseVideo',function(event,datat){
                if (!videoData.playing) {
                } else {
                    video.autoplay = videoData.playing = false;
                    video.pause();
                }
            })
            // 接收广播 页面离开
            scope.$on('viewLeave',function(event,datat){
                scope.viewLeave=true
            })

            // 滑动功能实现
            scope.seeking = function() {
                video.currentTime = videoData.currentOrigin;
                videoFlag = 0;
            };

            // 打开全屏
            scope.openFullscreen=function(){
                videoData.fullscreenStatus = true; 
                scope.$emit('changeFullscreenStatus', true); // 发送广播, 打开全屏
            };
            // 关闭全屏
            scope.closeFullscreen=function(){
                videoData.fullscreenStatus = false; 
                scope.$emit('changeFullscreenStatus', false); // 发送广播, 关闭全屏
            };
            scope.$on('closeFullscreenStatus',function(event,data){
                videoData.fullscreenStatus = false; 
            })

            // 事件监听
            // 开始播放 , 初始化所有数据
            ionic.EventController.on('loadstart', function() {
                videoData.playing = this.autoplay = false; // 默认是播放状态，同loading
                videoData.isLoading = true; // 开始loading
                scope.$emit('videoIsLoading', true); // 发送广播, 视频加载中
                scope.$apply();
            }, video);

            // 元数据加载完成后 此时获取时长
            ionic.EventController.on('loadedmetadata', function() {
                appUtils.checkToGetMediaDuration(scope, video, videoData);
                videoFlag = 0; // 此处归零 表示视频
                this.autoplay = videoData.isLoading = false; // 为了兼容
                scope.$emit('videoIsLoading', false); // 发送广播, 视频加载完
//视频加载完 自动播放    
                if(!scope.viewLeave){
                    scope.play()
                }
                scope.$apply();
            }, video);

            ionic.EventController.on('durationchange', function() {
                appUtils.checkToGetMediaDuration(scope, video, videoData);
                this.autoplay = true; // 为了兼容
                scope.$apply();
            }, video);

            // onprogress 正在下载中
            ionic.EventController.on('progress', function() {
                appUtils.checkToGetMediaDuration(scope, video, videoData);
                scope.$apply();
            }, video);

            // waiting
            ionic.EventController.on('waiting', function() {
                videoData.isLoading = this.autoplay = true; // 为了兼容 true; // 无法继续播放时loading
                scope.$emit('videoIsLoading', true); // 发送广播, 视频加载中
                videoData.playing = true; // 同样保持播放状态
                scope.$apply();
            }, video);

            // seeking
            ionic.EventController.on('seeking', function() {
                videoData.isLoading = videoData.playing = this.autoplay = true; // 为了兼容 = true ;  seeking 保持播放状态
                scope.$emit('videoIsLoading', true); // 发送广播, 视频加载中
                this.play(); // 强制播放
                scope.$apply();
            }, video);

            // 在可播放时 只会触发一次 , 播放按钮状态 : 可播放
            ionic.EventController.on('playing', function() {
                appUtils.checkToGetMediaDuration(scope, video, videoData);
                this.autoplay = videoData.isLoading = true; // 为了兼容 此处 loading 应为 false ,但安卓低端机器存在问题
                scope.$emit('videoIsLoading', true); // 发送广播, 视频加载中
                scope.$apply();
            }, video);

            // 监听暂停事件
            ionic.EventController.on('pause', function() {
                videoData.playing = videoData.isLoading = false;
                scope.$emit('videoIsLoading', false); // 发送广播, 视频加载完
                scope.$apply();
            }, video);

            // 音频播放位置发生改变时触发

            /* 设置为自动隐藏  */
            ionic.EventController.on('timeupdate', function() {
                appUtils.checkToGetMediaDuration(scope, video, videoData);
                videoData.currentOrigin = video.currentTime; // 获取视频当前时间
                videoData.current = appUtils.handlePlayingTime(video.currentTime); // 获取格式转换之后的视频当前时间

                if (videoFlag >= 1) { // timeupdate 时,开始播放 兼容问题
                    videoData.isLoading = false;
                    scope.$emit('videoIsLoading', false); // 发送广播, 视频加载完
                    videoData.playing = true; // 播放按钮呈现
                }

                if (videoFlag === 15) {
                    scope.$emit('videoBarHide', 1); // 发送广播, 隐藏bar
                    videoData.hide = true;
                }

                videoFlag++;
                scope.$apply();
            }, video);

            // 触摸取消隐藏
            ionic.EventController.on('touchstart', function() {
                if(videoData.hide){
                    scope.$emit('videoBarShow', 1); // 发送广播, 显示bar
                }else{
                    scope.$emit('videoBarHide', 1); // 发送广播, 隐藏bar
                }
                videoData.hide = !videoData.hide;
                videoFlag = 0;
            }, video);

            // 视频可以流畅播放到结束
            ionic.EventController.on('canplaythrough', function() {}, video);

            // 视频可以流畅播放(缓冲已足够开始时)
            ionic.EventController.on('canplay', function() {}, video);

            // 播放完成
            ionic.EventController.on('ended', function() {
                this.pause();
                scope.hide = false; // 显示
                scope.$apply();
                scope.$emit('videoBarShow', 1); // 发送广播, 隐藏bar
                videoData.hide = false;
            }, video);
        }
    };
});