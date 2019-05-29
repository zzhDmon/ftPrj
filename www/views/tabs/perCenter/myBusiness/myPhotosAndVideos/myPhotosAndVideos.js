
angular.module('App').controller('myPhotosAndVideosCtl',function(Upload,appUtils,enterViewLoad,$ionicActionSheet,$sce,$ionicLoading,$localStorage,$timeout,$rootScope,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	if($stateParams.uid){
		$scope.headTitle = '他的视频';
	}else{
		$scope.headTitle = '我的视频';
	}
	$scope.paramsData={
		uid:$stateParams.uid || 0
	}
	


	// 操作《=》取消
	$scope.showAction=false;
	$scope.switchShowAction=function(){
		$scope.showAction=!$scope.showAction;
	}
	$scope.cancelShowAction=function(){
		$scope.showAction=false;
	}

	$scope.showVideoList=[];
	$scope.vcrList=[];
	$scope.initVideos=function(){
		// VCR
		$http.post($Factory.Zone.home.url+'?uid='+$scope.paramsData.uid,{
			type:31
		}).then(function(resData){
			if(resData.data[0]){
				$scope.vcrList=resData.data[0].List.filter(function(item){
					if(appUtils.isJsonString(item.Content)){
						item.Content=JSON.parse(item.Content)
					}else{
						item.Content={}
					}
					return item
				})
			}else{
				$scope.vcrList=[]
			}
		}).catch(function(){
			$scope.vcrList=[]
			enterViewLoad.customload('加载数据失败')
		})
		// 视频
		$http.post($Factory.Zone.home.url+'?uid='+$scope.paramsData.uid,{
			type:30
		}).then(function(resData){
			if(resData.data[0]){
				$scope.showVideoList=resData.data[0].List.filter(function(item){
					if(appUtils.isJsonString(item.Content)){
						item.Content=JSON.parse(item.Content)
					}else{
						item.Content={}
					}
					return item
				})
			}else{
				$scope.showVideoList=[];
			}
		}).catch(function(){
			$scope.showVideoList=[];
			enterViewLoad.customload('加载数据失败')
		})
		// 背景图
		$http.post($Factory.Zone.home.url+'?uid='+$scope.paramsData.uid,{
			type:90
		}).then(function(resData){
			if(resData.data[0]){
				$scope.bgImage=resData.data[0].List[0].Content
				$scope.bgImageId=resData.data[0].List[0].Id
			}
		})
	}
	// 加载数据
	$scope.initVideos();

/*
视频
*/ 
	$scope.videoChoose=function(type){
		$scope.subType=type
		$('#my_videos_add_input').click();
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
		document.getElementById("preview_my_video").src=url;
		document.getElementById("preview_my_video").onload = function(e) {
			URL.revokeObjectURL(this.src);  // 释放createObjectURL创建的对象
		}
		$scope.$apply();
		
		// 清空输入框数据
		$('#my_videos_add_input').val('')
        //使用 ng-file-upload 文件上传插件
		
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
		var video = document.getElementById("preview_my_video");
		// 播放再暂停取首帧做截图
		video.play();
		video.pause();

		$scope.uploadShoot=function(){
			var scale = 0.8;
			// $rootScope.videoPreviewPlay = video;
			var canvas = document.createElement("canvas");
			canvas.width = video.videoWidth * scale;
			canvas.height = video.videoHeight * scale;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			var img_preview = canvas.toDataURL("image/png");
			$http.post($Factory.Account.upload.url,{path:'18/myVideos/screenshot',file:img_preview})
				.then(function(resData){
					if(resData.data.error==0){
						$scope.subVideoData.image=resData.data.view
						enterViewLoad.customload('上传成功')
					}else{
						enterViewLoad.customload('上传失败')
					}
				}).catch(function(err){
				})
		}
		
	}

	// 上传成功 发布视频
	$scope.publishVideo=function(){
		$http.post($Factory.Zone.save.url,{
			Content: JSON.stringify($scope.subVideoData),
			Type:$scope.subType	//VCR或普通视频
		}).then(function(resData){
			$scope.subVideoData={video:'',image:''};
			$scope.videoFileObj=''
			enterViewLoad.customload('发布成功')
			$scope.initVideos()
		}).catch(function(){
			enterViewLoad.customload('发布失败')
		})
	}
	$scope.cancelVideo=function(){
		$scope.subVideoData={video:'',image:''};
		$scope.videoFileObj='';
	}
	// 删除
	$scope.removeVideo=function(index,item,$event,delType){
		$event.stopPropagation();
		if(item.Id){
			$http.post($Factory.Zone.delete.url+'?id='+item.Id)
            .then(function(res){
				enterViewLoad.customload('删除成功')
				if(delType==30){
					$scope.showVideoList.splice(index,1);
				}else{
					$scope.vcrList.splice(index,1);
				}
            }).catch(function(){
                enterViewLoad.customload('删除失败')
            })
		}else{
			$scope.showVideoList.splice(index,1);
		}
	}

	//上传背景
	$scope.uploadBgImg=function(){
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 1, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		document.addEventListener("deviceready", function () {
			MediaPicker.getMedias(args,function(medias) {
				//medias [{mediaType: "image", path:'/storage/emulated/0/DCIM/Camera/2017.jpg', uri:"android retrun uri,ios retrun URL" size: 21993}]
				var imgUrl = ''
				for (var i = 0; i < medias.length; i++){
					imgUrl =medias[i].path
				}
				MediaPicker.getExifForKey(imgUrl,"Orientation", function(data) {
					$state.go('bgImgCut',{imgurl:imgUrl,orientation:data,type:90,id:$scope.bgImageId||null})
				}, function(e) {
					console.log(e) 
				});
			},function(e){
				err(e) 
			})
		},false)
		
	}
	//选择更换背景
	$scope.showActionSheet =function(houseinfo,housetype,behaviour) {
		if($scope.paramsData.uid)return
		var hideSheet = $ionicActionSheet.show({
            buttons: [
				{ text: '更换背景' },
            ],
			cancelText: '取消',
			destructiveButtonClicked:function(){

			},
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				$scope.uploadBgImg()
             	return true;
            }
        });


    };

})

