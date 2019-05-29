angular.module('App').controller('waitForCommentCtl',function($waitForCommentData,enterViewLoad,appUtils,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back()
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
	})
	// 加载数据
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
				return item.OrderStatus==104 || item.OrderStatus==105
			});
	}

	$scope.addOrderManage=function(){

	}

	$scope.goPublishComment=function(group,item){
		$waitForCommentData.data.TradeNo=group.TradeNo;
		$waitForCommentData.data.productInfo=item;
		$state.go('publishComment');
	}

	$scope.deleteOrder = function(item){
		var confirmPopup = $ionicPopup.confirm({
		   title: '确定删除订单？',
		   cancelText: '取消',
		   okText: '确认'
	   	});
		// $scope.deleteOrder=function(){}
		confirmPopup.then(function(res){
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
.factory('$waitForCommentData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
		// 分享链接 站点
		data:{
			TradeNo:null,
			productInfo:null
		}   
	};

	return new Util();
}]);