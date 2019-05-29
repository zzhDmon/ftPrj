angular.module('App').controller('videoUploadCtl',function(Upload,appUtils,upImgBase,$cordovaToast,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	};
	


	// flie chage
	$scope.onFileChange=function(files){
		console.log(files)
		$scope.videoFileName = files[0].name;
		var blob = new Blob([files[0]]), // 文件转化成二进制文件
			url = URL.createObjectURL(blob); //转化成url
		document.getElementById("previewVideo").src=url;
		document.getElementById("previewVideo").onload = function(e) {
			console.log(e)
			console.log(this.src)
			URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
		}
		
		//视频预览
		// fileReader.readAsDataUrl(files[0],$scope)
		// 	.then(function (result) {
		// 	document.getElementById("previewVideo").src=result;
		// 	});

		$scope.$apply();
         //这里使用了 ng-file-upload 文件上传插件
		Upload.upload({
			//服务端接收
			// url: $Factory.Account.url+"user/video", 
			url: $Factory.Account.uploadmedia.url, 
			// file: files[0]
			data:{file: files[0]}
		}).progress(function (evt) {
			//进度条
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			  $timeout(function () {
				  $ionicLoading.show({
					  template: "正在上传：" + Math.floor(progressPercentage) + "%"
				  });
				  if (progressPercentage > 99) {
					  $ionicLoading.hide();
				  }
			  }) 
		}).success(function (data, status, headers, config) {
			//上传成功
			console.log(data)
			// var resultUrl = data.url.replace(/(^\s*)|(\s*$)/g, "");//后台返回出现*符号 ，清除
			// $scope.videoPath = resultUrl;

			console.log(data, status, headers, config);
			$ionicLoading.hide();
			$ionicLoading.show({
				template: "上传成功",
				showBackdrop: false,
				duration:1500
			});
		}).error(function (data, status, headers, config){
			$ionicLoading.hide();
			$ionicLoading.show({
				template: "上传失败",
				showBackdrop: false,
				duration:1500
			});
		});
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
		var scale = 0.8;
		var video = document.getElementById("previewVideo");
		$rootScope.videoPreviewPlay = video;
		var canvas = document.createElement("canvas");
		canvas.width = video.videoWidth * scale;
		canvas.height = video.videoHeight * scale;
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		var img_preview = canvas.toDataURL("image/png");
		
		$http.post($Factory.Account.upload.url,{path:'18/screenshot',file:img_preview})
			.then(function(resData){
				
			})
		
		//二进制上传预览图 
		// var file = $scope.convertBase64UrlToBlob(img_preview);
		// var fd = new FormData();
		// fd.append('file', file , "image.png"); // 移动端好像要加第三个参数，否则预览图无法上传成功
		// $http({
		// 	method : 'POST',
		// 	url : ApiUrl.url+"user/image", 
		// 	data : fd,  //仅仅存放的是文件流数据
		// 	headers : {
		// 		'Content-Type' : undefined //angularjs设置文件上传的content-type修改方式
		// 	},
		// 	transformRequest : angular.identity,
		// }).success(function(response) {
		// 	var resultUrl = response.replace(/(^\s*)|(\s*$)/g, "");
		// 	$scope.imgPreview = ApiUrl.imageUrl+resultUrl;
		// }).error(function(err){
		
		// });
	}
})
.directive('jqSetValue', function($timeout) {
	return {
		restrict: 'AC',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			//设置自定义事件的回调函数
			element.on('jquery.set.value', function(event) {
				console.log(ngModel)
				if(!ngModel) return;
				scope.$apply(function(){
					ngModel.$setViewValue($(element).val());
				});
			});
		}
	};
});