angular.module('App').controller('evaluationListCtl',function(enterViewLoad,appUtils,$ionicPopup,$localStorage,$http,$Factory,$state,$stateParams,$scope,$rootScope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid
	$scope.loadEchart=function(){
		var myChart = echarts.init(document.getElementById('evaluation_list_echarts'),'light');
		var option = {
			title: {
				text: ''
			},
			tooltip: {},
			legend:{
				data: ['特点']
			},
			radar: {
				center: ['50%', '50%'],
				name: {
					textStyle: {
						color: '#000',
						backgroundColor: 'rgba(0,0,0,0)',
						borderRadius: 3,
						fontSize:12,
						padding: [3, 5]
				}
				},
				indicator: [
				{ name: '', max: 400},
				{ name: '', max: 400},
				{ name: '', max: 400},
				{ name: '', max: 400},
				{ name: '', max: 400},
				{ name: '', max: 400}
				],
				splitArea:{
					areaStyle:{
						color:['rgb(102,152,255)','rgb(148,183,255)','rgb(178,203,255)']
					}
				},
				splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.9)' } },
				axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.9)' } },	
				lineStyle:{
					shadowColor: 'rgb(255, 0, 0)',
					shadowBlur: 10
				}
				
			},
			series: [{
				name: '预算 vs 开销',
				type: 'radar',
				// areaStyle: {normal: {}},
				data : [
					{
						value : [300, 100, 280, 350, 200, 190],
						name : ''
					}
				]
			}],
			color:['rgb(255,255,255)']
		};
		myChart.setOption(option);
		
	}

$scope.$on('$ionicView.enter',function(){
	$scope.loadEvaluationList()
	$scope.loadHouseInfo()
			$timeout(function(){
				$scope.loadEchart()
			})
	})
	
	$scope.myselfInfo=$localStorage.myselfInfo;

	$scope.loadEvaluationList=function(){
		var req={
			method:'POST',
			url:$Factory.Evalu.list.url+'?houseId='+$scope.houseId+'&type=2',
			headers: {
				'Content-Type': 'application/json'					
			},	
		}
		$http(req).then(function(resData){
			$scope.evaluationList=resData.data
		}).catch(function(){
			enterViewLoad.customload('获取评测列表失败')
		})
		
	}
	$scope.loadHouseInfo=function(){
		// 房源信息
		var req = {
			method: 'POST',
			url: $Factory.NewHouseSource.postdetail.url+'/'+$scope.houseId,
			headers: {
			'Content-Type': 'application/json'
			},
		};
		$http(req).then(function(resData){
			$scope.houseInfo=resData.data;
		})
	}
	// 删除
	$scope.deleteEvaluation=function(item){
		var confirmPopup = $ionicPopup.confirm({
	        title: '确定删除？',
            cancelText: '取消',
            okText: '删除'
	     });
     	confirmPopup.then(function(res){
	        if(res) {
				$http.post($Factory.Evalu.delete.url,item)
				.then(function(resData){
					$scope.loadEvaluationList()
				}).catch(function(){
					enterViewLoad.customload('删除失败')
				})
	        } else {
	         
	        }
     	});
	}

	
})