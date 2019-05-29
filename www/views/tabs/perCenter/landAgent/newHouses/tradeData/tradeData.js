angular.module('App')
.controller('tradeDataCtl',function(appUtils,$ionicHistory,$Factory,$http,$scope,$rootScope,$ionicPopover,$timeout){
	$scope.back=function(){
		appUtils.back();
    }


    // 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('trade_data_echarts'));

	// 指定图表的配置项和数据
	var option = {
		title: {
			text: '交易统计'
		},
		tooltip: {},
		legend: {
			data:['销量','量']
		},
		xAxis: {
			data: ["04-15","04-16","04-17","04-18","04-19","04-20"]
		},
		yAxis: {},
		series: [{
			name: '销量',
			type: 'bar',
			data: [5, 20, 36, 10, 10, 20]
		},{
			name: '量',
			type: 'line',
			data: [5, 10, 30, 10, 10, 20]
		}],
		color:['rgb(27,197,187)','rgb(255,255,0)']
	};

	myChart.setOption(option);
    
    

})


