angular.module('App').controller('realHouseCtl',function(appUtils,upImgBase,enterViewLoad,$http,$Factory,$state,$stateParams,$scope,$timeout,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};
	// 路由参数
	$scope.paramsData={
		id:$stateParams.id,
		address:$stateParams.address,
		housetype:$stateParams.housetype //1 二手房 2 商铺 3 写字楼
	}
	$scope.subData = {
		HouseId:$stateParams.id,
		HolderName: '',
		HouseIdImage: '',
		HouseNumber: '',
		Address: '',
		Status: 0,
		ExInfo: ''
	}

	$scope.showHouseCard={
		showFrontVCard:'',
		frontVCard:'',
		showReverseVCard:'',
		reverseVCard:''
	}
	$('#real_house .id-img').on('click','.img',function(){
		$(this).next().click();
	});
	$('#real_house .id-img').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			$http.post($Factory.Account.upload.url,{path:'18/realhouse',file:base})
				.then(function(resData){
					if(resData.data.error==0){
						$scope.showHouseCard.showFrontVCard=resData.data.view;
						$scope.showHouseCard.frontVCard=resData.data.url;					
					}
				})
		})
	});
	$('#real_house .id-img-reverse').on('click','.img',function(){
		$(this).next().click();
	});
	$('#real_house .id-img-reverse').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			$http.post($Factory.Account.upload.url,{path:'18/realhouse',file:base}).then(function(resData){
				if(resData.data.error==0){
					$scope.showHouseCard.showReverseVCard=resData.data.view;
					$scope.showHouseCard.reverseVCard=resData.data.url;
				}
			})
		})
	});

	
	$scope.baidu=function(){
		enterViewLoad.load()
		$http.post($Factory.BaiduAPI.housecard.url,{
			frontUrl:$scope.showHouseCard.frontVCard,
			backUrl:$scope.showHouseCard.reverseVCard
		}).then(function(resData){
			$ionicLoading.hide()
			// 第一页
			if(resData.data.font.data.isStructured && resData.data.font.data.ret.length>0){
				for(var i=0;i<resData.data.font.data.ret.length;i++){
					if(resData.data.font.data.ret[i].word_name == '产权号01'){
						$scope.subData.HouseNumber = resData.data.font.data.ret[i].word
					}
				}
			}
			// 第二页
			if(resData.data.back.data.isStructured && resData.data.back.data.ret.length>0){
				for(var i=0;i<resData.data.back.data.ret.length;i++){
					if(resData.data.back.data.ret[i].word_name == '权利人'){
						$scope.subData.HolderName = resData.data.back.data.ret[i].word
					}
					if(resData.data.back.data.ret[i].word_name == '房地坐落'){
						$scope.subData.Address = resData.data.back.data.ret[i].word
					}
					if(resData.data.back.data.ret[i].word_name == '共有权情况'){
						$scope.subData.ExInfo = resData.data.back.data.ret[i].word
					}
				}
			}
			$timeout(function(){
				$scope.subData = $scope.subData
			})
		}).catch(function(err){
			$ionicLoading.hide()
			// 识别错误
			enterViewLoad.customload('身份证识别错误')
		})
	}
		
	$scope.$watch('showHouseCard.frontVCard', function(inputText){
    	if($scope.showHouseCard.frontVCard && $scope.showHouseCard.reverseVCard){
    		$scope.baidu()
    	}
	})
	$scope.$watch('showHouseCard.reverseVCard', function(inputText){
    	if($scope.showHouseCard.frontVCard && $scope.showHouseCard.reverseVCard){
    		$scope.baidu()
    	}
	})
	
	

	$scope.save=function(){
		if(!$scope.showHouseCard.showFrontVCard || !$scope.showHouseCard.showReverseVCard){
			enterViewLoad.customload('请上传房产证图片…',2000)
			return false
		}
		if(!$scope.subData.HolderName){
			enterViewLoad.customload('权利人识别失败<br>请重新上传第二页',2000)
			return false
		}
		if(!$scope.subData.HouseNumber){
			enterViewLoad.customload('房产证号识别失败<br>请重新上传第一页',2000)
			return false
		}
		if($scope.subData.Address != $scope.paramsData.address){
			enterViewLoad.customload('房地坐落与房产证上不一致',2000)
			return false
		}

		var subData = JSON.parse(JSON.stringify($scope.subData))
		subData.Status = 2
		subData.HouseIdImage = $scope.showHouseCard.showFrontVCard+'|'+$scope.showHouseCard.showReverseVCard

		if($scope.paramsData.housetype==1){
			$http.post($Factory.NewHouseSource.auth.url,subData).then(function(resData){
				enterViewLoad.customload('提交成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(){
				enterViewLoad.customload('提交失败')
			})
		}else{
			$http.post($Factory.SimpleHouse.auth.url,subData).then(function(resData){
				enterViewLoad.customload('提交成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(){
				enterViewLoad.customload('提交失败')
			})
		}
	}
	
})