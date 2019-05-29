angular.module('App').controller('addressListCtl',function(appUtils,enterViewLoad,$ionicPopup,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
	})
	$scope.loadData=function(){
		$http.post($Factory.UserAddress.query.url).then(function(resData){
			$scope.addressList=resData.data
		}).catch(function(){
			enterViewLoad.customload('获取地址列表失败')
		})
	}
	// 选择地址
	$scope.chooseAddress=function(item){
		appUtils.receiptAddress=item
		$scope.back();
		if($rootScope.fromStateName=='confirmOrder'){
		}
	}
	
	$scope.goShipping=function(item,$event){
		$event.stopPropagation();
		$state.go('shippingAddress',{
			id:item.Id,
			province:item.Province,
			city:item.City,
			district:item.District})
	}
	$scope.deleteAdr = function(item,$event){
		$event.stopPropagation();
		var confirmPopup = $ionicPopup.confirm({
			title: '确定删除该地址？',
			cancelText: '取消',
			okText: '确认'
	   	});
	   
		confirmPopup.then(function(res) {
		   if(res) {
			$http.post($Factory.UserAddress.delete.url+'?id='+item.Id)
				.then(function(resData){
					$scope.loadData()
					if(item.Id===appUtils.receiptAddress.Id){
						appUtils.receiptAddress=null
					}
				}).catch(function(err){
					var msg = (err.data&&err.data.Message) || '删除失败'
					enterViewLoad.customload(msg)
				})
		   }else{
			
		   }
		});
   };
})

