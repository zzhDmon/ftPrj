angular.module('App').controller('HomeCtl',function(NimUtils,appUtils,enterViewLoad,$ionicSlideBoxDelegate,$localStorage,$interval,$ionicPopover,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.tabActiveName='firstTab'
	$scope.isLoged=true;
	$scope.back=function(){
		appUtils.back()
	}

	//发布 弹窗导航 
	$ionicModal.fromTemplateUrl('home_nav_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	$scope.$on('modal.shown', function() {
		appUtils.fbModalShow()
	});
	$scope.$on('modal.hidden', function() {
	 	appUtils.fbModalHidden()
	});
	 
	
	$scope.$on('$ionicView.enter',function(){
		//清除浏览历史，即使手机上有回退按钮或者导航栏上显示回退按钮，都无法回退
		$ionicHistory.clearHistory();
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
		
		// 是否登录
		$scope.isLoged=$localStorage.access_token;
		$scope.initData()
		$scope.initBanner();
		$scope.initEchart()

		if($scope.listenScrollStatus){
			$scope.autoScroll();
			$scope.Switch($scope.listenScrollStatus)
		}
	})
	$scope.$on('$ionicView.leave',function(){
		$scope.listenScrollStatus=0;
	})

	// 广告轮播
	$scope.currentAdSlideIndex=0;
	$scope.changeAdSlide=function(index){
		$scope.currentAdSlideIndex=index;
	}

	enterViewLoad.load()
	
	

	$scope.currentCity=appUtils.city
	$scope.currentRotate=0
	$scope.currentRotateStr='rotate('+$scope.currentRotate+'deg)';
	// 刷新地址
	$scope.getAddress=function(){
		$scope.currentRotate=$scope.currentRotate + 360;
		$scope.currentRotateStr='rotate('+$scope.currentRotate+'deg)';

		appUtils.bMapLocation(function(result){
			myGeo.getPoint(result.addr, function(point){     
				if (point) { 
					$scope.mapimg='http://api.map.baidu.com/staticimage?center='+result.longitude+','+result.latitude+'&markers='+result.addr+'&width=300&height=200&zoom=15'     
					map.centerAndZoom(point, 16);      
				}else{
				}      
			}, 
			result.city);
		},function(err){
			enterViewLoad.customload('获取定位失败')
		})
	}
	
	$scope.initBanner=function(){
		// banner
		$http.post($Factory.News.banner.url,{type:20})
			.then(function(resData){
				$ionicLoading.hide()
				$scope.$broadcast('scroll.refreshComplete');
				$scope.adImgList=resData.data;
				if(resData.data.length>0){
					$ionicSlideBoxDelegate.update();
					$ionicSlideBoxDelegate.$getByHandle('home-banner-slide').loop(true);
				}
			}).catch(function(){
				$scope.$broadcast('scroll.refreshComplete');
				enterViewLoad.customload('获取失败');
			})
	}
	$scope.initEchart=function(){
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('home_house_trend_echarts'),'light');
		// 指定图表的配置项和数据
		var option = {
			title: {
				text: ''
			},
			grid:{
				x:35,
				y:10,
				x2:40,
				y2:30,
				// borderWidth:5
			   },
			tooltip: {},
			legend: {
				// data:['全部','思明','湖里','海沧','集美','同安','翔安','厦门周边',],
				// data:['全部'],
				// itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
                //                // 横向布局时为水平间隔，纵向布局时为纵向间隔
				// itemWidth: 20,             // 图例图形宽度
				// itemHeight: 14,
			
			},
			xAxis: [
				{
					boundaryGap: false,//显示每个x坐标轴刻度
					data: ["12月","1月","2月","3月","4月","5月","6月","7月",],
					splitLine:{show: false},//去除网格线
				}
			],
			yAxis : [
				{
					type : 'value',
					axisLabel : {
						formatter: function(value){
							// console.log(value/20000)
							// return value/2500+"万";
							return value/10000+"万";
						}
					},
					min:0,
					max:50000,
					interval: 10000,
					
					splitArea : {show : false},
					splitLine:{show: false},//去除网格线
				}
			],
	
			series: [
				{
					name: '',
					type: 'line',
					data: [27689, 28000, 48030, 37849, 47177, 36661, 27101, 33536],
					// areaStyle: {color:'rgba(105,151,255,0.6)'},//折现下区域颜色
				},
			],
			color:['rgba(105,151,255,0.6)']
			// color:['rgb(247,119,106)','rgb(44,194,231)','rgb(76,160,255)','rgb(255,175,85)','rgb(134,207,118)','rgb(84,203,201)','rgb(236,138,73)','rgb(255,230,104)']
		};
		myChart.setOption(option);
	}
	
	$scope.initData=function(){
		
		// 新房加载
		$scope.newQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
			pagenum:0,
		}
		$http.get($Factory.NewHouse.publicquery.url,{
				params:$scope.newQueryData
			}).then(function(resData){
				$scope.newhousearr=resData.data;
			}).catch(function(){
				enterViewLoad.customload('获取数据失败');
			})
		//二手房加载 
		$scope.oldQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
			pagenum:0,
			type:1,
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.oldQueryData})
			.then(function(resData){
				for(var i=0;i<resData.data.length;i++){
					var str=resData.data[i].Thumb
					resData.data[i].Thumb=str.replace(/230x150/, "120x90")
				}
				$scope.oldhousearr=resData.data;
			}).catch(function(){

			})
		//租房手房加载 
		$scope.rentQueryData={
			cityId:appUtils.city.id,
			pagesize:10,
			pagenum:0,
			type:2,
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.rentQueryData})
			.then(function(resData){
				for(var i=0;i<resData.data.length;i++){
					var str=resData.data[i].Thumb
					resData.data[i].Thumb=str.replace(/230x150/, "120x90")
				}
				$scope.renthousearr=resData.data;			
			}).catch(function(){

			})
	}

	// 切换显示房源列表类型
	$scope.houseType='old';
	$scope.switchHouseType=function(type){
		$scope.houseType=type;
	}
	
})