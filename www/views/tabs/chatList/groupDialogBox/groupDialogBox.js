
angular.module('App').controller('groupDialogBoxCtl', 
    function($openGroupRedpacketData,$forwardMsgData,NimUtils,appUtils,enterViewLoad,$ionicLoading,$ionicModal,$ionicActionSheet,$localStorage,$ionicSlideBoxDelegate,$scope, $rootScope, $state,$Factory,$http,$stateParams,
        $ionicScrollDelegate, $timeout) {
   
    $scope.back=function(){
        appUtils.back();
    };
    
    // 内容滚动到底部
    $scope.contentScrollBottom=function(){
        $timeout(function(){
            $ionicScrollDelegate.$getByHandle('groupdialog-message-scroll').scrollBottom();
        })
    }

    $scope.targetId=$stateParams.id
    // 表情
    $scope.emojiList=NimUtils.emojiList();
    $scope.emojiPages=[0,1,2,3,4]
        
    
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
            $ionicScrollDelegate.scrollBottom();     
        })
    }) 
    window.addEventListener('native.keyboardhide',function(e){
        $scope.keyboardShow=false
        $ionicScrollDelegate.scrollBottom(); 
    }) 
    
    //数字轮播序号
    $scope.currentIndex=0;
    $scope.changeEmojiSlide=function(){	
        $scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('groupdialog-emoji-handle').currentIndex();
    }

    
    var _getTargetInfo=function(){
        nim.getTeam({
            teamId: $scope.targetId,
            done: getTeamDone
        });
        function getTeamDone(error, obj) {
            if(!error){
                $scope.targetInfo=obj
                if(!obj.valid){
                    enterViewLoad.customload('该群已解散')
                }
            }
        }
    }

    // 获取消息
    $scope.messageList=[]
    // 有权限
    $scope.hasRight=true;
    var _getHistory=function(){
        nim.getHistoryMsgs({
            scene: 'team',
            to: $scope.targetId,
            done: getHistoryMsgsDone
        });
        function getHistoryMsgsDone(error, obj){
            if(!error) {
                $timeout(function(){
                    for(var i=0;i<obj.msgs.length;i++){
                        if(obj.msgs[i].type=='custom'){
                            if(appUtils.isJsonString(obj.msgs[i].content)) obj.msgs[i].content=JSON.parse(obj.msgs[i].content)
                        }
                    }
                    $scope.messageList=obj.msgs.reverse();
                    if($rootScope.fromStateName=='groupDetail'||$rootScope.fromStateName=='linkManDetail'){
                        return
                    }
                    $ionicScrollDelegate.scrollBottom();
                })
            }else{
                if(error.code==403){
                    enterViewLoad.customload('你已退出该群')
                    $timeout(function(){
                        $scope.back()
                    },1500)
                    // 删除该会话
                    for(var i=0;i<NimUtils.sessionList.length;i++){
                        var teamid = 'team-'+$scope.targetId
                        if(teamid == NimUtils.sessionList[i].id){
                            NimUtils.sessionList.splice(i,1)
                            $scope.hasRight=false;
                        }
                    }
                    NimUtils.sessionList = NimUtils.sessionList
                }
            }
        }
    }
    
    // 接收
    $rootScope.$on('RECEIVEMSG',function(event,msg){
        if(msg.scene=='team' && msg.to==$scope.targetId){
            if(msg.type=='custom'){
                msg.content=JSON.parse(msg.content)
            }
            $timeout(function(){
                $scope.messageList.push(msg)
                $ionicScrollDelegate.scrollBottom();
            })
        }
    })

    // 对方撤回
    $rootScope.$on('DELETEMSG',function(event,msg){
        if(msg.scene=='team' && msg.to==$scope.targetId){
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
            footerBar = document.body.querySelector('#group_dialog_box .bar-footer');
            txtInput = angular.element(footerBar.querySelector('textarea'));
        });
        $scope.myselfInfo=NimUtils.myselfInfo
        _getTargetInfo()
        _getHistory()
        // 是否静音
		nim.notifyForNewTeamMsg({
			teamIds: [$scope.targetId],
			done: notifyForNewTeamMsgDone
		})
		function notifyForNewTeamMsgDone(error,res){
			if(!error){
				$scope.isMute=res[$scope.targetId] == '1'?true:false;
			}
		}
        // 群成员account列表
        nim.getTeamMembers({
			teamId: $scope.targetId,
			done: getTeamMembersDone
		});
		function getTeamMembersDone(error, obj) {
			if (!error) {
				var _myFriendsAccount=[]
				for(var i=0;i<obj.members.length;i++){
					_myFriendsAccount.push(obj.members[i].account)
                }
				_getFriendsInfo(_myFriendsAccount)
			}
		}
    });
    // 群成员信息
    $scope.groupMembersInfo={}
	var _getFriendsInfo=function(accounts){
		if(accounts.length<=0){
			return
		}
		NimUtils.getUsers({
			accounts: accounts,
			done: getUsersDone
		});
		function getUsersDone(error,members){
            if(!error){
                // 转成对象
                members.map(function(e,i){
                    $scope.groupMembersInfo[e.account]=e;
                });
            }
		}
	} 
        
    $scope.$on('$ionicView.leave', function() {
        // 重置未读数
        if($scope.hasRight){
            nim.resetSessionUnread('team-'+$scope.targetId)
        }
        $scope.keyboardShow=false
        $scope.showEmoji=false;
        $scope.showFuncList=false;
    });
    
  
