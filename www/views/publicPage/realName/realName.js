angular.module('App').controller('realNameCtl',function(NimUtils,appUtils,enterViewLoad,$localStorage,$ionicActionSheet,$timeout,upImgBase,$http,$Factory,$scope,$rootScope,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};

	$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.userinfo=resData.data;

		}).catch(function(){

		})

	$scope.showIdCard={
		showFrontVCard:'',
		frontVCard:'',
		showReverseVCard:'',
		reverseVCard:''
	}

// 身份证正面
	$scope.froentAction=function(){
		var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: '相册选取' },
				{ text: '拍照' },
            ],
			cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				if(index==0){
					// 相册
					var args = {
						'selectMode': 100, //101=picker image and video , 100=image , 102=video
						'maxSelectCount': 1, //default 40 (Optional)
						'maxSelectSize': 188743680, //188743680=180M (Optional)
					};
					appUtils.photoLiberary(args,function(base,orientation){
						$http.post($Factory.Account.upload.url,{
							path:'18/userVcards',
							file:base,
							orientation:orientation
						}).then(function(resData){
								if(resData.data.error==0){
									$scope.showIdCard.showFrontVCard=resData.data.view;
									$scope.showIdCard.frontVCard=resData.data.url;					
								}
							})
					},function(err){
						enterViewLoad.customload('获取图片失败')
					})
				}else if(index==1){
					// 相机
					var options = {
						width:1000,
						height:1000
					}
					appUtils.cameraBase(options,function(base){
						$http.post($Factory.Account.upload.url,{path:'18/userVcards',file:base})
							.then(function(resData){
								if(resData.data.error==0){
									$scope.showIdCard.showFrontVCard=resData.data.view;
									$scope.showIdCard.frontVCard=resData.data.url;					
								}
							})
					},function(err){
						enterViewLoad.customload('调用相机失败')
					})
				}
             	return true;
            }
        });
	}
// 身份证反面
	$scope.backAction=function(){
		var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: '相册选取' },
				{ text: '拍照' },
            ],
			cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				if(index==0){
					// 相册
					var args = {
						'selectMode': 100, //101=picker image and video , 100=image , 102=video
						'maxSelectCount': 1, //default 40 (Optional)
						'maxSelectSize': 188743680, //188743680=180M (Optional)
					};
					appUtils.photoLiberary(args,function(base,orientation){
						$http.post($Factory.Account.upload.url,{
							path:'18/userVcards',
							file:base,
							orientation:orientation
						}).then(function(resData){
							if(resData.data.error==0){
								$scope.showIdCard.showReverseVCard=resData.data.view;
								$scope.showIdCard.reverseVCard=resData.data.url;
							}
						})
					},function(err){
						enterViewLoad.customload('获取图片失败')
					})
				}else if(index==1){
					// 相机
					var options = {
						width:1000,
						height:1000
					}
					appUtils.cameraBase(options,function(base){
						$http.post($Factory.Account.upload.url,{path:'18/userVcards',file:base}).then(function(resData){
							if(resData.data.error==0){
								$scope.showIdCard.showReverseVCard=resData.data.view;
								$scope.showIdCard.reverseVCard=resData.data.url;
							}
						})
					},function(err){
						enterViewLoad.customload('调用相机失败')
					})
				}
             	return true;
            }
        });
	}

	// 百度AI
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

	$scope.save = function(){
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
			var msg = err.data.Message || '保存失败'
			enterViewLoad.customload(msg)
		})
	}
})