angular.module('App').controller('agencyAgreementCtl',function(NimUtils,appUtils,enterViewLoad,$timeout,$localStorage,$rootScope,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.agencyType=$stateParams.agencytype;
	$scope.headTitle=$stateParams.agencytype==1?'独家代理协议':'多家代理协议'
	
	$scope.$on('$ionicView.enter',function(){
		// 房源信息
		$http.post($Factory.NewHouseSource.postdetail.url+'/'+$stateParams.houseid)
			.then(function(resData){
				$scope.agentHouseInfo=resData.data.house
				$scope.ownerInfo=resData.data.info;
				// 获取聊天账号
				$http.post($Factory.Neteast.user.url+'?id='+$scope.ownerInfo.uid).then(function(resData){
					if(resData.data.return_code=="SUCCESS"){
						$scope.targetId=resData.data.return_msg.accid;
					}else{
						enterViewLoad.customload(resData.data.return_msg)
					}
				}).catch(function(){
					enterViewLoad.customload('用户未开通微聊')
				})
			}).catch(function(){
				enterViewLoad.customload('获取房源信息失败')
			})
	})

	$rootScope.$on('changeAgreementStatus',function(target,value){
		$scope.subData.isAgree=value;
	})



	$scope.subData={
		agencyPrice:'',
		agencyCommision:'',
		beginTime:'',
		endTime:'',
		agencyAddition:'',
		isAgree:0
	}
	$scope.changeAgree=function(){
		if($scope.subData.isAgree){
			$scope.subData.isAgree=0
		}else{
			$scope.subData.isAgree=1
		}
	}

		
	$scope.save=function(){
		if(NimUtils.myselfInfo.account==$scope.targetId){
			enterViewLoad.customload('你自己的房源')
			return
		}else if($scope.subData.isAgree!==1){
			enterViewLoad.customload('协议未同意')
			return
		}else if(!$scope.subData.agencyPrice){
			enterViewLoad.customload('请输入代理价格')
			return
		}else if(!$scope.subData.agencyCommision){
			enterViewLoad.customload('请输入代理佣金')
			return
		}else if(!$scope.subData.beginTime||!$scope.subData.endTime){
			enterViewLoad.customload('请输入代理期限')
			return
		}else{
			
		}
		$http.post($Factory.HouseProxy.applicant.url,{
				HouseId:$stateParams.houseid,
				UserId:$localStorage.myselfInfo.Id,
				Price:$scope.subData.agencyPrice,
				Commision:$scope.subData.agencyCommision,
				Remark:$scope.subData.agencyAddition,
				BeginTime:$scope.subData.beginTime,
				EndTime:$scope.subData.endTime,
				Status:1
			}).then(function(resData){
				enterViewLoad.customload('申请成功')
				// 发送房源申请
				var content = {
					type: 105,
					data:{
						houseId:$stateParams.houseid,
						userId:$localStorage.myselfInfo.Id,
						houseImage:$scope.agentHouseInfo.IndoorShowImages[0],
						houseTitle:$scope.agentHouseInfo.Title,
						housePrice:$scope.agentHouseInfo.Price,
						houseType:$scope.agentHouseInfo.Type,
					}
				};
				nim.sendCustomMsg({
					scene: 'p2p',
					to: $scope.targetId,
					content: JSON.stringify(content),
					done: sendMsgDone
				});
				function sendMsgDone(error,msg){
					if(error){
						enterViewLoad.customload('消息发送失败')
					}	
				}
				$timeout(function(){
					$scope.back()
				})
			}).catch(function(){
				enterViewLoad.customload('申请失败')
			})
	
	}	

	
})