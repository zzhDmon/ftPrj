
angular.module('App').controller('changeInfoCtl',function(NimUtils,appUtils,enterViewLoad,$timeout,$ionicHistory,$ionicLoading,$rootScope,$http,$Factory,$scope,$stateParams,$ionicActionSheet){
	$timeout(function(){
		$('.radio-content i.radio-icon').removeClass('ion-checkmark icon')
		$('.radio-content i.radio-icon').addClass('iconfont icon-xuanze')
	})	
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.name = $stateParams.name
	$scope.clientSideList = [
		{ text: "男", value:"男" },
		{ text: "女", value: "女" }
		];
		      
    $scope.$on('$ionicView.enter',function(){
		$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.userinfo=resData.data;
		}).catch(function(err){
		})	
    })
	
    $scope.save=function(){
		$http.post($Factory.Account.setuserinfo.url,$scope.userinfo)
			.then(function(resData){
				if($scope.name=='修改昵称'){
					nim.updateMyInfo({
						nick:  $scope.userinfo.NickName,
						done: updateMyInfoDone
					});
					function updateMyInfoDone(error, user) {
						if (!error) {
							NimUtils.updateMyInfo()
						}
					}
				}else if($scope.name=='修改性别'){
					if($scope.userinfo.Sex=='男'){
						$scope.NimSex='male'
					}else if($scope.userinfo.Sex=='女'){
						$scope.NimSex='female'
					}else{
						$scope.NimSex='unknown'
					}
					nim.updateMyInfo({
						gender:  $scope.NimSex,
						done: updateMyInfoDone
					});
					function updateMyInfoDone(error, user) {
						if (!error) {
							NimUtils.updateMyInfo()
						}
					}
				}else if($scope.name=='个性签名'){
					nim.updateMyInfo({
						sign:  $scope.userinfo.Discription,
						done: updateMyInfoDone
					});
					function updateMyInfoDone(error, user) {
						if (!error) {
							NimUtils.updateMyInfo()
						}
					}
				}
				enterViewLoad.customload('修改成功')
				$timeout(function(){
					$rootScope.$ionicGoBack();
				},1500)
			},function(err){
					enterViewLoad.customload('修改失败')
			})

    }
});
