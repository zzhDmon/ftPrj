
angular.module('App').controller('myBankCardCtl',function(enterViewLoad,appUtils,$localStorage,$rootScope,$ionicHistory,$timeout,$scope,$state,$stateParams,$http,$Factory){	
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){		
		$http.post($Factory.Allin.querycards.url+'?CardNo='+"ALL")
		.then(function(resData){
				if(resData.data.return_code=="SUCCESS"){
					$scope.cardList=resData.data.return_msg.bindCardList.filter(function(item){
						item.bankName = item.bankName.substr(item.bankName.length-4)
						return item
					})
				}else{
					enterViewLoad.customload(resData.data.return_msg);
				}
			}).catch(function(err){
				if(err.status==500){
					enterViewLoad.customload('还未实名绑卡');
				}else{
					enterViewLoad.customload('获取列表失败');
				}
			})
	})

	$scope.chooseCard=function(item){
		if($stateParams.actiontype=='action'){
			$state.go('manageBankCard',{cardnumber:item.bankCardNo})
		}else if($stateParams.actiontype=='choosebankcard'){
			$rootScope.$emit('chooseBankCardSuccess',item);
			$localStorage.choosedPayBankCard=item;
			$scope.back();
		}
	}
})

