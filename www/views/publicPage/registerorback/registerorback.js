angular.module('App').controller('RegisterorbackController',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicModal,wechatLinkBase,$rootScope,$interval,$timeout,$ionicHistory,$http,$Factory,$stateParams,$scope,$state,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	// 键盘高度
	appUtils.saveKeyboardHeight()

	$scope.name = $stateParams.name;
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.endCountDownNum()
	})
	
	$scope.registerAgree={
		agree:true
	}
	$scope.submitData={
		Phone:'',
		Password:'',
		ConfirmPassword:'',
		Code:'',
		Name:'',
		ParPhone:''
	}
	$scope.submitForgotData={
		Phone:'',
		Code:'',
		NewPassWord:''
	}

	
	//验证码倒计时 
	$scope.showCountDown=false;
	$scope.countDownNum=90;
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
			$scope.countDownNum=90;
			$interval.cancel($scope.clock);
		}
	}
	//验证码请求
	$scope.yzcode=function($event,phoneParams){
		var sMobile = phoneParams;
	    if(!(/^1[34578]\d{9}$/.test(sMobile))){ 
			enterViewLoad.customload('请输入正确的手机号码');
	        return false; 
	    } 
		
		$scope.startCountDown()
		
		var req = {
			method: 'POST',
			url: $Factory.Account.msg.url+'?phone='+ phoneParams,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		};
		$http(req).then(function(resData){
			enterViewLoad.customload('发送成功');
		}).catch(function(err){
			$scope.endCountDownNum()
			enterViewLoad.customload('发送失败');	
		});
	}
	
	
	$ionicModal.fromTemplateUrl('register_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	$scope.$on('modal.hidden', function() {
		if(!$scope.clicknextStep){
			$rootScope.$ionicGoBack();
		}
	});

	// 获取个人信息
	$scope.getuserInfo=function(){
		$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				$localStorage.myselfInfo=resData.data;
				// 初始化网易云信
				$http.post($Factory.Neteast.user.url+'?id=').then(function(resData){
					if(resData.data.return_code=="SUCCESS"){
						$localStorage.myNimAccount=resData.data.return_msg
						NimUtils.init(resData.data.return_msg)
					}else{
						enterViewLoad.customload(resData.data.return_msg)
					}
				})

			}).catch(function(err){
					
			})
	}
	//点击完成
	$scope.Done=function(){
		if($scope.name=="注册"){
			if($scope.submitData.Password!=$scope.submitData.ConfirmPassword){
				enterViewLoad.customload('两次密码输入不一致');
				return
			}
			if(!$scope.registerAgree.agree){
				enterViewLoad.customload('您还未接受房田用户协议');
				return
			}
			// $scope.submitData.Code=062729
			$http.post($Factory.Account.register.url,$scope.submitData)
			.then(function(resData){
				enterViewLoad.customload('注册成功');
				var req={
					method: 'POST',
					url: $Factory.Account.login.url,
					dataType: "json",
					headers: {
						  'Content-Type':'application/x-www-form-urlencoded'
					},
					data: "grant_type=password&"+"username="+$scope.submitData.Phone+'&'+"Password="+$scope.submitData.Password			
			   	}
			   	$http(req).then(function(resData){
					$localStorage.access_token=resData.data.access_token;		
					// 极光注册登录
					$scope.getuserInfo();
			   	})
				$timeout(function(){
					$scope.modal.show();
				},1500);
				$scope.nextStep=function(){
					$scope.clicknextStep=true;
					var req = {
						method: 'POST',
						url: $Factory.Account.login.url,
						dataType: "json",
						headers: {
							'Content-Type':'application/x-www-form-urlencoded'
						},
						data: "grant_type=password&"+"username="+$scope.submitData.Phone+'&'+"Password="+$scope.submitData.Password			
					}
					$http(req).then(function(resData){

						$localStorage.access_token=resData.data.access_token;
						$state.go('CompleteInfo');
					})
					$scope.closeModal();
				}
				$scope.cancelNext=function(){
					$scope.closeModal();
					$rootScope.$ionicGoBack();
				}
			})
			.catch(function(resData){
				enterViewLoad.customload(resData.data.Message);
				$scope.endCountDownNum()
			});
		}
		else{
			//找回（修改）密码
			$http.post($Factory.Account.forgotpwd.url,$scope.submitForgotData)
			.then(function(resData){
				enterViewLoad.customload('修改成功');
				$timeout(function(){
					$rootScope.$ionicGoBack();
				},1500)
					
			}).catch(function(err){
				enterViewLoad.customload(err.data.Message);
				$scope.endCountDownNum()
			});
		}
	}
});

