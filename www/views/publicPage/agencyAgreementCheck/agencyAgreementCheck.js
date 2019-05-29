angular.module('App').controller('agencyAgreementCheckCtl',function(appUtils,enterViewLoad,$timeout,$localStorage,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	};
	
	$scope.targetId=$stateParams.account;
	$scope.houseId=$stateParams.houseid;
	$scope.userId=$stateParams.userid
	$scope.sendText=function(status){
		// 申请审核 提醒消息
		nim.sendTipMsg({
			scene: 'p2p',
			to: $scope.targetId,
			tip: status==0?'通过代理 '+$scope.agreementInfo.House.Title+' 申请':'拒绝代理 '+$scope.agreementInfo.House.Title+' 申请',
			done: sendMsgDone
		});
		function sendMsgDone(error,msg){
			if(error){
				enterViewLoad.customload('发送审核消息失败')
			}
		}
	}
	
	$scope.$on('$ionicView.enter',function(){
		// 代理信息
		$http.get($Factory.HouseProxy.ownerget.url,{params:{UserId:$stateParams.userid,HouseId:$stateParams.houseid}})
			.then(function(resData){
				$scope.agreementInfo=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取代理信息失败')
			})
		// 代理审核
		$scope.checkAgency=function(status){
			$http.post($Factory.HouseProxy.verify.url,{
				HouseId:$stateParams.houseid,
				UserId:$stateParams.userid,
				Status:status
			}).then(function(resData){
				enterViewLoad.customload('操作成功')
				$scope.sendText(status)
				$timeout(function(){
					$scope.back();	
				},1500)
			}).catch(function(){
				enterViewLoad.customload('操作失败')
			})
		}
	})
	
})