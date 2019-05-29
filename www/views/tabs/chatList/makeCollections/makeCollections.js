
angular.module('App').controller('makeCollectionsCtl',function(enterViewLoad,appUtils,$localStorage,$ionicModal,$rootScope,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.pageType=$stateParams.type
	if($stateParams.type==103){
		// 转账
		$scope.headTitle='接收转账'
	}else{
		$scope.headTitle='接收红包'
	}

	$scope.targetId=$stateParams.fromid
	$scope.type=$stateParams.type
	$scope.fee=($stateParams.fee/100).toFixed(2)
	$scope.tradeno=$stateParams.tradeno
	$scope.otradno=$stateParams.otradno
	
	// 对方信息
	nim.getUser({
		account: $scope.targetId,
		done: getUserDone,
		sync:true
	});
	function getUserDone(error, user){
		if (!error) {
			$timeout(function(){
				$scope.targetInfo=user;
			})
		}
	}

	$scope.inCome=function(){
		$http.post($Factory.Money.income.url
			+'?TradeNo='+
			$stateParams.tradeno
			+'&OTradNo='+
			$stateParams.otradno).then(function(res){
				if(res.status==200){
					// 收转账红包
					var content = {
						type: $stateParams.type==103 ? 104 : 102,
						data: {
							text: $stateParams.type==103 ? '接收转账' : '领取红包',
						}
					};
					nim.sendCustomMsg({
						scene: 'p2p',
						to: $scope.targetId,
						content: JSON.stringify(content),
						done: sendMsgDone
					});
					function sendMsgDone(error,msg){
					}
					enterViewLoad.customload('操作成功')
					$timeout(function(){
						$scope.back()
					},1500)
				}else if(res.status==202){
					var loadtext = $stateParams.type==103 ? '已接收过的转账':'已接收过的红包'
					enterViewLoad.customload(loadtext)
				}
			}).catch(function(err){
				enterViewLoad.customload('操作失败')
			})
	}

})
