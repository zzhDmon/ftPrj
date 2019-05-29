angular.module('App').controller('dialogBoxCtl', 
    function($forwardMsgData,NimUtils,appUtils,enterViewLoad,$sce,$ionicLoading,$ionicModal,$localStorage,$ionicSlideBoxDelegate,$ionicActionSheet,$scope, $rootScope, $state,$Factory,$http, $stateParams,
        $ionicScrollDelegate,$timeout){
    $scope.back=function(){
        appUtils.back();
    };
   
    // 内容滚动到底部
    $scope.contentScrollBottom=function(){
        $timeout(function(){
            $ionicScrollDelegate.$getByHandle('dialog-message-scroll').scrollBottom();
        })
    }
    $scope.targetId=$stateParams.id
    // 表情
    $scope.emojiList=NimUtils.emojiList();
    $scope.emojiPages=[0,1,2,3,4]
    
    
    // 点击房源申请
    $scope.clickCustomMsg=function(userid,houseid){
        if(userid==$localStorage.myselfInfo.Id){
            return
        }
        $state.go('agencyAgreementCheck',{userid:userid,houseid:houseid})
    }
    
    
    $scope.keyboardShow=false
    $scope.showEmoji=false;
    $scope.showFuncList=false;
    $scope.openEmoji=function(){
        $scope.showEmoji=true;
        $scope.showFuncList=false;
        keepKeyboardOpen();
        $scope.contentScrollBottom()
    }
    $scope.openFuncList=function(){
        $scope.showFuncList=true;
        $scope.showEmoji=false;
        keepKeyboardOpen();
        $scope.contentScrollBottom()
    }
    $scope.openKeyboard=function(){
        $scope.showEmoji=false;
        $scope.showFuncList=false;
        $scope.contentScrollBottom()
    }
    window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
            // 软键盘高度
            if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
                $scope.keyboardHeight=e.keyboardHeight
            }
            $scope.keyboardShow=true
            $scope.showEmoji=false;
            $scope.showFuncList=false;   
            $scope.contentScrollBottom() 
        })
    }) 
    window.addEventListener('native.keyboardhide',function(e){
        $scope.keyboardShow=false
        $scope.contentScrollBottom()
    })
    
    //数字轮播序号
    $scope.currentIndex=0;
    $scope.changeEmojiSlide=function(){	
        $scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('dialog-emoji-handle').currentIndex();
    }
    
    // 添加好友
    $scope.addFriend=function(account){
        NimUtils.addFriend(account,function(){
            enterViewLoad.customload('发送好友申请成功')
        },function(){
            enterViewLoad.customload('发送好友申请失败')
        })
    }
    // 对方信息
    var _getTargetInfo=function(){
        nim.getUser({
            account: $scope.targetId,
            done: getUserDone,
            sync:true
        });
        function getUserDone(error, user){
            if (!error) {
                $timeout(function(){
                    $scope.targetInfo=user
                    $scope.targetInfo=angular.extend({
                        isFriend : NimUtils.isFriend($scope.targetId)
                    },$scope.targetInfo)
                })
            }
        }
    }



    // 获取消息
    $scope.messageList=[]
    var _getHistory=function(){
        nim.getHistoryMsgs({
            scene: 'p2p',
            to: $scope.targetId,
            done: getHistoryMsgsDone
        });
        function getHistoryMsgsDone(error, obj) {
            if (!error) {
                for(var i=0;i<obj.msgs.length;i++){
                    if(obj.msgs[i].type=='custom'){
                        if(appUtils.isJsonString(obj.msgs[i].content)) obj.msgs[i].content=JSON.parse(obj.msgs[i].content)
                    }
                    if(obj.msgs[i].type=='video'){
                        // console.log(obj.msgs[i].file.url)
                        // obj.msgs[i].file.url = $sce.trustAsResourceUrl(obj.msgs[i].file.url)
                    }
                }
                $scope.messageList=obj.msgs.reverse()
                $timeout(function(){
                    if($rootScope.fromStateName=='dialogVideoPlayer'||$rootScope.fromStateName=='linkManDetail'){
                        return
                    }
                    $scope.contentScrollBottom()
                })
            }
        }
    }

    // 接收消息
    $rootScope.$on('RECEIVEMSG',function(event,msg){
        if(msg.scene=='p2p' && msg.from==$scope.targetId){
            if(msg.type=='custom'){
                msg.content=JSON.parse(msg.content)
            }
            $timeout(function(){
                $scope.messageList.push(msg)
                $scope.contentScrollBottom()
            })
        }
    })
    // 对方撤回
    $rootScope.$on('DELETEMSG',function(event,msg){
        if(msg.scene=='p2p' && msg.from==$scope.targetId){
            for(var i=0;i<$scope.messageList.length;i++){
                if($scope.messageList[i].idServer==msg.idServer){
                    $scope.messageList.splice(i,1)
                }
            }
        }
    })

    var footerBar;
    var txtInput; 
    $scope.$on('$ionicView.enter', function() {
        
        $timeout(function() {
            footerBar = document.body.querySelector('#dialog_box .bar-footer');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        }, 0);

        _getHistory()
        _getTargetInfo()
        $scope.myselfInfo=NimUtils.myselfInfo
    });
    
    $scope.$on('$ionicView.leave', function() {
        // 重置未读数
        nim.resetSessionUnread('p2p-'+$scope.targetId)
        $scope.keyboardShow=false
        $scope.showEmoji=false;
        $scope.showFuncList=false;
    });
    
    // 点击播放语音
    $scope.playAudio=function(src){
        if (!$scope.currentAudio) {
            $scope.currentAudio = new Audio(src);
            $scope.currentAudio.play();
            $scope.currentAudio.onended = function(){
                $scope.currentAudio = null;
            };
        }
    }
