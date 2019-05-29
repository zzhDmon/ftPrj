
angular.module('App').controller('groupRedPacketCtl',function(enterViewLoad,appUtils,$ionicPopup,$localStorage,$ionicModal,$rootScope,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	// $scope.myselfInfo=$localStorage.myselfInfo
	$scope.targetId=$stateParams.id;
	
	
	nim.getTeamMembers({
		teamId: $scope.targetId,
		done: getTeamMembersDone
	});
	function getTeamMembersDone(error, obj) {
		if (!error) {
			$scope.teamMembersNum=obj.members.length
		}
	}
	
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
		PerFee:0,  //单个金额 (固定金额)
		TotalFee:0, //总额 (拼手气)
		TotalNum:'',
		Type:1, //1 固定金额 2 拼手气
		message:''
	}
	$scope.perFeeChange=function(){
		if($scope.subData.Type == 1){
			// 普通红包 计算总额
			$scope.subData.TotalFee = $scope.subData.PerFee * $scope.subData.TotalNum;
			// 判断单个是否大于0.01
			if($scope.subData.PerFee<0.01){
				$scope.tooSmall=true;
			}else{
				$scope.tooSmall=false;
			}
		}else{
			// 拼手气 判断单个是否大于0.01
			if($scope.subData.TotalNum>0 && ($scope.subData.TotalFee / $scope.subData.TotalNum < 0.01)){
				$scope.tooSmall=true;
			}else{
				$scope.tooSmall=false;
			}
		}
	}
	$scope.numChange=function() {
		if(this.subData.TotalNum){
			this.subData.TotalNum = this.subData.TotalNum.replace(/\D/g, '');
			$scope.subData.TotalNum=this.subData.TotalNum;
		}
		$scope.perFeeChange()
	}

	$scope.changeType=function(type){
		$scope.subData.Type=type;
		$scope.subData.TotalFee = 0;
		$scope.subData.PerFee = 0;
	}

	$scope.pwdInput={
		value:null
	}

	$ionicModal.fromTemplateUrl('group_read_packer_password_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
		$scope.inputPassword()
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.modal.remove()
	})

	$scope.inputPassword=function(){
		$('.groupread-packer-password-modalview .password').on('input',function(){
			var value = $(this).val();
			var length = value.length;
			$('.groupread-packer-password-modalview .showView').find('li').each(function(i){
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
		$('.groupread-packer-password-modalview .showView').find('li').each(function(i){
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
		if($scope.subData.TotalNum<1){
			enterViewLoad.customload('红包个数不小于一个')
		}
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
				}else{
					return
				}
			});

			return false
		}
		if($scope.leftMoney<($scope.subData.TotalFee.toFixed(2)*100)){
			enterViewLoad.customload('余额不足')
			return
		}
		
		$scope.showModal()
	}

	$scope.passwordDone=function(password){
		$scope.pwdInput.value=null;
		$scope.clearPoint()
		$scope.closeModal();
		if($scope.subData.Type==1){
			// 固定金额
			var fee = $scope.subData.PerFee.toFixed(2)*100 * $scope.subData.TotalNum;
		}else{
			// 拼手气
			var fee = $scope.subData.TotalFee.toFixed(2)*100;
		}
		$http.post($Factory.Money.groupredpack.url, { 
			"TotalFee": fee, 
			"TotalNum": $scope.subData.TotalNum, 
			"Type": $scope.subData.Type, 
			"Password": password, 
		}).then(function(resData){
				// 发送自定义红包
				var content = {
					type: 101,
					data: {
						title:'房田红包',
						text: $scope.subData.message || '恭喜发财,大吉大利',
						TotalFee:resData.data.TotalFee,
						TotalNum:resData.data.TotalNum,
						Id:resData.data.Id,
						UserId:resData.data.UserId,
						Type:resData.data.Type,
						bTaken: false
					}
				};
				nim.sendCustomMsg({
					scene: 'team',
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
				enterViewLoad.customload(err.data.Message)
			})
	}
})
