
angular.module('App').controller('myPhotosCtl',function($myPhotosData,Upload,appUtils,enterViewLoad,actionImgShow,$ionicActionSheet,$sce,$ionicModal,$ionicLoading,$localStorage,$timeout,$rootScope,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		if($stateParams.uid){
			$scope.headTitle = '他的照片';
		}else{
			$scope.headTitle ='我的照片';
		}
		$scope.paramsData={
			uid:$stateParams.uid,
			id:$stateParams.id || 0
		}
		// 加载数据
		$scope.initImages();
	})
	

	// 选择方式
	$ionicModal.fromTemplateUrl('photos_videos_modal', {
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


	// 操作《=》取消
	$scope.showAction=false;
	$scope.switchShowAction=function(){
		$scope.showAction=!$scope.showAction;
	}
	$scope.cancelShowAction=function(){
		$scope.showAction=false;
	}

	$scope.initImages=function(){
		$http.get($Factory.Zone.get.url+'?id='+$scope.paramsData.id,{
			type:20
		}).then(function(resData){
			if(resData.data.Content){
				resData.data.Content=resData.data.Content.split('|')
			}else{
				resData.data.Content=[]
			}
			$scope.pageData=resData.data;
			
		}).catch(function(){
			$scope.pageData={}
			$scope.pageData.Content=[]
			enterViewLoad.customload('加载数据失败')
		})
		
	}
	// 查看大图
	$scope.preBigImg = function($index){
		/*
			 图片预加载
		*/
		var arrImgs = new Array();
		for(var i=0; i<$scope.pageData.Content.length; i++) {
			var img = new Image();
			img.src = $scope.pageData.Content[i];
			img.onload = function(i) {
				arrImgs[i] = img;
			}(i);
		}
		actionImgShow.show({
			"larImgs": arrImgs,
			//"larImgs": allimgs,配置成这个也是可以的，只是图片没有预加载，每次放大预览都需要重新加载图片 
			"currentImg": $index,
			imgClose : function() {
				actionImgShow.close();
			}
		})
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
				path:'18/myPhotos',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					// 上传成功 添加
					var copyData = JSON.parse(JSON.stringify($scope.pageData))
					copyData.Content.push(resData.data.view)
					$scope.addAlbum(copyData)
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}
	// 选择添加图片
	$scope.photoChoose = function(){ 
		$scope.closeModal()
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
				path:'18/myPhotos',
				file:base,
				orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$timeout(function(){
						// 上传成功 添加
						var copyData = JSON.parse(JSON.stringify($scope.pageData))
						copyData.Content.push(resData.data.view)
						$scope.addAlbum(copyData)
					})
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
	}
	

	// 删除
	$scope.removeImg=function(index,item,$event){
		$event.stopPropagation();
		// 上传成功 添加
		var copyData = JSON.parse(JSON.stringify($scope.pageData))
		copyData.Content.splice(index,1)
		$scope.addAlbum(copyData);
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
					$myPhotosData.data=JSON.parse(JSON.stringify($scope.pageData))
					$state.go('bgImgCut',{imgurl:imgUrl,orientation:data})
				}, function(e) {
				});
			},function(e){
				err(e) 
			})
		},false)

		// var args = {
		// 	'selectMode': 100, //101=picker image and video , 100=image , 102=video
		// 	'maxSelectCount': 1, //default 40 (Optional)
		// 	'maxSelectSize': 188743680, //188743680=180M (Optional)
		// };
		// appUtils.photoLiberary(args,function(base,orientation){
		// 	$http.post( $Factory.Account.upload.url,{
		// 		path:'18/photoORvideo/bgimg',
		// 		file:base,
		// 		orientation:orientation
		// 	}).then(function(resData){
		// 		if(resData.data.error==0){
		// 			// 上传成功 添加
		// 			var copyData = JSON.parse(JSON.stringify($scope.pageData))
		// 			copyData.ShowInList=resData.data.view
		// 			$scope.addAlbum(copyData);
		// 		}
		// 	}).catch(function(){
		// 		enterViewLoad.customload('图片上传失败')
		// 	})
		// },function(err){
		// 	enterViewLoad.customload('获取图片失败')
		// })
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
	
	/*
	编辑相册 封装
	*/ 
	$scope.addAlbum = function(copyData,showInfo){ 
		var subData = JSON.parse(JSON.stringify(copyData))
		subData.Content=subData.Content.join('|');
		$http.post($Factory.Zone.save.url,subData)
			.then(function(resData){
				$scope.pageData=JSON.parse(JSON.stringify(copyData))
				if(showInfo){
					enterViewLoad.customload('上传成功')
				}
			}).catch(function(){
				enterViewLoad.customload('添加照片失败')
			})
	}
})
.factory('$myPhotosData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
		data:null,
	};

	return new Util();
}]);

