angular.module('App').controller('bindLoginController',function(NimUtils,appUtils,enterViewLoad,$localStorage,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicHistory){
	$scope.back=function(){
		if($ionicHistory.backView()){
			appUtils.back();
		}else{
			$state.go('tabs.perCenter')
		}
	};

	appUtils.saveKeyboardHeight()

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
			//登录成功
			$localStorage.access_token=resData.data.access_token;
			// 绑定账号
			$scope.bindAccount()
			// 个人信息 云信登录
			$scope.getuserInfo();
							
		}).catch( function(resData){
			enterViewLoad.customload("用户名或密码错误");
		});
	}

	// 绑定账号
    $scope.bindAccount=function(){
        $http.post($Factory.Account.addexterlogin.url,
			{LoginProvider:$stateParams.type,
			ProviderKey:$stateParams.key})
			.then(function(resData){
				enterViewLoad.customload("绑定成功");
				$timeout(function(){
					$state.go('tabs.perCenter')
				},1500)	
			}).catch(function(err){
				enterViewLoad.customload("绑定失败");
			})
    }

	$scope.getuserInfo=function(){
		$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				$localStorage.myselfInfo=resData.data;
				// 初始化网易云信
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