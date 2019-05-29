angular.module('App').controller('CompleteInfoCtl',function(NimUtils,enterViewLoad,$timeout,upImgBase,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	
	$scope.back=function(){
		$state.go('tabs.perCenter')
	};

	$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.userinfo=resData.data;
		})
		.catch(function(){

		})

	$scope.showIdCard={
		showFrontVCard:'',
		frontVCard:'',
		showReverseVCard:'',
		reverseVCard:''
	}

	
	$('#complete_info .id-img').on('click','.img',function(){
		$(this).next().click();
	});
	$('#complete_info .id-img').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			
			$http.post($Factory.Account.upload.url,{path:'18/userVcards',file:base}).then(function(resData){
				if(resData.data.error==0){
					$scope.showIdCard.showFrontVCard=resData.data.view;
					$scope.showIdCard.frontVCard=resData.data.url;
					
				}
			})
		})
	});
	$('#complete_info .id-img-reverse').on('click','.img',function(){
		$(this).next().click();
	});
	$('#complete_info .id-img-reverse').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			
			$http.post($Factory.Account.upload.url,{path:'18/userVcards',file:base}).then(function(resData){
				if(resData.data.error==0){
					$scope.showIdCard.showReverseVCard=resData.data.view;
					$scope.showIdCard.reverseVCard=resData.data.url;
				}
			})
		})
	});
	$scope.baiduData = {
		signOrgan:''
	}
	$scope.baidu=function(){
		enterViewLoad.load()
		$http.post($Factory.BaiduAPI.idcard.url,{
			frontUrl:$scope.showIdCard.frontVCard,
			backUrl:$scope.showIdCard.reverseVCard
		}).then(function(resData){
			$ionicLoading.hide()
			$scope.userinfo.Name = resData.data.font.words_result.姓名 ? resData.data.font.words_result.姓名.words:''
			$scope.userinfo.VNumber = resData.data.font.words_result.公民身份号码 ?resData.data.font.words_result.公民身份号码.words:''
			$scope.userinfo.Address = resData.data.font.words_result.住址 ?resData.data.font.words_result.住址.words:''
			
			$scope.baiduData = {
				signOrgan:resData.data.back.words_result.签发机关?resData.data.back.words_result.签发机关.words:'',
			}
		}).catch(function(err){
			$ionicLoading.hide()
			// 识别错误
			enterViewLoad.customload('身份证识别错误')
		})
	}
	$scope.$watch('showIdCard.frontVCard', function(inputText){
    	if($scope.showIdCard.frontVCard && $scope.showIdCard.reverseVCard){
    		$scope.baidu()
    	}
	})
	$scope.$watch('showIdCard.reverseVCard', function(inputText){
    	if($scope.showIdCard.frontVCard && $scope.showIdCard.reverseVCard){
    		$scope.baidu()
    	}
	})

	$scope.save=function(){
		if(!$scope.showIdCard.frontVCard || !$scope.showIdCard.reverseVCard){
			enterViewLoad.customload('请上传身份证')	
			return false; 
		}
		if(!$scope.baiduData.signOrgan){
			enterViewLoad.customload('身份证反面识别错误<br/>请重新上传',2000)	
			return false; 
		}
		if(!$scope.userinfo.Name){
			enterViewLoad.customload('身份证姓名识别错误<br/>请重新上传',2000)	
			return false; 
		}
		if(!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test($scope.userinfo.VNumber))){ 
			enterViewLoad.customload('身份证号识别错误<br/>请重新上传');
	        return false; 
		} 

		var subData = JSON.parse(JSON.stringify($scope.userinfo))
		subData.AICheck	= true;
		subData.VStatus = 4;
		subData.VCard=$scope.showIdCard.frontVCard+'|'+$scope.showIdCard.reverseVCard
		
		$http.post($Factory.Account.setuserinfo.url,subData).then(function(resData){
				enterViewLoad.customload('保存成功')
				$timeout(function(){
					$scope.back();
				},1500);
				$localStorage.myselfInfo = subData
				// 云信
				nim.updateMyInfo({
					email: $scope.userinfo.Email,
					done: updateMyInfoDone
				});
				function updateMyInfoDone(error, user) {
					if (!error) {
						NimUtils.updateMyInfo()
					}
				}
		},function(err){
			enterViewLoad.customload('保存失败')
		})
	}
	

})