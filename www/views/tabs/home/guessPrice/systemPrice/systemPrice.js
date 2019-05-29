angular.module('App').controller('systemPriceCtl',function(enterViewLoad,appUtils,$http,$Factory,$state,$stateParams,$scope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid
	$scope.space=$stateParams.space
	
	$scope.subData={
		query:$stateParams.query,
		type:1,//1二手 2租房
		level:4//1市区 2区域 3街道 4小区 null模糊
	}
	var req={
		method:'POST',
		url:$Factory.Evalu.search.url+'?query='+$scope.subData.query+'&type='+$scope.subData.type+'&level='+$scope.subData.level,
		headers: {
			'Content-Type': 'application/json'					
		  },	
	}
	$http(req).then(function(resData){
		$scope.price=($scope.space*resData.data.AvePrice).toFixed(2)
		$scope.resData=resData.data;

		$scope.cellList=[]
		$scope.dataList=[]
		for(var i=0;i<resData.data.List.length;i++){
			$scope.cellList.push(resData.data.List[i].Mouth)
			$scope.dataList.push(resData.data.List[i].AvePrice)
		}
		
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('system_price_echarts'),'light');
		// 指定图表的配置项和数据
		var option = {
			title: {
				text: '均价走势图'
			},
			tooltip: {},
			legend: {
				data:['当前小区',],
				top:20,
				right:12
			},
			xAxis: {
				data: $scope.cellList
			},
			yAxis : [
				{type : 'value',
				axisLabel : {
					formatter: function(value){
						// return value/10000+"万";
						return value+"万";
					}
				},
				splitArea : {show : false}
				}
			],
			series: [
				{
					name: '当前小区',
					type: 'line',
					data: $scope.dataList
				},
			],
			color:['rgb(102,152,255)']
		};
		myChart.setOption(option);
	}).catch(function(){
		enterViewLoad.customload('提交失败')
	})

	
})