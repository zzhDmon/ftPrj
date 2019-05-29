
angular.module('App').controller('publishDynamicCtl',function(appUtils,enterViewLoad,upImgBase,$ionicModal,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	// 选择方式
	$ionicModal.fromTemplateUrl('publish_dynamic_typechoose_modal', {
		scope: $scope,
		animation: 'slide-in-left'
	}).then(function(modal) {
		$scope.Modal = modal;
	});
	$scope.showModal=function(){
		$scope.Modal.show();	
	}
	$scope.closeModal=function(){
		$scope.Modal.hide();
	}


	$scope.subContent={
		text:'',
		imgs:[],
		video:''
	}
	// 拍摄图片
	$scope.cameraChoose = function(){
		$scope.closeModal()
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post( $Factory.Account.upload.url,{
				path:'18/myDynamicPhotos',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					if($scope.subContent.imgs.length<9){
						$scope.subContent.imgs.push(resData.data.view);
					}else{
						$scope.subContent.imgs.splice(0,1);
						$scope.subContent.imgs.push(resData.data.view);
					}
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}

	// 选择图片
	$scope.photoChoose = function(){ 
		$scope.closeModal()
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9 - ($scope.subContent.imgs.length), //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
					path:'18/myDynamicPhotos',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					if($scope.subContent.imgs.length<9){
						$scope.subContent.imgs.push(resData.data.view);
					}else{
						$scope.subContent.imgs.splice(0,1);
						$scope.subContent.imgs.push(resData.data.view);
					}
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
	}
	$scope.removeImg=function(index){
		$scope.subContent.imgs.splice(index,1);
	}

	$scope.save=function(){
		if(!$scope.subContent.text&&($scope.subContent.imgs.length==0)){
			enterViewLoad.customload('请输入文字或选择图片')
			return
		}
		enterViewLoad.load()
		var realSubContent = JSON.parse(JSON.stringify($scope.subContent))
		
		$http.post($Factory.Zone.add.url,{
			Content:$scope.subContent,
			Type:10
		}).then(function(resData){
				enterViewLoad.customload('发表成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(){
				enterViewLoad.customload('发表失败')
			})
	}

})

