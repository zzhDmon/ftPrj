
angular.module('App').controller('goodsDetailPrizeCtl',function(appUtils,enterViewLoad,$cookies,$localStorage,actionImgShow,$ionicScrollDelegate,$window,wechatLinkBase,WechatService,$location,$rootScope,$ionicModal,$timeout,$ionicHistory,$scope,$state,$stateParams,$http,$Factory,$ionicSlideBoxDelegate){
	$scope.back=function(){
		appUtils.back();
	}
	

	
	
	$scope.headerBack=function(){
		if($scope.pageIndex==0){
			$scope.back()
		}else{
			$scope.pageIndex=0;
		}
	}
	// 头部title切换
	$scope.pageIndex=0;
	$scope.switchPageIndex=function(index){
		$scope.pageIndex=index;
	}
	// 详情头部切换
	$scope.detailIndex=0;
	$scope.switchDetailIndex=function(index){
		$scope.detailIndex=index;
		$ionicScrollDelegate.$getByHandle('goods-detail-prize-detail-Scroll').resize();
		$ionicScrollDelegate.$getByHandle('goods-detail-prize-detail-Scroll').scrollTop();
	}


	// 滚动监听
	$scope.goodsDetailListen=function(){
		try{
			$scope.detailScrollTop = $ionicScrollDelegate.$getByHandle('goods-detail-prize-Scroll').getScrollPosition().top;
		}catch(e){}
		if($scope.detailScrollTop>61){
			$timeout(function(){
				$scope.showHeader=true;
			})
		}else{
			$timeout(function(){
				$scope.showHeader=false;
			})
		}
	}

	$scope.$on('$ionicView.enter',function(){
		// 收货地址
		appUtils.getReceiptAddress(function(res){
			$scope.receiptAddress=res;
		})
		
		// 商品详情
		$scope.loadData()
		$scope.keyboardShow=false
	})
	
	
	$scope.loadData=function(){
		// 是否新人
		$http.post($Factory.ProductOrder.isnewer.url)
			.then(function(resData){
				$scope.isNewer=resData.data;
			}).catch(function(e){
				$scope.isNewer=false;
			})

		$http.get($Factory.Product.get.url+'?id='+$stateParams.id).then(function(resData){
			if(appUtils.isJsonString(resData.data.Specifications)){
				resData.data.Specifications = JSON.parse(resData.data.Specifications)
			}else{resData.data.Specifications = []}
			resData.data.SKUItems.filter(function(item){
				if(appUtils.isJsonString(item.TemplateValues)){
					item.TemplateValues = JSON.parse(item.TemplateValues)
				}else{item.TemplateValues =''}
				return item
			})
			if(appUtils.isJsonString(resData.data.Specifics)){
				resData.data.Specifics = JSON.parse(resData.data.Specifics)
			}else{resData.data.Specifics = []}
			// 已选的SKU的Id数组
			$scope.skuChoosedIndexs=[]
			for(var i=0;i<resData.data.Specifications.length;i++){
				$scope.skuChoosedIndexs.push(0)
			}
			$scope.productDetail=resData.data
			// 显示当前sku价格
			$scope.showSkuPrice()
			
			if(resData.data.ShowHeadImages.length>0){
				$ionicSlideBoxDelegate.update();//重绘，显示轮播图
				if(resData.data.ShowHeadImages.length>2){
					$ionicSlideBoxDelegate.loop(true);//循环
				}
			}
		}).catch(function(){
			enterViewLoad.customload('获取商品失败')
		})
	}
	
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeindex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('goods-detail-prize-slider-handle').currentIndex();
	}
	// 选择sku
	$scope.changeSkuChoosedIndexs=function(parIndex,index){
		$scope.skuChoosedIndexs[parIndex]=index
		$scope.showSkuPrice()
	}
	$scope.showSkuPrice=function(){
		var copyData=$scope.productDetail.SKUItems
		var data = copyData.filter(function(item){
			return item.TemplateValues.Id == $scope.skuChoosedIndexs.join('_')
		})
		$scope.currentSku=data[0];
	}

	// 加入购物车
	$scope.addToShoppingCart=function(buyNow){
		$scope.closeTagsModal()
		if($scope.currentSku.Inventory<=0){
			enterViewLoad.customload('库存不足')
			return
		}
		
		var copyData=$scope.productDetail.SKUItems
		var data = copyData.filter(function(item){
			return item.TemplateValues.Id == $scope.skuChoosedIndexs.join('_')
		})
		// 立即兑换
		$state.go('confirmPrizeOrder',{
			ProductId: $scope.productDetail.Id,
			ProductSKUId: $scope.currentSku.Id,
			Quantity: 1,
			ShopId: $scope.productDetail.ShopId,
		})	
		
	
	}
	
		
	
	//	参数
	$ionicModal.fromTemplateUrl('prize_product_parameter_modalview', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.parameterModal = modal;
	});
	$scope.showParameterModal=function(){
		$scope.parameterModal.show();	
	}
	$scope.closeParameterModal=function(){
		$scope.parameterModal.hide();
	}
	//	SKU
	$ionicModal.fromTemplateUrl('prize_product_tags_modalview', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.tagsModal = modal;
	});
	$scope.showTagsModal=function(){
		$scope.tagsModal.show();	
	}
	$scope.closeTagsModal=function(){
		$scope.tagsModal.hide();
	}

	
	// 点赞
	$scope.agreeComment=function(item){
		$http.post($Factory.Product.agree.url+'?id='+item.Id)
			.then(function(res){
				item.AgressUsers.push(0)
			}).catch(function(err){
				var msg = err.data.Message || '点赞失败'
				enterViewLoad.customload(msg)
			})
	}
