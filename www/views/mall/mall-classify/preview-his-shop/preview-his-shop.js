angular.module('App').controller('previewHisShopCtl',function(enterViewLoad,appUtils,$stateParams,$ionicSlideBoxDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.shopId=$stateParams.id
		// $scope.loadData()
		$scope.loadShopIndex()
	})
	$scope.$on('$ionicView.leave',function(){
		// 移除加入购物车时新增的dom
		$(".u-flyer").remove();
	})
	//店铺首页
	$scope.loadShopIndex=function(){
		$http.post($Factory.Shoper.home.url+'?id='+$scope.shopId)
			.then(function(resData){
				$scope.shopIndex=resData.data
				if(resData.data.bannerList.length>0){
					$ionicSlideBoxDelegate.update();//重绘，显示轮播图
				}
			}).catch(function(){
				enterViewLoad.customload('获取数据失败')
			})
	}
	

	// 首页 商品页切换
	$scope.pageIndex=0
	$scope.switchPageIndex=function(index){
		$scope.pageIndex=index
	}
	
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeSliderIndex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('his-shop-index-slide').currentIndex();
	}

	// 销量 折扣升降序切换
	$scope.sale=''
	$scope.discount=''
	$scope.changeSale=function(){
		$scope.sale = $scope.sale==1 ? 2 : 1;
		$scope.judgeSort()
	}
	$scope.changeDiscount=function(){
		$scope.discount = $scope.discount==2 ? 1 : 2;
		$scope.judgeSort()
	}
	$scope.judgeSort=function(){
		if($scope.sale==1&&$scope.discount==1){
			$scope.queryData.sort=11
		}else if($scope.sale==2&&$scope.discount==1){
			$scope.queryData.sort=21
		}else if($scope.sale==2&&$scope.discount==2){
			$scope.queryData.sort=22
		}else{
			$scope.queryData.sort=12
		}
		$scope.refreshLoad()
	}

	$scope.queryData={
		pagenum:0,
		pagesize:10,
		sort:12,
		date:$stateParams.id
	}
	$scope.productList=[]
	$scope.haveMore=true;
	// 商品列表
	$scope.loadData=function(ifloadmore){
		$http.post($Factory.Product.query.url,$scope.queryData)
			.then(function(resData){
				if(resData.data.length<=0){
					$scope.haveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.haveMore = true;
				if(ifloadmore){
					$scope.queryData.pagenum += 1;
					$scope.productList = $scope.productList.concat(resData.data)
					$scope.$broadcast('scroll.infiniteScrollComplete');	
				}else{
					$scope.queryData.pagenum = 1;
					$scope.productList=resData.data
					$scope.$broadcast('scroll.refreshComplete');
				}
			}).catch(function(){
				$scope.haveMore = false;
				enterViewLoad.customload('获取商品失败')
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}

	$scope.loadMore = function(ifloadmore){
		$scope.loadData(true)
	}
	$scope.refreshLoad = function(ifloadmore){
		$scope.queryData.pagenum = 0
		$scope.loadData(false);
		$ionicScrollDelegate.$getByHandle('his-shop-productlist').scrollTop();
	}
	

	// 加入购物车
	$scope.addToCart=function($event,item){
		$event.stopPropagation();
		var offset=$('#his_shop .fix-right-cart').offset(),
			// http://imgs.wujiuyun.com//Images//logo.png
			flyer = $('<img class="u-flyer" src="'+item.Image+'"/>');
		
		flyer.fly({
			start: {
				left: 100,
				top: $event.pageY - 50
			},
			end: {
				left: offset.left,
				top: offset.top,
				width: 0,
				height: 0
			}
		});
	}
})