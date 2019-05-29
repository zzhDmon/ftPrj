angular.module('App').controller('checkPageCtl',function(upImgBase,appUtils,$ionicPopup,$rootScope,$http,$Factory,$state,$stateParams,$scope,$timeout,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};

	$scope.showType=$stateParams.showtype

	var req={
		method:'POST',
		url:$Factory.NewHouseTrade.getdetail.url,
		headers: {
			'Content-Type': 'application/json'					
		},
		data:{ProxerId:$stateParams.proxerid,BuyerId:$stateParams.buyerid,NewHouseId:$stateParams.houseid}
	}
	$http(req).then(function(res){
		$scope.detailData=res.data
	})

	$scope.visitPass=function(){
		$scope.detailData.RecordStatus=4;
		$scope.subReq();
	}
	$scope.tradePass=function(){
		$scope.detailData.RecordStatus=6;
		$scope.subReq();
	}

	$scope.noPass=function(){
		$scope.detailData.RecordStatus=7;
		$scope.subReq();
	}

	$scope.subReq=function(){
		var confirmPopup = $ionicPopup.confirm({
	        title: '确定通过？',
            cancelText: '取消',
            okText: '确认'
	     });
     	confirmPopup.then(function(res) {
	        if(res) {
                var req={
					method:'POST',
					url:$Factory.NewHouseTrade.verify.url,
					headers: {
						'Content-Type': 'application/json'					
					  },
					data:$scope.detailData	
				}
				$http(req).then(function(resData){
					$ionicLoading.show({
						template:'提交成功',
						duration:1500
					})
					
					$timeout(function(){
						$rootScope.$ionicGoBack();
					},1500)
				}).catch(function(){
					$ionicLoading.show({
						template:'提交失败',
						duration:1500
					})
				})
	        } else {
	         
	        }
     	});

	}
	
})