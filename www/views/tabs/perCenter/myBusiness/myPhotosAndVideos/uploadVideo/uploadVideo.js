
angular.module('App').controller('uploadVideoCtl',function(Upload,appUtils,enterViewLoad,$ionicActionSheet,$sce,$ionicLoading,$localStorage,$timeout,$rootScope,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}


/*
视频
*/ 
	$scope.videoChoose=function(){
		$('#upload_video_add_input').click();
	}
	$scope.subVideoData = {
		video:'',
		image:''
	}
	
	// flie chage
	$scope.onFileChange=function(files){
		$scope.videoFileObj = files[0];
		var blob = new Blob([files[0]]), // 文件转化成二进制文件
			url = URL.createObjectURL(blob); //转化成url
			// $scope.videoFile = url
		document.getElementById("preview_upload_video").src=url;
		document.getElementById("preview_upload_video").onload = function(e) {
			URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
		}
		$scope.$apply();
		
		// 清空输入框数据
		$('#upload_video_add_input').val('');
		
		Upload.upload({
			url: $Factory.Account.uploadmedia.url, 
			// file: files[0]
			data:{
				file: $scope.videoFileObj,
				userid:$localStorage.myselfInfo?$localStorage.myselfInfo.Id:null
			}
		}).progress(function (evt) {
			//进度条
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			$timeout(function () {
				$ionicLoading.show({
					template: "正在上传：" + Math.floor(progressPercentage) + "%"
				});
				if (progressPercentage > 99) {
					$ionicLoading.hide();
					enterViewLoad.load(true)
				}
			}) 
		}).success(function (data,status,headers,config){
			$ionicLoading.hide();
			if(data.error==0){
				$scope.subVideoData.video=data.view
				$scope.subVideoData.image=data.cover;
				//上传成功
				enterViewLoad.customload('上传成功')
			}else{
				enterViewLoad.customload('上传失败')
			}
		}).error(function (data, status, headers, config){
			$ionicLoading.hide();
			enterViewLoad.customload('上传失败')
		})
	} 

	$scope.convertBase64UrlToBlob=function(dataurl){
		var arr = dataurl.split(','), 
		mime = arr[0].match(/:(.*?);/)[1], 
		bstr = atob(arr[1]), 
		n = bstr.length, 
		u8arr = new Uint8Array(n); 
		while(n--){ 
			u8arr[n] = bstr.charCodeAt(n); 
		} 
		return new Blob([u8arr],{ type: 'image/png' }); 
	}
	$scope.onLoadedData=function(){
		// var video = document.getElementById("preview_upload_video");
		// // 播放再暂停取首帧做截图
		// video.play();
		// video.pause();

		// $scope.uploadShoot=function(){
		// 	var scale = 0.8;
		// 	// $rootScope.videoPreviewPlay = video;
		// 	var canvas = document.createElement("canvas");
		// 	canvas.width = video.videoWidth * scale;
		// 	canvas.height = video.videoHeight * scale;
		// 	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		// 	var img_preview = canvas.toDataURL("image/png");
		// 	$http.post($Factory.Account.upload.url,{path:'18/myVideos/screenshot',file:img_preview})
		// 		.then(function(resData){
		// 			if(resData.data.error==0){
		// 				$scope.subVideoData.image=resData.data.view
		// 				enterViewLoad.customload('上传成功')
		// 			}else{
		// 				enterViewLoad.customload('上传失败')
		// 			}
		// 		}).catch(function(err){
		// 		})
		// }	
	}
	
	$scope.typeList=[
		{text:'生活',value:1},
		{text:'搞笑',value:2},
		{text:'娱乐',value:3},
		{text:'萌宠',value:4},
		{text:'体育',value:5},
		{text:'军事',value:6},
		{text:'科技',value:7},
		{text:'游戏',value:8},
		{text:'奇葩',value:9},
		{text:'饮食',value:10},
		{text:'动漫',value:11},
		{text:'二次元',value:12},
	]
	$scope.typeChoosed=1;
	$scope.changeType=function(type){
		$scope.typeChoosed=type;
	}

	// 上传成功 发布视频
	$scope.publishVideo=function(){
		$http.post($Factory.Zone.save.url,{
			Content: JSON.stringify($scope.subVideoData),
			Type:30,
			CType:$scope.typeChoosed
		}).then(function(resData){
			$scope.subVideoData={video:'',image:''};
			$scope.videoFileObj=''
			enterViewLoad.customload('发布成功');
			$timeout(function(){
				$scope.back()
			},1500)
		}).catch(function(){
			enterViewLoad.customload('发布失败')
		})
	}
	$scope.cancelVideo=function(){
		$scope.subVideoData={video:'',image:''};
		$scope.videoFileObj='';
	}


})

