angular.module('App').controller('visitDoneCtl',function(wechatLinkBase,upImgBase,appUtils,$rootScope,$http,$Factory,$state,$stateParams,$scope,$timeout,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};
	
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
	
	

	$('#visit_done .choose-img-click').on('click','.img',function(){
		$(this).next().click();
	});
	$('#visit_done .choose-img-click').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			var req={
				method: 'POST',
				url: $Factory.Account.upload.url,
				headers: {
				  'Content-Type': 'application/json'					
				},
			   data:{path:'18/visitDone',file:base}				
			}
			$http(req).then(function(resData){
				$scope.detailData.ShowLookImage.push(resData.data.view);
				$scope.detailData.LookImage.push(resData.data.url);	
			})
		})
	});
	//点击叉号去除
	$scope.remove=function(index){
		$scope.detailData.LookImage.splice(index,1)
		$scope.detailData.ShowLookImage.splice(index,1);
	}

	$scope.save=function(){
		if($scope.detailData.LookImage.length<1){
			$ionicLoading.show({
				template:'请至少选择一张图片',
				duration:1500
			})
			return
		}
		var req={
			method:'POST',
			url:$Factory.NewHouseTrade.looked.url,
			headers: {
				'Content-Type': 'application/json'					
			  },
			data:$scope.detailData
		}

		$http(req).then(function(res){
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

	}
	
})