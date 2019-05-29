
angular.module('App').controller('bindBankCardCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$rootScope,$ionicHistory,$timeout,$scope,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.endCountDownNum()
	})
	$scope.$on('$ionicView.enter',function(){
		$scope.stepNumber=1;
		$scope.checkUser=function(){
			$http.post($Factory.Allin.checkuser.url)
				.then(function(resData){
					if(resData.data.return_code=='SUCCESS'){
						$scope.userInfo=resData.data.return_msg.memberInfo;
						// 绑定银行卡持卡人信息
						$scope.cardData.Name=resData.data.return_msg.memberInfo.name
						$scope.cardData.IdentityNo=resData.data.return_msg.memberInfo.identityCardNo
						if($scope.userInfo.isPhoneChecked && !$scope.userInfo.isIdentityChecked){
							$scope.stepNumber=2;
						}else if($scope.userInfo.isPhoneChecked && $scope.userInfo.isIdentityChecked){
							$scope.stepNumber=3;
						}else{}
					}else{
						enterViewLoad.customload('检测用户失败')
					}
				}).catch(function(){
					enterViewLoad.customload('检测用户失败')
				})
		}
		$scope.checkUser()
		// bind手机
		$scope.bindphoneData={
			phone:'',
			code:''
		}
		$scope.bindPhone=function(){
			$http.post($Factory.Allin.bindphone.url+'?Phone='+$scope.bindphoneData.phone+'&Code='+$scope.bindphoneData.code)
				.then(function(resData){
					if(resData.data.return_code=='FAIL'){
						enterViewLoad.customload(resData.data.return_msg)
					}else{
						$scope.endCountDownNum()
						if($scope.userInfo.isIdentityChecked){
							$scope.stepNumber=3;
						}else{
							$scope.stepNumber=2;
						}
					}
				}).catch(function(){
					enterViewLoad.customload('绑定失败')
				})
		}
		// 实名
		$scope.setnameData={
			name:'',
			idNumber:''
		}
		$scope.setName=function(){
			$http.post($Factory.Allin.setname.url+'?Name='+$scope.setnameData.name+'&IdNo='+$scope.setnameData.idNumber)
				.then(function(resData){
					if(resData.data.return_code=='FAIL'){
						enterViewLoad.customload(resData.data.return_msg)
					}else{
						$scope.checkUser()
						$scope.stepNumber=3;
					}
				}).catch(function(){
					enterViewLoad.customload('实名失败')
				})
		}

		// 绑定银行卡
		$scope.cardData={
			CardNo:'',
			Phone:'',
			Name:'',
			IdentityNo:'',
			Validate:'',
			Cvv2:'',
			IsSafeCard:'',
			UnioBank:''
		}
		$scope.applyBindCard=function(){
			if(!$scope.cardData.Name){
				enterViewLoad.customload('请输入姓名',1000);
				return
			}if(!$scope.cardData.CardNo){
				enterViewLoad.customload('请输入卡号',1000);
				return
			}if(!$scope.cardData.IdentityNo){
				enterViewLoad.customload('请输入身份证号',1000);
				return
			}else if(!$scope.cardData.Phone){
				enterViewLoad.customload('请输入电话',1000);
				return
			}
			

			$http.post($Factory.Allin.applybindcard.url,$scope.cardData)
				.then(function(resData){
					if(resData.data.return_code=='FAIL'){
						enterViewLoad.customload(resData.data.return_msg)
					}else{				
						$scope.startCountDown();
						resData.data.return_msg=JSON.parse(resData.data.return_msg)
						$scope.confirmcardData.TranceNum=resData.data.return_msg.tranceNum
						$scope.confirmcardData.TransDate=resData.data.return_msg.transDate || ''
						$scope.confirmcardData.Phone=$scope.cardData.Phone
					}
				}).catch(function(){
					enterViewLoad.customload('获取验证码失败');
					$scope.endCountDownNum();
				})
		}
		// 确认绑定银行卡
		$scope.confirmcardData={
			TranceNum:'',
			TransDate:'',
			Phone:'',
			Code:'',
			ResetPwd:false
		}
		$scope.confirmBindCard=function(){
			$scope.confirmcardData.ResetPwd = $stateParams.isreset ? true : false;
			
			$http.post($Factory.Allin.bindcard.url,$scope.confirmcardData)
				.then(function(resData){
					if(resData.data.return_code=='FAIL'){
						enterViewLoad.customload(resData.data.return_msg)
					}else{
						enterViewLoad.customload('操作成功');
						$scope.endCountDownNum();
						$timeout(function(){
							$scope.back();
						},1500)
					}
				}).catch(function(){
					enterViewLoad.customload('绑定失败');
					$scope.endCountDownNum();
				})
		}
	})

	$scope.sendMsg=function(phone){
		$http.post($Factory.Allin.sendmsg.url+'?Phone='+phone)
			.then(function(resData){
				if(resData.data.return_code=='SUCCESS'){
					$scope.startCountDown()
				}else{
					enterViewLoad.customload(resData.data.return_msg)
				}
			}).catch(function(){
				enterViewLoad.customload('发送失败')
				$scope.endCountDownNum()
			})
	}

	

//验证码倒计时 
	$scope.showCountDown=false;
	$scope.countDownNum=60;
	
	$scope.startCountDown=function(){
		$scope.showCountDown=true;
		$scope.clock = $interval(function(){
			$scope.countDownNum--
			if($scope.countDownNum<1){
				$scope.endCountDownNum()
			}
		},1000);
	}
	$scope.endCountDownNum=function(){
		$scope.showCountDown=false;
		if($scope.clock){
			$scope.countDownNum=60;
			$interval.cancel($scope.clock);
		}
	}

	

	var timeout;
    $scope.$watch('cardData.CardNo', function(inputText){
    	if(inputText){
    		if(timeout) {
    			$timeout.cancel(timeout);
    		}
			timeout = $timeout(function(){
				if(inputText.length>9){
					$http.get($Factory.Allin.getcardbin.url+'?CardNo='+inputText)
						.then(function(resData){
							if(resData.data.return_code=='SUCCESS'){
								resData.data.return_msg=JSON.parse(resData.data.return_msg)
								$scope.cardInfo=resData.data.return_msg.cardBinInfo;
							}else{
								enterViewLoad.customload('获取银行卡失败')
							}
						}).catch(function(){
							enterViewLoad.customload('获取银行卡失败')
						})
				}
			},400)
    	}
    })	
})
