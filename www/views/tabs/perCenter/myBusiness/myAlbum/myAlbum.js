
angular.module('App').controller('myAlbumCtl',function(Upload,appUtils,enterViewLoad,$ionicActionSheet,$sce,$ionicModal,$ionicLoading,$localStorage,$timeout,$rootScope,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.paramsData={
			id:$stateParams.id,
			uid:$stateParams.uid
		}
		$scope.initData()
	})
	

	


	// 操作《=》取消
	$scope.showAction=false;
	$scope.switchShowAction=function(){
		$scope.showAction=!$scope.showAction;
	}
	$scope.cancelShowAction=function(){
		$scope.showAction=false;
	}


	$scope.initData=function(){
		$http.post($Factory.Zone.home.url+'?uid='+($scope.paramsData.uid||0),{
			type:21
		}).then(function(resData){
			if(resData.data[0]){
				$scope.albumList=resData.data[0].List.filter(function(item){
					if(item.Content){
						item.Content=item.Content.split('|')
					}else{
						item.Content=[]
					}
					return item
				})

			}else{
				$scope.albumList=[]
			}
		}).catch(function(){
			$scope.albumList=[]
			enterViewLoad.customload('加载数据失败')
		})
		// 背景图
		$http.post($Factory.Zone.home.url+'?uid='+($scope.paramsData.uid||0),{
			type:80
		}).then(function(resData){
			if(resData.data[0]){
				$scope.bgImage=resData.data[0].List[0].Content
				$scope.bgImageId=resData.data[0].List[0].Id
			}
		})
	}

	
	// 删除
	$scope.removeImg=function(index,item,$event){
		$event.stopPropagation();
		if(item.Id){
			$http.post($Factory.Zone.delete.url+'?id='+item.Id)
            .then(function(res){
                enterViewLoad.customload('删除成功')
				$scope.albumList.splice(index,1);
            }).catch(function(){
                enterViewLoad.customload('删除失败')
            })
		}else{
			
		}
	}
	

/*
	相册头部背景图片
*/ 
	$scope.uploadBgImg=function(){
		try{
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
						$state.go('bgImgCut',{imgurl:imgUrl,orientation:data,type:80,id:$scope.bgImageId||null})
					}, function(e) {
						console.log(e) 
					});
				},function(e){
					err(e) 
				})
			},false)
		}catch(e){
			alert(JSON.stringify(e))
		}
		// appUtils.photoLiberary(args,function(base,orientation){
		// 	$http.post( $Factory.Account.upload.url,{
		// 		path:'18/photoORvideo/bgimg',
		// 		file:base,
		// 		orientation:orientation
		// 	}).then(function(resData){
		// 		if(resData.data.error==0){
		// 			// 上传成功 添加
		// 			var imgData=resData.data.view
		// 			$http.post($Factory.Zone.save.url,{
		// 				Content:imgData,
		// 				Type: 80,
		// 				Id: $scope.bgImageId || null
		// 			}).then(function(resData){
		// 				enterViewLoad.customload('添加背景成功')
		// 				$scope.initData();
		// 			}).catch(function(){
		// 				enterViewLoad.customload('添加背景失败')
		// 			})
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

	// 新建相册
	$ionicModal.fromTemplateUrl('myalbum_addalbum_modal', {
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
	$scope.addAlbumData={
		Title:''
	}
	// 新建相册
	$scope.addAlbum = function(){ 
		if(!$scope.addAlbumData.Title){
			enterViewLoad.customload('请输入相册名称')
			return
		}
		$http.post($Factory.Zone.save.url,{
			Title:$scope.addAlbumData.Title,
			Type:21,
		}).then(function(resData){
			enterViewLoad.customload('新建成功')
			$scope.initData()
			$scope.closeModal()
		}).catch(function(){
			enterViewLoad.customload('新建相册失败')
		})
	}
})

