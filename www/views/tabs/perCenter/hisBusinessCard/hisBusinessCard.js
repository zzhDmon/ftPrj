
angular.module('App').controller('hisBusinessCardCtl',function($hisBusinessCardData,appUtils,enterViewLoad,actionImgShow,$localStorage,$ionicModal,$ionicScrollDelegate,$http,$Factory,$scope,$stateParams,$timeout){
	$scope.back=function(){
		appUtils.back();
    }

    $scope.$on('$ionicView.enter',function(){
        if($hisBusinessCardData.slide){
            $scope.mySwiper.slideTo(4, 500, false)
            $scope.swiperActiveIndex=4
        }
    })
    $scope.$on('$ionicView.leave',function(){
        $hisBusinessCardData.slide=null;
    })
    // 头部背景色
    $scope.currentBG='rgba(17,17,17,0)';
    $scope.swiperActiveIndex=0
    $scope.mySwiper = new Swiper('.hisbusinesscard-swiper-container', {
		direction : 'vertical',
		noSwiping: true,
		noSwipingClass : 'stop-swiping',
		on:{
			slideChangeTransitionStart: function(){
				
			},
			slideChangeTransitionEnd: function(){
                $scope.swiperActiveIndex=this.activeIndex;
                if(this.activeIndex==0){
                    $timeout(function(){
                        $scope.currentBG='rgba(17,17,17,0)';
					})
				}else{
					$timeout(function(){
                        $scope.currentBG='rgba(17,17,17,1)';
                    })
				}
            },
		},
    })

    
    // 动态文章滚动监听
    $scope.delegate = $ionicScrollDelegate.$getByHandle('his-business-card-Scroll');
	$scope.hisBusinessCardListen=function(){
		try{
            $scope.contentScrollTop = $scope.delegate.getScrollPosition().top;
        }catch(e){}
	}
    // 上下滑切换
	$scope.swipeUp=function(){
        $scope.mySwiper.slideNext();
	}
	$scope.swipeDown=function(){
		if((!$scope.contentScrollTop || $scope.contentScrollTop<0) && !$scope.stopSlide){
			$scope.mySwiper.slidePrev();
		}
	}
    
    
    
    $scope.paramsData={
        id:$stateParams.id
    }
    // 文章动态切换
	$ionicModal.fromTemplateUrl('hisbusiness_switch_modal', {
		scope: $scope,
		animation: 'slide-in-down'
	}).then(function(modal) {
		$scope.switchModal = modal;
	});
	$scope.showSwitchModal=function(){
		$scope.switchModal.show();	
	}
	$scope.closeSwitchModal=function(){
		$scope.switchModal.hide();
	}
	
	$scope.switchItem='timeline'
    $scope.switchItemTo=function(item){
		$scope.switchItem=item;
		$scope.delegate.resize();
    }
    // 初始数据
    $scope.initData=function(){
        $scope.myselfInfo=$localStorage.myselfInfo

        $http.post($Factory.Zone.home.url+'?uid='+$scope.paramsData.id,{
            type:0
        }).then(function(resData){
            for(var i=0;i<resData.data.length;i++){
                if(resData.data[i].Type==10){
                    $scope.dynamicData=resData.data[i].List.filter(function(item){
                        if(appUtils.isJsonString(item.Content)){
                            item.Content=JSON.parse(item.Content)
                        }else{
                            item.Content={}
                        }
                        if($scope.myselfInfo){
                            item.agreed = item.AgressUsers.indexOf($scope.myselfInfo.Id+'')>=0 ? true:false;
                        }else{
                            item.agreed = false
                        }
                        item.showCom = false
                        return item
                    })
                }else if(resData.data[i].Type==20){
                    $scope.imagesData=resData.data[i].List
                }else if(resData.data[i].Type==21){
                    $scope.albumList=resData.data[i].List.filter(function(item){
                        if(item.Content){
                            item.Content=item.Content.split('|')
                        }else{
                            item.Content=[]
                        }
                        return item
                    })
                }else if(resData.data[i].Type==30){
                    $scope.videosData=resData.data[i].List.filter(function(item){
                        if(appUtils.isJsonString(item.Content)){
                            item.Content=JSON.parse(item.Content)
                        }else{
                            item.Content={}
                        }
                        return item
                    })
                }else if(resData.data[i].Type==31){
                    $scope.vcrData=resData.data[i].List.filter(function(item){
                        if(appUtils.isJsonString(item.Content)){
                            item.Content=JSON.parse(item.Content)
                        }else{
                            item.Content={}
                        }
                        return item
                    })
                }else if(resData.data[i].Type==40){
                    if(resData.data[i].List.length){
                        $scope.articleData=resData.data[i].List.filter(function(item){
                            if(appUtils.isJsonString(item.ShowInList)) item.ShowInList=JSON.parse(item.ShowInList)
                            return item
                        })
                    }else{
                        $scope.articleData=[]
                    }
                }else if(resData.data[i].Type==60){
                    if(resData.data[i].List.length>0){
                        if(appUtils.isJsonString(resData.data[i].List[0].Content)){
                            $scope.honorImageUrl=JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
                        }
                        $scope.honorImageId=resData.data[i].List[0].Id
                    }
                }else if(resData.data[i].Type==50){
                    if(resData.data[i].List.length>0){
                        var time_now = new Date().getTime()
                        if(appUtils.isJsonString(resData.data[i].List[0].Content)){
                            $scope.posterImageUrl=JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
                        }
                        $scope.posterImageId=resData.data[i].List[0].Id
                    }
                }
            }
        }).catch(function(){
            enterViewLoad.customload('加载数据失败')
        })
    }
    $scope.initData()

    // 点击查看大图
	$scope.showBigImg=function(parImgs,$index){
		var arrImgs = new Array();
		for(var i=0; i<parImgs.length; i++) {
			var img = new Image();
			img.src = parImgs[i];
			img.onload = function(i) {
				arrImgs[i] = img;
			}(i);
		}
		actionImgShow.show({
			"larImgs": arrImgs, 
			"currentImg": $index,
			imgClose : function() {
				actionImgShow.close();
			}
		})
	}
    
//    点赞
    $scope.agreeTl=function(item){
        $http.post($Factory.Zone.agree.url+'?id=' + item.Id)
            .then(function(res){
                item.agreed=true;
                enterViewLoad.customload('点赞成功');
            }).catch(function(){
                enterViewLoad.customload('点赞失败');
            })
    }
// 回复
    $scope.replyData={
        data:''
    }
    $scope.clickComment=function(item){
        // $('#his_business_card_reply')[0].focus(); 
        $scope.showBotReply= $scope.showBotReply?false:true;
        $scope.replyTo=item
    }
    $scope.replyComment=function(){
        if(!$scope.replyData.data) return
        $http.post($Factory.Zone.save.url,{
            type:70,
            ParentId:$scope.replyTo.Id,
            Content:$scope.replyData.data
        }).then(function(res){
            $scope.initData()
            $scope.replyData.data='';
        }).catch(function(){
            $scope.replyData.data=''
            enterViewLoad.customload('评论失败');
        })
    }
    $scope.keyboardHeight=null
	window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
			if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
				$scope.keyboardHeight=e.keyboardHeight
			}
            $scope.keyboardShow=true  
		})
    }) 
    window.addEventListener('native.keyboardhide',function(e){
		$timeout(function(){
            $scope.keyboardShow=false;
            $scope.showBotReply=false;
		})
    })
})
.factory('$hisBusinessCardData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
        slide:null,
	};

	return new Util();
}]);