// 评论
	$ionicModal.fromTemplateUrl('prize_product_comments_modalview', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.commentsModal = modal;
	});
	$scope.showCommentsModal=function(item){
		$scope.commentsModal.show();	
		$scope.parentComment=item;
		$scope.getChildComments()
	}
	$scope.closeCommentsModal=function(){
		$scope.commentsModal.hide();
	}
	// 获取评论回复
	$scope.getChildComments=function(){
		$http.post($Factory.Product.comments.url+'?pid='+$scope.parentComment.Id)
			.then(function(res){
				$scope.childComments=res.data
			}).catch(function(err){
				
			})
	}
	// 回复评论
	$scope.replayData={
		data:''
	}
	$scope.replyComment=function(){
		if(!$scope.replayData.data){
			enterViewLoad.customload('请输入回复内容！')
			return
		}
		$http.post($Factory.Product.replycomment.url,{
				Content: $scope.replayData.data,
				ParentId: $scope.parentComment.Id,
		  	}).then(function(res){
				$scope.replayData.data='';
				$scope.getChildComments()
				$scope.parentComment.ChildrenCount++
			}).catch(function(err){
				enterViewLoad.customload('回复失败！')
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
			$scope.keyboardShow=false
		})
    })
	
	// 分享
	$ionicModal.fromTemplateUrl('prize_goods_detail_share_modal', {
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
	
	$scope.share = function (shareto) {
		// 分享记录保存
		$scope.saveShare();

		$scope.shareImgUrl=$scope.productDetail.ShowHeadImages.slice(0,1)&&$scope.productDetail.ShowHeadImages.slice(0,1)[0].length>0 ? 
							$scope.productDetail.ShowHeadImages.slice(0,1)[0]:'http://imgs.wujiuyun.com/images/logo.png';
		var _goodsFromWho = $localStorage.mysefInfo?$localStorage.myselfInfo.Id:''				

		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase($scope.shareImgUrl,function(base64){
				$scope.params = {
					scene: shareto,
					message: {
						title: $scope.productDetail.Name || '房田商城促销单品',
						thumb: base64,
						description:$scope.productDetail.Details || '劲爆折扣商品',
						media: {
							type: Wechat.Type.LINK,
							webpageUrl:appUtils.shareHost+"/#"+$location.path() 
						}
					}
				};
				WechatService.share($scope.params);			
			})
		}else{
			var args = {};
			args.url = appUtils.shareHost+"/#"+$location.path() ;
			args.title =  $scope.productDetail.Name || '房田商城促销单品';
			args.description = $scope.productDetail.Details || '劲爆折扣商品';
			if(shareto==2){
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
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
	$scope.saveShare=function(){
		$http.post($Factory.Share.save.url,{ 
			ShareType: 20,
			ObjectId:$stateParams.id,
			Phone :$localStorage.myselfInfo ? $localStorage.myselfInfo.UserName : ''
		}).then(function(res){
		}).catch(function(e){
		})
	}
})