// 消息发送完成  
    var sendMsgDone = function(error, msg) {
        if(!error){
            $scope.input.message=''
            if(msg.type=='custom'){
                msg.content=JSON.parse(msg.content)
            }
            $scope.messageList.push(msg)
            $scope.contentScrollBottom()
        }else{
            enterViewLoad.customload('发送失败')
        }
    }

//发送文本
    $scope.input = {
        message:  ''
    };
    // 点击emoji
    $scope.chooseEmoji=function(emoji){
        $scope.input.message=$scope.input.message+emoji;
    }
    $scope.sendText=function(){
        nim.sendText({
            scene: 'p2p',
            to: $scope.targetId,
            text: $scope.input.message,
            done: sendMsgDone,
            needMsgReceipt: false
        })
        // 保持软键盘打开
        keepKeyboardOpen()
    }
    // 保持软键盘打开
    function keepKeyboardOpen() {
        txtInput.on('blur', function() {
            if(!$scope.showEmoji&&!$scope.showFuncList){
                txtInput[0].focus();
            }else{
                txtInput[0].blur();
            }
        });
    }
// 发送图片
    $('#dialog_box .func-wrapper').on('click','.send-image',function(){
        $(this).next().next().click()
    });
    $('#dialog_box .func-wrapper').on('change','#dialog_box_imageinput',function(){
        
        nim.sendFile({
            scene: 'p2p',
            to: $scope.targetId,
            type: 'image',
            fileInput: document.getElementById('dialog_box_imageinput'),
            beginupload: function(upload) {
                // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
                // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
            },
            uploadprogress: function(obj) {
                // 上传进度
                $ionicLoading.show({
                    template: obj.percentageText
                });
            },
            uploaddone: function(error, file) {
                // 上传完成
                if(error){
                    enterViewLoad.customload('文件上传失败')
                }else{
                    $ionicLoading.hide()
                }
            },
            beforesend: function(msg){
                // 正在发送p2p 
            },
            done: sendMsgDone
        });
    })
// 发送视频
    $('#dialog_box .func-wrapper').on('click','.send-video',function(){
        $(this).next().next().click()
    });
    $('#dialog_box .func-wrapper').on('change','#dialog_box_videoinput',function(){
        nim.sendFile({
            scene: 'p2p',
            to: $scope.targetId,
            type: 'video',
            fileInput: document.getElementById('dialog_box_videoinput'),
            beginupload: function(upload) {
                // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
                // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
            },
            uploadprogress: function(obj) {
                // 上传进度
                $ionicLoading.show({
                    template: obj.percentageText
                });
            },
            uploaddone: function(error, file) {
                // 上传完成
                if(error){
                    enterViewLoad.customload('文件上传失败')
                }else{
                    $ionicLoading.hide()
                }
            },
            beforesend: function(msg){
                // 正在发送p2p 
            },
            done: sendMsgDone
        });
    })

//发送地理位置
    $ionicModal.fromTemplateUrl('dialogbox_location_modal', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.locationModal = modal;
    });
    $scope.showLocationModal=function(){
        $scope.locationModal.show();	
    }
    $scope.closeLocationModal=function(){
        $scope.locationModal.hide();
    }
    
// 大图  
    $ionicModal.fromTemplateUrl('dialogbox_showbig_image_modal', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.bigImageModal = modal;
    });
    $scope.showBigImageModal=function(src){
        $scope.showBigImage=src;
        $scope.bigImageModal.show();
    }
    $scope.closeBigImageModal=function(){
        $scope.bigImageModal.hide();
    }
//消息撤回
    $ionicModal.fromTemplateUrl('dialogbox_delmsg_modal', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.delmsgModal = modal;
    });
    $scope.showDelmsgModal=function(msg,index){
        if(msg.type==='text' || msg.type==='image' || 
            msg.type==='video' || msg.type==='geo'){
            // 图 文 视频 地理位置可以撤回转发
            $scope.delmsgModal.show();	
            $scope.chooseMsgItem=msg;
            $scope.chooseMsgIndex=index
        }
    }
    $scope.closeDelmsgModal=function(){
        $scope.delmsgModal.hide();
    }
    // 撤回
    $scope.deleteMsg=function(){
        nim.deleteMsg({
            msg: $scope.chooseMsgItem,
            done: deleteMsgDone
        })         
        function deleteMsgDone (error) {
            if(!error){
                $scope.messageList.splice($scope.chooseMsgIndex,1)
                // 提醒消息
                nim.sendTipMsg({
                    scene: 'p2p',
                    to: $scope.targetId,
                    tip: '撤回了一条消息',
                    done: sendMsgDone
                });
            }else{
                if(error.code==508){
                    enterViewLoad.customload('超出撤回时间')
                }
            }
        }
    }

    // 转发
    $scope.forwardMsg=function(){
        $forwardMsgData.data=$scope.chooseMsgItem
        $state.go('forwardMsg')
    }
    // 复制文字
    $scope.copyMsg=function(){
        document.addEventListener("deviceready", function () {
            cordova.plugins.clipboard.copy($scope.chooseMsgItem.text);
        }, false);
    }
    
    // 保存图片
    $scope.saveImage=function(image){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '保存图片' },
            ],
            cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index){
                appUtils.saveImageToLocal(image)
                return true;
            }
        });
      
    }

    $scope.$on('ngRepeatFinished', function (event,data){
        $timeout(function(){
            $scope.contentScrollBottom()
        },100)
    });
})

