
angular.module('App').controller('bgImgCutCtl',function($myPhotosData,NimUtils,appUtils,enterViewLoad,$rootScope,$scope,$stateParams,$ionicHistory,$http,$Factory,$ionicLoading,$timeout){
	$scope.back=function(){
		appUtils.back();
	}	
	$scope.imgurl=$stateParams.imgurl;
	
	$scope.init = function () {
        new AlloyCrop({
            image_src: $scope.imgurl,
            circle: false, 
            width: document.body.clientWidth,
			height: document.body.clientWidth * 0.49,
			output: 2,
            ok: function (base64, canvas) {
				$scope.$apply(function () {
					$scope.view = base64; 
					$scope.done()
				}); 
			},
            cancel: function (){
				$scope.back()
			},
            ok_text: "确定", 
            cancel_text: "取消" 
        });
    }
    $scope.init();
	
	
	$scope.done=function(){
		// 上传图片
		$scope.save=function(){
			$http.post($Factory.Account.upload.url,{
				path:'18/userHeadImg',
				file:$scope.view,
				orientation:$stateParams.orientation || null
			}).then(function(resData){
					if($stateParams.type){
						// 相册视频背景图
						$http.post($Factory.Zone.save.url,{
							Content:resData.data.view,
							Type: $stateParams.type,
							Id: $stateParams.id || null
						}).then(function(resData){
							enterViewLoad.customload('添加背景成功')
							$timeout(function(){
								$scope.back()
							},1500)
						}).catch(function(){
							enterViewLoad.customload('添加背景失败')
							$timeout(function(){
								$scope.back()
							},1500)
						})
					}else{
						// 照片背景图
						$myPhotosData.data.ShowInList=resData.data.view
						var subData = JSON.parse(JSON.stringify($myPhotosData.data))
						subData.Content=subData.Content.join('|');
						$http.post($Factory.Zone.save.url,subData)
							.then(function(resData){
								enterViewLoad.customload('添加背景成功')
								$timeout(function(){
									$scope.back()
								},1500)
							}).catch(function(){
								enterViewLoad.customload('添加背景失败')
								$timeout(function(){
									$scope.back()
								},1500)
							})
					}
				},function(err){
					enterViewLoad.customload('保存图片失败')
					$timeout(function(){
						$scope.back()
					},1500)
				})
		};
			
	}
	
})
