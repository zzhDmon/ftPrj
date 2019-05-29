angular.module('App').controller('thirdGuessPriceCtl',function(enterViewLoad,appUtils,$ionicPopup,$localStorage,$http,$Factory,$state,$stateParams,$scope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid

	var myChart = echarts.init(document.getElementById('third_guess_price_echarts'),'light');
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
			//    { name: '安全性好', max: 400},
			//    { name: '差评率', max: 400},
			//    { name: '好评率', max: 400},
			//    { name: '交通便利', max: 400},
			//    { name: '环境好', max: 400},
			//    { name: '学区房', max: 400}
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
	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadCommList()
		$scope.loadHouseInfo()
	})
	
	$scope.myselfInfo=$localStorage.myselfInfo;

	$scope.loadCommList=function(){
		var req={
			method:'POST',
			url:$Factory.Evalu.list.url+'?houseId='+$scope.houseId+'&type=1',
			headers: {
				'Content-Type': 'application/json'					
			  },	
		}
		$http(req).then(function(resData){
			$scope.commentList=resData.data
		}).catch(function(){
			enterViewLoad.customload('获取估价列表失败')
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
	$scope.deleteComment=function(item){
		var confirmPopup = $ionicPopup.confirm({
	        title: '确定删除？',
            cancelText: '取消',
            okText: '删除'
	     });
     	confirmPopup.then(function(res){
	        if(res) {
				var req={
					method:'POST',
					url:$Factory.Evalu.delete.url,
					headers: {
						'Content-Type': 'application/json'					
					},
					data:item	
				}
				$http(req).then(function(resData){
					$scope.loadCommList()
				}).catch(function(){
					enterViewLoad.customload('删除失败')
				})
	        } else {
	         
	        }
     	});
		
	}

	$scope.actionDo=function(item,agree,disagree,tips){
		var subItem = item
		subItem.AgreeNum=subItem.AgreeNum+agree
		subItem.DisAgreeNum=subItem.DisAgreeNum+disagree
		subItem.Tips=subItem.Tips+tips
		var req={
			method:'POST',
			url:$Factory.Evalu.reply.url,
			headers: {
				'Content-Type': 'application/json'					
			},
			data:subItem
		}
		$http(req).then(function(resData){
			enterViewLoad.customload('操作成功')
			$scope.loadEvaluationList()
		}).catch(function(err){
			if(err.status==400){
				enterViewLoad.customload('你的估价！')
			}
		})
	}
	
})