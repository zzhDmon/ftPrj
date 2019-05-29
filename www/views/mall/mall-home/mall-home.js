angular.module('App').controller('mallHomeCtl',function(enterViewLoad,NimUtils,appUtils,$ionicSlideBoxDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		$state.go('tabs.realHome');
	}
	$scope.statusData=appUtils.statusData;

	$scope.$on('$ionicView.enter',function(){
		// 计算会话未读数
		var _calcUnread = function(sessions){
			for(var i=0;i<sessions.length;i++){
				$scope.totalUnread=$scope.totalUnread+sessions[i].unread
			}
		}
		// 会话未读数
		$scope.totalUnread=0;
		_calcUnread(NimUtils.sessionList)
		// 会话列表 未读数 更新
		$rootScope.$on('updateSessions',function(event,data){
			$timeout(function(){
				$scope.totalUnread=0;
				_calcUnread(data)
			})
		})

		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
		$scope.activeTabName='mall-home';
		$scope.loadData();

		// 我的商铺信息
		$http.get($Factory.Shoper.get.url)
			.then(function(resData){
				$scope.myShopInfo=resData.data;
			}).catch(function(err){
				$scope.myShopInfo=''
			})
	})

	$scope.vipFourImgs=[
		'imgs/mall/home/vip4-1.jpg',
		'imgs/mall/home/vip4-2.jpg',
		'imgs/mall/home/vip4-3.jpg',
		'imgs/mall/home/vip4-4.jpg',
	]
	$scope.saleTwoImgs=[
		'imgs/mall/home/sale1.jpg',
		'imgs/mall/home/sale2.jpg',
		'imgs/mall/home/sale3.jpg',
		'imgs/mall/home/sale4.jpg',
	]
	$scope.saleFourImgs=[
		'imgs/mall/home/sale4-1.jpg',
		'imgs/mall/home/sale4-2.jpg',
		'imgs/mall/home/sale4-3.jpg',
		'imgs/mall/home/sale4-4.jpg',
	]
	
	$scope.initSwiper=function(){
		// swiper
		var mySwiper = new Swiper('#mall_home_nav', {
			freeMode: true,
			freeModeMomentumRatio: 0.5,
			slidesPerView: 'auto',
		});
		
		swiperWidth = mySwiper.container[0].clientWidth
		maxTranslate = mySwiper.maxTranslate();
		maxWidth = -maxTranslate + swiperWidth / 2
		$(".swiper-container").on('touchstart', function(e) {
			e.preventDefault()
		})
		
		mySwiper.on('tap', function(swiper, e) {	
		//	e.preventDefault()	
			slide = swiper.slides[swiper.clickedIndex]
			slideLeft = slide.offsetLeft
			slideWidth = slide.clientWidth
			slideCenter = slideLeft + slideWidth / 2
			// 被点击slide的中心点
			mySwiper.setWrapperTransition(300)
		
			if (slideCenter < swiperWidth / 2) {			
				mySwiper.setWrapperTranslate(0)	
			} else if (slideCenter > maxWidth) {		
				mySwiper.setWrapperTranslate(maxTranslate)	
			} else {	
				nowTlanslate = slideCenter - swiperWidth / 2	
				mySwiper.setWrapperTranslate(-nowTlanslate)	
			}
		})
	}



	// 轮播图
	$scope.adImgList=[
		'imgs/mall/home/banner1.jpg',
		'imgs/mall/home/banner2.jpg',
		'imgs/mall/home/banner3.jpg',
		'imgs/mall/home/banner4.jpg',
		'imgs/mall/home/banner5.jpg',
	]
	$scope.currentAdSlideIndex=0;
	$scope.changeAdSlide=function(index){
		$scope.currentAdSlideIndex=index
	}
	
	// 房产时报
	$scope.loadData=function(){
		// $http.post($Factory.Product.query.url,{
		// 	pagenum:0,pagesize:6,
		// 	sort:12,query:'',SaleType:'59'
		// }).then(function(resData){
		// 	$scope.productList=resData.data;
		// 	$scope.$broadcast('scroll.refreshComplete')
		// }).catch(function(){
		// 	$scope.$broadcast('scroll.refreshComplete')
		// })
	}

	$scope.queryData={
		pagenum:0,
		pagesize:10,
		sort:12,
		query:'',
		SaleType:'59'
	}

	$scope.haveMore=true;
	$scope.productList=[];
 	function loadData(ifloadmore){
		// 我的全部房源
		$http.post($Factory.Product.query.url,$scope.queryData)
			.then(function(resData){
				if(!resData.data || resData.data.length<=0){
					$scope.haveMore = false;
					$scope.$broadcast('scroll.refreshComplete');
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.haveMore = true;
				if(ifloadmore){
					$scope.queryData.pagenum += 1;
					$scope.productList=$scope.productList.concat(resData.data);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}else{
					$scope.queryData.pagenum=1
					$scope.productList=resData.data;
					$scope.$broadcast('scroll.refreshComplete');	
				}
			}).catch(function(){
				$scope.haveMore = false;
				$ionicLoading.show({
					template: '获取数据失败',
					duration: 1500
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	$scope.loadMore = function(ifloadmore){
		loadData(true);
	}
	$scope.loadRefresh = function(ifloadmore){
		$scope.queryData.pagenum=0;
		loadData(false);
	}

})