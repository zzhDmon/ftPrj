angular.module('App').controller('bindRegisterController',function(NimUtils,appUtils,enterViewLoad,$localStorage,$rootScope,$interval,$timeout,$ionicHistory,$http,$Factory,$stateParams,$scope,$state,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}
	appUtils.saveKeyboardHeight()

	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.endCountDownNum()
	})
	$scope.registerAgree={
		agree:true
	}
	$scope.submitData={
		Phone:'',
		Password:'',
		Code:'',
		Name:'',
		ParPhone:''
	}
	

	//验证码倒计时 
	$scope.showCountDown=false;
	$scope.countDownNum=80;
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
			$scope.countDownNum=80;
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
		
		$http.post($Factory.Account.msg.url+'?phone='+ phoneParams)
			.then(function(resData){
				enterViewLoad.customload('发送成功');
			}).catch(function(err){
				$scope.endCountDownNum()
				enterViewLoad.customload('发送失败');	
			});
	}
	
	//点击完成
	$scope.Done=function(){
		if(!$scope.registerAgree.agree){
			enterViewLoad.customload('您还未接受房田用户协议');
			return
		}
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
					// 云信登录
					$scope.getuserInfo();
					// 绑定账号
					$scope.bindAccount();
				})
			}).catch(function(resData){
				enterViewLoad.customload(resData.data.Message);
				$scope.endCountDownNum()
			});				
	}
	// 绑定账号
    $scope.bindAccount=function(){
        $http.post($Factory.Account.addexterlogin.url,
			{LoginProvider:$stateParams.type,
			ProviderKey:$stateParams.key})
			.then(function(resData){
				enterViewLoad.customload("操作成功");
				$timeout(function(){
					$state.go('tabs.perCenter')
				},1500)	
			}).catch(function(err){
				enterViewLoad.customload("操作失败");
			})
	}
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

});

