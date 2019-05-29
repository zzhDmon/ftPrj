angular.module('App').controller('daibanListCtl',function(appUtils,$timeout,$ionicScrollDelegate,$rootScope,$ionicHistory,$Factory,$scope,$http,$ionicLoading,$ionicSlideBoxDelegate){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.headTitle='贷款';
	$scope.changeindex=function(){
		$scope.currentindex=$ionicSlideBoxDelegate.$getByHandle('daibanList-handle').currentIndex();
		if($scope.currentindex==0){
			$scope.headTitle='贷款';
		}else if($scope.currentindex==1){
			$scope.headTitle='过户';
		}else if($scope.currentindex==2){
			$scope.headTitle='保险';
		}else{

		}
	}
	

	$scope.showBackTopBtn=function(scrollTop){
		if(scrollTop>25){
			$('#be_agent .backtop').css('display','block')
		}else{
			$('#be_agent .backtop').css('display','none')
		}
	}
	$scope.videoScrollListen = function(){
		//根据滚动控制回到顶部的显示
		var scrollTop = $ionicScrollDelegate.$getByHandle('videoScroll').getScrollPosition().top;
		$scope.showBackTopBtn(scrollTop)
	}
	$scope.videoScrollTop = function() {
		    $ionicScrollDelegate.scrollTop(true);
		  };
		  
	$scope.liveScrollListen = function(){
		//根据滚动控制回到顶部的显示
		var scrollTop = $ionicScrollDelegate.$getByHandle('liveScroll').getScrollPosition().top;
		$scope.showBackTopBtn(scrollTop)
	}
	$scope.liveScrollTop = function() {
		    $ionicScrollDelegate.scrollTop(true);
		  };

	


	//强制刷新
	$scope.$on('$ionicView.beforeEnter',function(){
//		$scope.lsloadMore();
		
		//状态栏
		if(window.StatusBar){
		  	StatusBar.show();
		 	StatusBar.backgroundColorByName("gray");
		}
	})
	

	$scope.headChoose=0;
	$scope.move=function(index,$event){
		if(index==2){
			var left = (25*index+4)+'%';
			$('.underline').css('width','16vw')
		}else{
			$('.underline').css('width','11vw')
			var left = (25*index+7)+'%';
		}

		$('.underline').animate({
			left:left
		},500);
		$scope.headChoose=index;	
		$scope.pagenum=1					
	}
	
	$scope.testData={
		room: [
		{
		roomid: "744244",
		cateid: 181,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/744244_1642.jpg",
		roomname: "只有把自己变得更好才不会被抛弃。",
		gamename: "王者荣耀",
		nickname: "谢小R",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "446321",
		cateid: 124,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/446321_1641.jpg",
		roomname: "小年夜~弹幕免费抽奖",
		gamename: "户外",
		nickname: "主播海涛",
		icon_data: - {
		status: 5,
		icon_url: "https://staticlive.douyucdn.cn/upload/icon/e8da504ced5717125d31f712a2e68d4d.png",
		icon_width: "126",
		icon_height: "33"
		}
		},
		{
		roomid: "3219235",
		cateid: 331,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/3219235_1639.jpg",
		roomname: "新赛季排位极速上分",
		gamename: "QQ飞车",
		nickname: "青青青青青青山",
		icon_data: - {
		status: 5,
		icon_url: "https://club-img.douyucdn.cn/dylamr/2018/01/10/a99a04a2dc9bb3d3afef6d1a0f32e43a.png",
		icon_width: "126",
		icon_height: "33"
		}
		},
		{
		roomid: "4055898",
		cateid: 270,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/4055898_1639.jpg",
		roomname: "小哥哥 敢上我的车吗",
		gamename: "绝地求生",
		nickname: "桃子乄小萌妹",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "2634712",
		cateid: 270,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/2634712_1638.jpg",
		roomname: "三思:看直播还有钱拿, 来啊!",
		gamename: "绝地求生",
		nickname: "SanSi2tap",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "618839",
		cateid: 270,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/618839_1638.jpg",
		roomname: "报告今天可能不杀生",
		gamename: "绝地求生",
		nickname: "迷人蜜",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "2458360",
		cateid: 331,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/2458360_1639.jpg",
		roomname: "免费帮上分！关注游城十代！",
		gamename: "QQ飞车",
		nickname: "游城十代2017",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "3572355",
		cateid: 331,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/3572355_1639.jpg",
		roomname: "骑马骚是个贴墙怪：睡过头了继续冲击星耀",
		gamename: "QQ飞车",
		nickname: "金秀杀骑马",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "3398036",
		cateid: 270,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/3398036_1638.jpg",
		roomname: "1万关注开启1000现金红包抽，点关注哦",
		gamename: "绝地求生",
		nickname: "李豌豆吖",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		},
		{
		roomid: "1343255",
		cateid: 195,
		pic: "https://rpic.douyucdn.cn/amrpic-180208/1343255_1642.jpg",
		roomname: "千万豪宅搞直播练肩点关注送计划",
		gamename: "鱼教",
		nickname: "好教练文哥珠宝",
		icon_data: - {
		status: 5,
		icon_url: "",
		icon_width: 0,
		icon_height: 0
		}
		}
		],
		bzdata: 0,
		title: "互动抽奖",
		type: 3
		}


	
	//起始请求页码
	$scope.pagenum = 1;
	//每页请求数量
	var pagesize = 10;
	$scope.noMore = true;

	//声明一个容器把所有无限滚动的数据装起来（上拉时在容器拼接数据，下拉重新生成空容器）
	$scope.loushiarr = [];
	$scope.xiamenarr = [];
	$scope.yulearr = [];
	$scope.xiaoshouarr = [];
	
	if($scope.head==0){
			//在当前作用域添加loadMore方法
			$scope.lsloadMore = function(infinite) {
				var newstype=1;
				load(infinite,newstype);
			}
		
			//在当前作用域添加 doRefresh 方法
			$scope.lsdoRefresh = function(refresh) {
				$scope.pagenum = 1;
				var newstype=1;
				load(refresh,newstype)
			}
			
		}
	

	
    //刷新和加载方法
	function load(loadType,newstype) {
		$http.get($Factory.News.query.url,{params:{pagenum:$scope.pagenum,size:pagesize,query:'',newsType:newstype}}).then(function(resData) {	
			//返回空数组，没有更多数据了
			if(resData.data.length<=0){
				$ionicLoading.show({
					template: '加载到底了',
					duration: 1000
				});
				$scope.noMore = false;
				return;
			}
			if(loadType) {
				$scope.pagenum += 1;
				if(newstype==1){
					$scope.loushiarr = $scope.loushiarr.concat(resData.data);
				}else if(newstype==2){
					$scope.xiamenarr = $scope.xiamenarr.concat(resData.data);
				}else if(newstype==3){
					$scope.yulearr = $scope.yulearr.concat(resData.data);
				}else{
					$scope.xiaoshouarr = $scope.xiaoshouarr.concat(resData.data);
				}
				//无线加载数据成功后需要广播事件通知这个指令 ion-infinite-scroll 加载完成。
				$scope.$broadcast('scroll.infiniteScrollComplete');
			} else {
				//数据清空，重新写入
				//$scope.showarr = resData.data;
				if(newstype==1){
					$scope.loushiarr = resData.data;	
				}else if(newstype==2){
					$scope.xiamenarr = resData.data;
				}else if(newstype==3){
					$scope.yulearr = resData.data;
				}else{
					$scope.xiaoshouarr = resData.data;
				}
				$scope.$broadcast('scroll.refreshComplete');
				//能够让用户再次下拉刷新
				if(resData.data.length>9){
					$scope.noMore = true;
				}else{
					$scope.noMore = false;
				}
			}
		}).catch(function(resData) {
			$ionicLoading.show({
				template: '请求新闻数据失败',
				duration: 1500
			})
		})
	}
	

	
})
