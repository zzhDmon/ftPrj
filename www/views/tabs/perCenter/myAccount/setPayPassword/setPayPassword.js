
angular.module('App').controller('setPayPasswordCtl',function(enterViewLoad,appUtils,$location,$localStorage,$rootScope,$ionicHistory,$timeout,$scope,$state,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.fakeInput={
		value:null
	}
	$scope.stepStatus=1;

	$('#set_pay_password .password').on('input',function(){
		var value = $(this).val();
		var length = value.length;
		$('.showView').find('li').each(function(i){
			if(i < length){
				$(this).find('.circle').css({display: 'inline-block'});
			}else{
				$(this).find('.circle').hide();
			}
		})
	});
	// 清空输入框点点
	$scope.clearPoint=function(){
		$('.showView').find('li').each(function(i){
			$(this).find('.circle').hide();
		})
	}
	// 密码只能整数
	$scope.inputPwd=function() {
		this.fakeInput.value = this.fakeInput.value.replace(/\D/g, '');
		$scope.fakeInput.value = this.fakeInput.value
	}

	// 节流
	var timeout;
    $scope.$watch('fakeInput.value', function(inputText){
    	if(inputText && inputText.length==6){
    		if(timeout) {
    			$timeout.cancel(timeout);
    		}
			timeout = $timeout(function(){
				if($scope.stepStatus==1){
					// 检验身份
					$scope.oldPassword=inputText;
					$scope.fakeInput.value=null;
					$scope.clearPoint()
					$scope.stepStatus=2
				}else if($scope.stepStatus==2){
					// 第一次输入
					$scope.newPassword=inputText;
					$scope.fakeInput.value=null;
					$scope.clearPoint()
					$scope.stepStatus=3
					$timeout(function(){
					})
				}else{
					if($scope.newPassword!==inputText){
						enterViewLoad.customload('两次输入密码不一致！')
						$scope.fakeInput.value=null;
						$scope.clearPoint()
						$scope.stepStatus=2
					}
				}
				
			},500)
    	}
	})
	// 检测密码设置
	$scope.oldPassword=null
	$scope.isPassword=function(){
		$http.post($Factory.Money.ispassword.url).then(function(resData){
			if(resData.data || resData.data===0){
			}else{
				$scope.oldPassword=null;
				$scope.stepStatus=2
			}
				
			
		}).catch(function(){

		})
	}
	$scope.isPassword()
	
	// 完成修改
	$scope.changeDone=function(){
		$http.post($Factory.Money.setpassword.url+'?npwd='+$scope.newPassword+'&opwd='+$scope.oldPassword)
			.then(function(resData){
				enterViewLoad.customload('设置成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(err){
				enterViewLoad.customload(err.data.Message)
				$scope.fakeInput.value=null;
				$scope.clearPoint()
				if(err.data.Message=='原密码错误'){
					$scope.stepStatus=1
				}else{
					$scope.stepStatus=2
				}
			})		
	}

})
