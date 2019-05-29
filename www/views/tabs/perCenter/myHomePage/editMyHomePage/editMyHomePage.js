
angular.module('App').controller('editMyHomePageCtl',function(NimUtils,appUtils,enterViewLoad,$ionicSlideBoxDelegate,$rootScope,$ionicHistory,$ionicPopover,$ionicActionSheet,$ionicPopup,$http,$Factory,$scope,$state,$stateParams,$timeout,WechatService,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.myInfoChange=function(){
		if(!$scope.myInfo.IsShowPhone){
			var confirmPopup = $ionicPopup.confirm({
				title: '隐藏后，联系人详情将不展示该信息？',
				cancelText: '取消',
				okText: '确认'
			});
			confirmPopup.then(function(res) {
				if(res) {

				}else{
					$scope.myInfo.IsShowPhone=true
				}
			})
		}
	}

	$scope.blockChange=function(item){
		if(!$scope.myInfo.ShowConfig[item]){
			var confirmPopup = $ionicPopup.confirm({
				title: '隐藏后，联系人详情将不展示该信息？',
				cancelText: '取消',
				okText: '确认'
			});
			confirmPopup.then(function(res) {
				if(res) {

				}else{
					$scope.myInfo.ShowConfig[item]=true
				}
			})
		}
	}
	
	$scope.$on('$ionicView.enter',function(){
		var initialState={
			showMySex:true,
			showMyJob:true,
			showMyChoosePrefer:true,
			showMyHouse:true,
			showMyNeed:true,
			showMyEvaluation:true,
			showMyRecruitment:true,
			showMyShop:true,
			showMyTask:true,
		}
		
		$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				// 原来是否有配置
				resData.data.ShowConfig=JSON.parse(resData.data.ShowConfig) || initialState
				if(resData.data.VStatus==2){
					resData.data.Name = resData.data.Name?resData.data.Name+'(已实名)' : '(已实名)'
				}else if(resData.data.VStatus==1){
					resData.data.Name += '(审核中)'
				}else{
					resData.data.Name += '-(未实名)'
				}
				$scope.myInfo=resData.data;	
			}).catch(function(err){
				
			})
	
		$scope.save=function(){
			var realData=JSON.parse(JSON.stringify($scope.myInfo))
			realData.ShowConfig=JSON.stringify(realData.ShowConfig)
			
			$http.post($Factory.Account.setuserinfo.url,realData).then(function(){
				enterViewLoad.customload('保存成功')
				$timeout(function(){
					$scope.back();
				},1500)
			}).catch(function(){
			})

			// 云信
			var nimgender = 'male'
			if($scope.myInfo.Sex=='男'){
				nimgender='male'
			}else if($scope.myInfo.Sex=='女'){
				nimgender='female'
			}else{
				nimgender='unknown'
			}
			nim.updateMyInfo({
				tel: $scope.myInfo.UserName,
				gender: nimgender
			});
			function updateMyInfoDone(error, user) {
				if (!error) {
					NimUtils.updateMyInfo()
				}
			}
		}
	});

	
})
