angular.module('App').controller('withDrawCtl',function(enterViewLoad,appUtils,$ionicPopup,$location,$localStorage,$rootScope,$ionicHistory,$timeout,$scope,$state,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		// 余额
		$http.post($Factory.Money.money.url)
			.then(function(resData){
				$scope.myBalance=((resData.data.Total)/100).toFixed(2);
			}).catch(function(err){

			})
	})
	$scope.subData={
		money:''
	}
	

	$scope.choosedBankCard=$localStorage.choosedPayBankCard
	$rootScope.$on('chooseBankCardSuccess',function(target,value){
		$scope.choosedBankCard=value;
	})
	
	
	

// 提现
	$scope.drawNow=function (params){
		if(!$scope.choosedBankCard){
			enterViewLoad.customload('请选择银行卡')
			return
		}
		
		if(($scope.myBalance*1) < $scope.subData.money){
			enterViewLoad.customload('余额不足')
			return
		}
		var bindConfirmPopup= $ionicPopup.confirm({
			title: '确定提现？',
			cancelText: '取消',
			okText: '确定'
		});
		bindConfirmPopup.then(function(res){
			if(res){
				$http.post($Factory.Allin.applydraw.url,{
					ProductId:13,
					Fee:($scope.subData.money.toFixed(2)*100),
					CardNo:$scope.choosedBankCard.bankCardNo,
				}).then(function(resData){
					if(resData.data.return_code=='SUCCESS'){
						enterViewLoad.customload('操作成功')
						$timeout(function(){
							$scope.back()
						},1500)
					}else{
						var msg = resData.data.return_msg || '操作失败'
						enterViewLoad.customload(msg)
					}
				}).catch(function(err) {
					var msg = err.data.Message || '操作失败'
					enterViewLoad.customload(msg)
				})
			}
		})
	}

})
