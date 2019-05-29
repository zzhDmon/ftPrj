
angular.module('App').controller('transferAccountsCtl',function(enterViewLoad,appUtils,$ionicPopup,$localStorage,$ionicModal,$rootScope,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.myselfInfo=$localStorage.myselfInfo

	$scope.targetId=$stateParams.id;
	nim.getUser({
		account: $scope.targetId,
		done: getUserDone,
		sync:true
	});
	function getUserDone(error, user){
		if (!error) {
			$scope.targetInfo=user
		}
	}

	$scope.ftId=null
	$http.get($Factory.Neteast.getftid.url+'?accid='+$stateParams.id)
		.then(function(res){
			$scope.ftId=res.data.UserId;
		}).catch(function(err){

		})
	// 是否设置密码 余额
	$scope.hasPassword=false
	$http.post($Factory.Money.ispassword.url).then(function(resData){
		if(resData.data || resData.data===0){
			$scope.hasPassword=true;
			$scope.leftMoney=resData.data;
		}else{
		}
		
	}).catch(function(){
	})

	$scope.subData={
		money:'',
	}

	$scope.pwdInput={
		value:null
	}

	$ionicModal.fromTemplateUrl('transfer_accounts_password_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
		$scope.inputPassword();
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.modal.remove()
	})

	$scope.inputPassword=function(){
		$('.transfer-accounts-password-modalview .password').on('input',function(){
			var value = $(this).val();
			var length = value.length;
			$('.transfer-accounts-password-modalview .showView').find('li').each(function(i){
				if(i < length){
					$(this).find('.circle').css({display: 'inline-block'});
				}else{
					$(this).find('.circle').hide();
				}
			})
		});
	}
	// 清空输入框点点
	$scope.clearPoint=function(){
		$('.transfer-accounts-password-modalview .showView').find('li').each(function(i){
			$(this).find('.circle').hide();
		})
	}
	// 密码只能整数
	$scope.inputPwd=function() {
		this.pwdInput.value = this.pwdInput.value.replace(/\D/g, '');
		$scope.pwdInput.value = this.pwdInput.value
	}

	// 节流
	var timeout;
    $scope.$watch('pwdInput.value', function(inputText){
    	if(inputText && inputText.length==6){
    		if(timeout) {
    			$timeout.cancel(timeout);
    		}
			timeout = $timeout(function(){
				$scope.passwordDone(inputText)
			},500)
    	}
	})

	// 点击下一步 判断密码余额
	$scope.nextStep=function(){
		if(!$scope.hasPassword){
			// 未设置密码
			var confirmPopup = $ionicPopup.confirm({
				title: '未设置密码,前往设置？',
				cancelText: '取消',
				okText: '确定'
			});
			
			confirmPopup.then(function(res) {
				if(res) {
					$state.go('setPayPassword')
					return
				}else{
					return
				}
			});
			return
		}
		if($scope.leftMoney<($scope.subData.money.toFixed(2)*100)){
			enterViewLoad.customload('余额不足')
			return
		}
		$scope.showModal()
	}

	$scope.passwordDone=function(password){
		$scope.pwdInput.value=null;
		$scope.clearPoint()
		$scope.closeModal();
		var fee = $scope.subData.money.toFixed(2)*100;
		$http.post($Factory.Money.transfer.url+'?toUserId='+$scope.ftId+'&fee='+fee+'&pwd='+password)
			.then(function(resData){
				// 发送自定义转账
				var content = {
					type: 103,
					data:{
						redPacketId: $scope.targetId,
						title:'房田红包',
						text:'转账',
						moneyNum: fee,
						TradeNo: resData.data.TradeNo,
						OTradNo: resData.data.OTradNo,
						bTaken: false
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
			}).catch(function(err){
				if(err.data.Message&&err.data.Message=='原密码错误'){
					enterViewLoad.customload('密码错误')
				}else{
					enterViewLoad.customload('操作失败')
				}
			})
	}
})
