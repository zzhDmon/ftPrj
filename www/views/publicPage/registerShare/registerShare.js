angular.module('App').controller('registerShareCtl',function(enterViewLoad,$window,$localStorage,$ionicModal,wechatLinkBase,$rootScope,$interval,$timeout,$ionicHistory,$http,$Factory,$stateParams,$scope,$state,$ionicLoading){
	$scope.back=function(){
		$state.go('tabs.perCenter')
	}
	// $scope.imgUrl=$Factory.Account.qcode.url+'?id='+$localStorage.myselfInfo.Id
	$scope.downLoad=function(){
		if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //判断是否是iOS
			$window.open('itms-apps://itunes.apple.com/cn/app/linkmore/id1288448623?mt=8')
		}
		if (navigator.userAgent.match(/android/i)) { //判断是否是Android
			$window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.fangtian.ft'
		}
	}
	try{
		$scope.parPhone=window.atob($stateParams.parphone)
	}catch(e){
		$scope.parPhone=''
	}
	$scope.submitData={
		Phone:'',
		Password:'',
		ConfirmPassword:'',
		Code:'',
		Name:'',
		ParPhone:$scope.parPhone
	}
	$scope.registerAgree={
		agree:true
	}

	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.endCountDownNum()
	})

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
	        $ionicLoading.show({
				template:"请输入正确的手机号码",
				duration:1000
			});
	        return false; 
		} 
		if(!$scope.registerAgree.agree){
			$ionicLoading.show({
				template:"还未同意房田用户协议",
				duration:1500
			});
			return
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
	
	
	//点击完成
	$scope.Done=function(){
		if($scope.submitData.Password!=$scope.submitData.ConfirmPassword){
			enterViewLoad.customload('两次密码输入不一致');
			return
		}
		var req = {
			method: 'POST',
			url: $Factory.Account.register.url,
			headers: {
				'Content-Type': 'application/json'
			},
			data:$scope.submitData
		}
		$http(req).then(function(resData){
			$ionicLoading.show({
				template:'注册成功',
				duration:1500
			});	
			$scope.getuserInfo()
			$timeout(function(){
				$scope.downLoad()
			},1500);
		}).catch(function(resData){
			enterViewLoad.customload(resData.data.Message);
			$scope.endCountDownNum()
		});
	}

	// 获取个人信息
	$scope.getuserInfo=function(){
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
		   	$http.get($Factory.Account.getuserinfo.url)
			   .then(function(resData){
				   $localStorage.myselfInfo=resData.data;
			   }).catch(function(err){
					   
			   })
	   }).catch(function(){

	   })
	}
});

