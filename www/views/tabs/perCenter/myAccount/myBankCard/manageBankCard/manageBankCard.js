
angular.module('App').controller('manageBankCardCtl',function(enterViewLoad,appUtils,$ionicPopup,$ionicActionSheet,$rootScope,$ionicHistory,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){		
		$http.post($Factory.Allin.querycards.url+'?CardNo='+$stateParams.cardnumber)
		.then(function(resData){
			if(resData.data.return_code=="SUCCESS"){
					$scope.cardList=resData.data.return_msg.bindCardList
				}else{
					enterViewLoad.customload(resData.data.return_msg);
				}
			}).catch(function(){
				enterViewLoad.customload('获取卡信息失败');
			})
	})

	$scope.showAction =function(item) {
		var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '解绑' },
            //   { text: '设置为安全卡' },
            ],
			cancelText: '取消',
            cancel: function() {
               
            },
            buttonClicked: function(index) {
				hideSheet();
				if(index==0){
					var confirmPopup = $ionicPopup.confirm({
						title: '确定解绑？',
						cancelText: '取消',
						okText: '解绑'
					 });
					 confirmPopup.then(function(res){
						if(res) {
							$http.post($Factory.Allin.unbindcard.url+'?CardNo='+item.bankCardNo)
								.then(function(resData){
									if(resData.data.return_code=='SUCCESS'){
										enterViewLoad.customload('解绑成功');
										$timeout(function(){
											$scope.back();
										},1500)
									}else{
										enterViewLoad.customload(resData.data.return_msg);
									}
								}).catch(function(){
									enterViewLoad.customload('解绑失败');
								})
						}else{
						}
					});
				}else if(index==1){
					var confirmPopup = $ionicPopup.confirm({
						title: '设为安全卡？',
						cancelText: '取消',
						okText: '确定'
					 });
					 confirmPopup.then(function(res){
						if(res) {
							$http.post($Factory.Allin.setsafecard.url+'?CardNo='+item.bankCardNo)
								.then(function(resData){
									if(resData.data.return_code=='SUCCESS'){
										enterViewLoad.customload('设置成功');
										$timeout(function(){
											$scope.back();
										},1500)
									}else{
										enterViewLoad.customload(resData.data.return_msg);
									}
								}).catch(function(){
									enterViewLoad.customload('设置失败');
								})
						}else{
						}
					});
				}
			}
        });


    };

	
})

