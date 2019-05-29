angular.module('App').controller('myMallOrdersCtl',function(enterViewLoad,appUtils,$localStorage,$ionicScrollDelegate,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back()
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.orderStatus=$stateParams.type || 0;
		$scope.switchTo=function(index){
			$scope.orderStatus=index;
			$scope.statusFilter()
			$ionicScrollDelegate.scrollTop();
		}
		$scope.loadData()
	})
	
	// 订单列表
	$scope.resData=[]
	$scope.orderList=[]
	$scope.loadData=function(){
		$http.post($Factory.ProductOrder.orderquery.url)
		.then(function(resData){
			$scope.resData=resData.data
			$scope.statusFilter()
		}).catch(function(){
			enterViewLoad.customload('获取订单列表失败')
		})
	}
	
	$scope.statusFilter=function(){
		$scope.orderList=$scope.resData.filter(function(item){
				item.groupTotalNum=0
				item.groupTotalMoney=0
				var groupTotalNum,groupTotalMoney
				groupTotalNum=0,groupTotalMoney=0
				for(var i=0;i<item.Items.length;i++){
					groupTotalNum = groupTotalNum+item.Items[i].Quantity
					groupTotalMoney = groupTotalMoney+item.Items[i].SubTotal
				}
				item.groupTotalNum=groupTotalNum
				item.groupTotalMoney=groupTotalMoney
				// 过滤
				if($scope.orderStatus==100){
					return item.OrderStatus==100
				}else if($scope.orderStatus==101){
					return item.OrderStatus==101 || item.OrderStatus==102 || item.OrderStatus==103
				}else if($scope.orderStatus==104){
					return item.OrderStatus==104 || item.OrderStatus==105
				}else if($scope.orderStatus==400){
					return item.OrderStatus==400
				}else{
					return item
				}
			});
	}

	$scope.confirmReceipt=function(item){
		var confirmPopup = $ionicPopup.confirm({
			title: '确定收货钱将转入商家！',
			cancelText: '取消',
			okText: '确认'
		});
		
		confirmPopup.then(function(res) {
			if(res) {
				$http.post($Factory.ProductOrder.status.url+'?TradeNo='+item.TradeNo,104)
					.then(function(resData){
						enterViewLoad.customload('操作成功')
						$scope.loadData();
					}).catch(function(){
						enterViewLoad.customload('操作失败')
					})
			}else{
					
			}
		});
	}
	
	$scope.deleteOrder = function(item){
		var confirmPopup = $ionicPopup.confirm({
		   title: '确定删除订单？',
		   cancelText: '取消',
		   okText: '确认'
	   	});
		
		confirmPopup.then(function(res) {
			if(res) {
				$http.post($Factory.ProductOrder.status.url+'?TradeNo='+item.TradeNo,444)
					.then(function(resData){
						enterViewLoad.customload('操作成功')
						$scope.loadData();
					}).catch(function(){
						enterViewLoad.customload('操作失败')
					})
			}else{
				
			}
		});
   	};
})