//消息发送完成  
    var sendMsgDone = function(error, msg) {
        if(!error){
            $scope.input.message=''

            $scope.messageList.push(msg)
            $ionicScrollDelegate.scrollBottom();
        }else{
            enterViewLoad.customload('发送失败')
        }
    }
// 发送文本
    $scope.input = {
        message:  ''
    };
    // 点击emoji
    $scope.chooseEmoji=function(emoji){
        $scope.input.message=$scope.input.message+emoji;
    }
    $scope.sendText=function(){
        nim.sendText({
            scene: 'team',
            to: $scope.targetId,
            text: $scope.input.message,
            done: sendMsgDone,
            needMsgReceipt:  false
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
    $('#group_dialog_box .func-wrapper').on('click','.send-image',function(){
        $(this).next().next().click()
    });
    $('#group_dialog_box .func-wrapper').on('change','#group_dialog_box_imageinput',function(){
        
        nim.sendFile({
            scene: 'team',
            to: $scope.targetId,
            type: 'image',
            fileInput: document.getElementById('group_dialog_box_imageinput'),
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
    $('#group_dialog_box .func-wrapper').on('click','.send-video',function(){
        $(this).next().next().click()
    });
    $('#group_dialog_box .func-wrapper').on('change','#groupdialog_box_videoinput',function(){
        
        nim.sendFile({
            scene: 'team',
            to: $scope.targetId,
            type: 'video',
            fileInput: document.getElementById('groupdialog_box_videoinput'),
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
    $ionicModal.fromTemplateUrl('groupdialogbox_location_modal', {
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
    $ionicModal.fromTemplateUrl('groupdialogbox_showbig_image_modal', {
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
    $ionicModal.fromTemplateUrl('groupdialogbox_delmsg_modal', {
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
                    scene: 'team',
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
    
    // 拆红包
    $ionicModal.fromTemplateUrl('groupdialogbox_openredpacket_modal', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.openredpacketModal = modal;
    });
    $scope.showRedpacketModal=function(msg,index){
        $scope.openredpacketModal.show();	
    }
    $scope.closeRedpacketModal=function(){
        $scope.openredpacketModal.hide();
    }
// tiaoshi
// $timeout(function(){

//     $scope.openredpacketModal.show();
// })

    $scope.openRedPacket=function(msg){
        $scope.redpacketInfo=msg;
        $scope.redpacketInfo.avatar = $scope.groupMembersInfo[$scope.redpacketInfo.from]&&$scope.groupMembersInfo[$scope.redpacketInfo.from].avatar?
                                        $scope.groupMembersInfo[$scope.redpacketInfo.from].avatar : ''
        
        $scope.showRedpacketModal()
    }
    $scope.realOpen=function(){
        $openGroupRedpacketData.data=$scope.redpacketInfo;
        $state.go('openGroupRedpacket')
    }
    
    // 监听渲染完成
    $scope.$on('ngRepeatFinished', function (event,data) {
		$timeout(function(){
            $scope.contentScrollBottom()
        },100)
    });
})