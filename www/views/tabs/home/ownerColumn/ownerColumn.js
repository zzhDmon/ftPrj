angular.module('App').controller('ownerColumnCtl',function(appUtils,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.goHome=function(type){
		$scope.back();
		$rootScope.$emit('homeScrollType',type)
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.currentMonth=new Date().getMonth()+1;
		$scope.initData();
	})
	$scope.initData=function(){
		//二手房加载 
		$scope.oldQueryData={
			cityId:1,
			pagesize:5,
			pagenum:0,
			type:1,
			query:'',
			district:'',
			street:'',
			minprize:'',
			maxprize:'',
			roomType:'',
			sort:''
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.oldQueryData})
			.then(function(resData){
				$scope.$broadcast('scroll.refreshComplete');
				for(var i=0;i<resData.data.length;i++){
					var str=resData.data[i].Thumb
					resData.data[i].Thumb=str.replace(/230x150/, "60x60")
				}
				$scope.oldhousearr=resData.data;
				
			}).catch(function(){
				$scope.$broadcast('scroll.refreshComplete');
			})
		
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('owner_column_trend_echarts'),'light');
		// 指定图表的配置项和数据
		var option = {
			title: {
				text: ''
			},
			tooltip: {},
			legend: {
				// data:['全部','思明','湖里','海沧','集美','同安','翔安','厦门周边',],
				data:['全部'],
				itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
                               // 横向布局时为水平间隔，纵向布局时为纵向间隔
				itemWidth: 20,             // 图例图形宽度
				itemHeight: 14,
			
			},
			xAxis: {
				data: ["8月","9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月",]
			},
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
					max:75000,
					interval: 10000,
					splitArea : {show : false}
				}
			],
	
			series: [
				{
					name: '',
					type: 'line',
					data: [47689, 48000, 48030, 47849, 47177, 46661, 47101, 46536, 45640, 45008, 45004, 45068],
				},
			],
			color:['rgba(105,151,255,0.6']
			// color:['rgb(247,119,106)','rgb(44,194,231)','rgb(76,160,255)','rgb(255,175,85)','rgb(134,207,118)','rgb(84,203,201)','rgb(236,138,73)','rgb(255,230,104)']
		};
		myChart.setOption(option);
	}

	
})