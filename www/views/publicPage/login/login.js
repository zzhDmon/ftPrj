angular.module('App').controller('LoginController',function(NimUtils,appUtils,WechatService,enterViewLoad,$window,$localStorage,$ionicModal,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$ionicHistory){
	$scope.back=function(){
		if($ionicHistory.backView()){
			appUtils.back();
		}else{
			$state.go('tabs.realHome')
		}
	};
	// 键盘高度
	appUtils.saveKeyboardHeight()

	$scope.wechatInstalled=false
	$scope.qqInstalled=false
	document.addEventListener('deviceready',function(){
		// 微信安装
		Wechat.isInstalled(function (installed) {
			if(installed){
				$scope.wechatInstalled=true
			}else{
				$scope.wechatInstalled=false
			}
		}, function(reason){			
		});
		// qq安装
		YCQQ.checkClientInstalled(function(){
			$scope.qqInstalled=true
		},function(){
			$scope.qqInstalled=false
		});
	},false)


	$scope.$on('$ionicView.beforeLeaev',function(){
		$scope.closeModal()
	})
	//选择绑定 
	$ionicModal.fromTemplateUrl('login_choose_bind_modal', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	

	$scope.wxLogin=function(){
		appUtils.wechatUnionId(function(userinfo){
			$http.post($Factory.Account.exterlogin.url,{LoginProvider:'Weixin',ProviderKey:userinfo.unionid})
				.then(function(resData){
					if(resData.data.status==0){
						//成功
						enterViewLoad.customload("登录成功");
						$localStorage.access_token=resData.data.access_token;
						// 个人信息极光登录
						$scope.getuserInfo();
						$timeout(function(){
							if($ionicHistory.backView()){
								$scope.back();
							}else{
								$state.go('tabs.perCenter')
							}
						},1500)
					}else if(resData.data.status==1){
						// 未绑定
						$scope.bindParams={type:'Weixin',key:userinfo.unionid};
						$scope.showModal()
					}
				}).catch(function(err){
					enterViewLoad.customload("登录失败");
				})
		},function(){
			enterViewLoad.customload("登录失败");
		})
	}

	$scope.qqLogin=function(){
		appUtils.qqLoginAndroid(function(userinfo){
			$http.post($Factory.Account.exterlogin.url,{LoginProvider:'QQ',ProviderKey:userinfo.userid})
				.then(function(resData){
					if(resData.data.status==0){
						//成功
						enterViewLoad.customload("登录成功");
						$localStorage.access_token=resData.data.access_token;
						// 个人信息极光登录
						$scope.getuserInfo();
						$timeout(function(){
							if($ionicHistory.backView()){
								$scope.back();
							}else{
								$state.go('tabs.perCenter')
							}
						},1500)
					}else if(resData.data.status==1){
						// 未绑定
						$scope.bindParams={type:'QQ',key:userinfo.userid};
						$scope.showModal()
					}
				}).catch(function(err){
					enterViewLoad.customload("登录失败");
				})
		},function(err){
			enterViewLoad.customload("登录失败");
		})
	}


	$scope.logininfo={
		grant_type:'password',
		username:null,
		password:null
	};
	
	$scope.login=function(){
		var req = {
		 	method: 'POST',
		 	url: $Factory.Account.login.url,
		 	dataType: "json",
		 	headers: {
				   'Content-Type':'application/x-www-form-urlencoded'
		 	},
		 	data: "grant_type=password&"+"username="+$scope.logininfo.username+'&'+"Password="+$scope.logininfo.password			
		}
		
		$http(req).then(function(resData){
			//成功
			enterViewLoad.customload("登录成功");
			$localStorage.access_token=resData.data.access_token;
			
			// 个人信息极光登录
			$scope.getuserInfo();
			$timeout(function(){
				if($ionicHistory.backView()){
					$scope.back();
				}else{
					$state.go('tabs.perCenter')
				}
			},1500)					
		}).catch( function(resData){
			enterViewLoad.customload("用户名或密码错误");
		});
	}

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

})
.directive('dateFormat', ['$filter',function($filter) {  
    var dateFilter = $filter('date');  
    return {  
        require: 'ngModel',  
        link: function(scope, elm, attrs, ctrl) {  
  
            function formatter(value) { 
				console.log(value) 
                return dateFilter(value, 'yyyy-MM-dd'); //format  
            }  
  
            function parser() {  
                return ctrl.$modelValue;  
            }  
  
            ctrl.$formatters.push(formatter);  
            ctrl.$parsers.unshift(parser);  
  
        }  
    };  
}]); 