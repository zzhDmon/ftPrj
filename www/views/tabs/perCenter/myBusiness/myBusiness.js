
angular.module('App').controller('myBusinessCtl',function($myBusinessData,WechatService,wechatLinkBase,actionImgShow,upImgBase,appUtils,enterViewLoad,$rootScope,$state,$ionicModal,$localStorage,$ionicPopover,$ionicScrollDelegate,$http,$Factory,$scope,$timeout){
	$scope.back=function(){
		appUtils.back();
    }

    //  进入切换
	$scope.$on('$ionicView.enter',function(){
        // 简介裁剪图片
        $scope.myPoster = $myBusinessData.myPoster;
        $scope.initData()

        $timeout(function(){
            if($rootScope.fromStateName=='tabs.perCenter' || $rootScope.fromStateName=='mallMine'){
                if($myBusinessData.tag==='intro'){
                    $scope.mySwiper.slideTo(0, 500, false)
                    $scope.swiperActiveIndex=0
                }else if($myBusinessData.tag==='dynamic'){
                    $scope.mySwiper.slideTo(4, 500, false)
                    $scope.swiperActiveIndex=4
                }
            }
        })
    })  
    
    // 头部背景色
    $scope.currentBG='rgba(17,17,17,0)';
    $scope.swiperActiveIndex=0
	$scope.mySwiper = new Swiper('.mybusiness-swiper-container', {
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
	$scope.delegate = $ionicScrollDelegate.$getByHandle('my-business-Scroll');
	$scope.myBusinessListen=function(){
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

    

// 文章动态切换
    // 新建相册
	$ionicModal.fromTemplateUrl('mybusiness_switch_modal', {
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

        $http.post($Factory.Zone.home.url+'?uid=0',{
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
                            item.agreed = item.AgressUsers.indexOf($scope.myselfInfo.Id)>=0 ? true:false;
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
                        if($scope.myselfInfo){
                            item.agreed = item.AgressUsers.indexOf($scope.myselfInfo.Id)>=0 ? true:false;
                        }else{
                            item.agreed = false
                        }
                        item.showCom = false
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
                }else if(resData.data[i].Type==60){//照片墙
                    if(resData.data[i].List.length>0){
                        if(appUtils.isJsonString(resData.data[i].List[0].Content)){
                            $scope.honorImageUrl=JSON.parse(resData.data[i].List[0].Content).Options[0].ImgUrl;
                        }
                        $scope.honorImageId=resData.data[i].List[0].Id
                    }
                }else if(resData.data[i].Type==50){//简介
                    if(resData.data[i].List.length>0){
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
    // $scope.initData()
    
    /*
        拼图操作
    */ 
    //获取相关CSS属性
    var getCss = function(o,key){
        return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];   
    };
    // 拖拽区域宽高
    var honor_div = document.getElementById('myhonor_free_content');
    var honor_free_width=honor_div.offsetWidth;
    var honor_free_height=honor_div.offsetHeight;

    // 当前最大z-index
    $scope.currentMaxIndex = 1;
    function drag(element){
        element.style.top = getCss(element,"top");
        element.style.left = getCss(element,"left");
        
		var hammer =new Hammer.Manager(element),
			pinch=new Hammer.Pinch(),
            rotate=new Hammer.Rotate(),
			pan=new Hammer.Pan()
			//初始化变形变量
			// pan_ex=pan_ey=rota_ex=0,pin_sl=1;
			//在执行伸缩的同时 识别旋转
            pinch.recognizeWith(rotate);
            //给容器添加你所需要的识别器
            hammer.add([pinch,rotate,pan]);
            //开启上下拖动（默认禁止）
            hammer.get('pan').set({direction:Hammer.DIRECTION_ALL}); 

        // var hammer = new Hammer(element);//hammer实例
        var x = 0;
        var y = 0;
        hammer.on('panstart',function(event){
            $scope.currentMaxIndex++
            element.style.zIndex=$scope.currentMaxIndex
            x = parseInt(element.style.left);
			y = parseInt(element.style.top);
			// 拖拽开始 页面禁止滚动
			// $ionicScrollDelegate.$getByHandle('my-business-honor-Scroll').freezeScroll(true);
			$scope.stopSlide=true
		});

        hammer.on('panmove',function(event){
            $timeout(function(){
                // 上下 不离开10px
                if((y+event.deltaY) < -30){
                    element.style.top='-30px'
                }else if((y+event.deltaY) > 300){
                    element.style.top='300px'
                }else{
                    element.style.top=y + event.deltaY + "px";
                }
                // 左右 不离开30px
                if((x + event.deltaX) < -10){
                    element.style.left='-10px'
                }else if((x + event.deltaX) > 345){
                    element.style.left='345px'
                }else{
                    element.style.left= x + event.deltaX + "px";
                }
            })
            
        });
        hammer.on('panend',function(event){
			// 拖拽结束 页面恢复滚动
			// $ionicScrollDelegate.$getByHandle('my-business-honor-Scroll').freezeScroll(false);
			$scope.stopSlide=false
        });

        hammer.on("pinchstart rotatestart", function(ev){
            
            $scope.currentMaxIndex++
            element.style.zIndex=$scope.currentMaxIndex
            // 伸缩开始 页面禁止滚动
			// $ionicScrollDelegate.$getByHandle('my-business-honor-Scroll').freezeScroll(true);
			$scope.stopSlide=true
            //获取旋转伸缩的第一次的值
            var first_scale=ev.scale;
            var first_rotate=ev.rotation;
            // 初始rotate scale旋转 伸缩值
            var values = getCss(element,"transform").split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var c = values[2];
            var d = values[3];
            var init_scale = Math.sqrt(a * a + b * b);
            var sin = b / init_scale;
            var init_rotate = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            
            hammer.on("pinchmove rotatemove", function(ev) {
                //获取变化的值
                var now_scale = ev.scale-first_scale+init_scale
                var now_rotate = ev.rotation-first_rotate+init_rotate

                element.style.transform='scale('+now_scale+') rotate('+now_rotate+'deg)';
                element.style.webkitTransform='scale('+now_scale+') rotate('+now_rotate+'deg)';
                
                hammer.on("pinchend rotateend", function(ev) {
                    element.style.transform='scale('+now_scale+') rotate('+now_rotate+'deg)';
                    element.style.webkitTransform='scale('+now_scale+') rotate('+now_rotate+'deg)';         
                    // 伸缩结束 页面回复滚动
					// $ionicScrollDelegate.$getByHandle('my-business-honor-Scroll').freezeScroll(false);
					$scope.stopSlide=false
                });
                ev.preventDefault();
            });
            ev.preventDefault();
        });
    }
    // 取消上传荣誉墙
    $scope.cancelHonor=function(){
        $scope.imgsList=[];
    }
    // 保存荣誉墙
    $scope.saveHonor=function(){
        enterViewLoad.load();
        // html接入成canvas
        html2canvas(document.querySelector("#myhonor_free_content")).then(function(canvas){
			document.body.appendChild(canvas);  // 直接使用canvas
			var baseData=canvas.toDataURL("image/png")
			// var imgUrl = canvas.toDataURL("image/png"); // 将canvas转换成img的src流
            // var imgUrl = canvas.toDataURL('image/png', 1); // 可以设置截图质量0-1
            $scope.saveScreenShot(baseData)
            document.body.removeChild(canvas);
		});
        
    }
    // 保存截图
    $scope.saveScreenShot=function(baseData){
        $http.post( $Factory.Account.upload.url,{
            path:'18/businesscard/honor',
            file:baseData
        }).then(function(resData){
            if(resData.data.error==0){
                // 保存荣誉墙
                var data={
                    "Width": 375,
                    "Height": 413,
                    "Options":[
                        {
                            "DrawingType": 1,
                            "Top": 0,
                            "Left": 0,
                            "ZIndex": -100,
                            "Rotate": 0,
                            "Width": 375,
                            "Height": 413,
                            "ImgUrl": resData.data.view
                        },
                    ]
                }
                
                var realSubData={
                    Content:JSON.stringify(data),
                    Type:60,
                    Id:$scope.honorImageId || ''
                }
                // 保存荣誉墙图片
                $http.post($Factory.Zone.save.url,realSubData)
                    .then(function(resData){
                        enterViewLoad.customload('保存成功')
                        $scope.initData()
                        $scope.imgsList=[];
                    }).catch(function(){
                        enterViewLoad.customload('保存失败')
                    })
            }
        }).catch(function(e){
            enterViewLoad.customload('图片上传失败')
        })
    }

    // 选择图片
    $scope.imgsList=[]
	$scope.honorPhotoChoose = function(){ 
        $scope.imgsList=[]
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
            'maxSelectSize': 188743680, //188743680=180M (Optional)
            'quality':100,
		};
		appUtils.photoLiberary(args,function(base){
            $scope.imgsList.push(base);	
		},function(err){
			enterViewLoad.customload('获取图片失败')
        })
        
    }

	$scope.startDrag=function(){
        for(var i=0;i<$scope.imgsList.length;i++){
            var myElement1 = document.getElementById("imgid-"+i);
            drag(myElement1); 
            myElement1.classList.add("zoomIn");
            // $("#imgid-"+i).addClass("zoomIn")
        }

    }

    // 名片海报选择图片
    var poster_div = document.getElementById('myposter_free_content');
    var poster_free_width=poster_div.offsetWidth;
    var poster_free_height=poster_div.offsetHeight;
	$scope.posterPhotoChoose = function(){ 
        try{
			var args = {
				'selectMode': 100, //101=picker image and video , 100=image , 102=video
				'maxSelectCount': 1, //default 40 (Optional)
				'maxSelectSize': 188743680, //188743680=180M (Optional)
			};
			document.addEventListener("deviceready", function () {
				MediaPicker.getMedias(args,function(medias) {
					//medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
					var imgUrl = ''
					for (var i = 0; i < medias.length; i++){
						imgUrl =medias[i].path
					}
					MediaPicker.getExifForKey(imgUrl,"Orientation", function(data) {
						$state.go('busintroImgCut',{
                            imgurl:imgUrl,
                            orientation:data})
					}, function(e) {
						console.log(e) 
					});
				},function(e){
					err(e) 
				})
			},false)
		}catch(e){
			
		}
		// var args = {
		// 	'selectMode': 100, //101=picker image and video , 100=image , 102=video
		// 	'maxSelectCount': 1, //default 40 (Optional)
		// 	'maxSelectSize': 188743680, //188743680=180M (Optional)
        //     'quality':100,
        // };
		// appUtils.photoLiberary(args,function(base,orientation){
		// 	$http.post( $Factory.Account.upload.url,{
		// 			path:'18/businesscard/poster',
        //             file:base,
        //             orientation:orientation
		// 	}).then(function(resData){
		// 		if(resData.data.error==0){
        //             $scope.myPoster=resData.data.view;
        //         }
		// 	}).catch(function(){
		// 		enterViewLoad.customload('图片上传失败')
		// 	})
		// },function(err){
		// 	enterViewLoad.customload('获取图片失败')
        // })
    }

    
    $scope.savePoster=function(){
        var data={
            "Width": poster_free_width,
            "Height": poster_free_height,
            "Options":[
                {
                    "DrawingType": 1,
                    "Top": 0,
                    "Left": 0,
                    "ZIndex": -100,
                    "Rotate": 0,
                    "Width": poster_free_width,
                    "Height": poster_free_height,
                    "ImgUrl":  $scope.myPoster
                },
            ]
        }
		var realSubData={
			Content:JSON.stringify(data),
            Type:50,
            Id:$scope.posterImageId || ''
        }
        
		$http.post($Factory.Zone.save.url,realSubData)
			.then(function(resData){
                enterViewLoad.customload('保存成功');
                $scope.initData();
                $scope.myPoster='';
                $myBusinessData.myPoster='';
			}).catch(function(){
				enterViewLoad.customload('保存失败')
			})
    }
    $scope.cancelPoster=function(){
        $scope.myPoster='';
        $myBusinessData.myPoster='';
    }
    

/*
    添加动态 popover
*/
	$ionicPopover.fromTemplateUrl('businesscard_add_content_popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.addpopover = popover;
	});
	$scope.openAddTLPopover = function($event) {
		$scope.addpopover.show($event);
	};
	$scope.closeAddTLPopover = function() {
		$scope.addpopover.hide();
	};
/*
    动态 删除popover
*/
	$ionicPopover.fromTemplateUrl('del_time_line_popover.html', {
		scope: $scope
	}).then(function(popover) {
		$scope.popover = popover;
	});
	$scope.openDelTLPopover = function($event,item,index) {
        $scope.popover.show($event);
        $scope.delTLItem={
            item:item,
            index:index
        }
	};
	$scope.closeDelTLPopover = function() {
        $scope.popover.hide();
    };
    
    $scope.deleteTL=function(){
		$scope.closeDelTLPopover()
        $http.post($Factory.Zone.delete.url+'?id='+$scope.delTLItem.item.Id)
            .then(function(res){
                enterViewLoad.customload('删除成功')
				$scope.delegate.resize();
				if($scope.delTLItem.item.Type==10){
					$scope.dynamicData.splice($scope.delTLItem.index,1);
				}else if($scope.delTLItem.item.Type==40){
					$scope.articleData.splice($scope.delTLItem.index,1);
				}
            }).catch(function(){
                enterViewLoad.customload('删除失败')
            })
    }
    // 新建相册
	$ionicModal.fromTemplateUrl('mybusiness_addalbum_modal', {
		scope: $scope,
		animation: 'slide-in-left'
	}).then(function(modal) {
		$scope.Modal = modal;
	});
	$scope.showModal=function(){
		$scope.Modal.show();	
	}
	$scope.closeModal=function(){
		$scope.Modal.hide();
	}
	$scope.addAlbumData={
		Title:''
    }
    

/*
    新建相册
*/ 
	$scope.addAlbum = function(){ 
		if(!$scope.addAlbumData.Title){
			enterViewLoad.customload('请输入相册名称')
			return
		}
		$http.post($Factory.Zone.save.url,{
			Title:$scope.addAlbumData.Title,
			Type:21,
		}).then(function(resData){
			enterViewLoad.customload('新建成功')
			$scope.initData()
			$scope.closeModal()
		}).catch(function(){
			enterViewLoad.customload('新建相册失败')
		})
	}
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
    // 点赞
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
    /*
        分享
    */ 
	$ionicModal.fromTemplateUrl('my_business_card_share_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.shareModal = modal;
	});
	$scope.showBottomShareModal=function(){
		$scope.shareModal.show();	
	}
	$scope.closeBottomShareModal=function(){
		$scope.shareModal.hide();
    }
    
    //调用微信分享 
	$scope.share = function(shareto){
		$scope.shareImgUrl = $scope.posterImageUrl || $scope.honorImageUrl || 'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0 || shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: '我的房田空间',
						thumb: base64,
						description: '为您推荐房田空间',
						media: {
                            type: Wechat.Type.LINK,
                            webpageUrl:appUtils.shareHost+"/#/percenter/hisbusinesscard/params/"+$scope.myselfInfo.Id
                        }
					}
				};
				WechatService.share($scope.params);
			})
			
		}else{
			var args = {};
			args.url = appUtils.shareHost+"/#/percenter/hisbusinesscard/params/"+$scope.myselfInfo.Id;
			args.title = '我的房田空间';
			args.description = '为您推荐房田空间';
			if(shareto==2){
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
					
				}, function (failReason) {
					
				}, args);
			}
		}
    }
})


