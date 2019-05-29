
angular.module('App').controller('busintroImgCutCtl',function($myBusinessData,NimUtils,appUtils,enterViewLoad,$rootScope,$scope,$stateParams,$ionicHistory,$http,$Factory,$ionicLoading,$timeout){
	$scope.back=function(){
		appUtils.back();
	}	
	$scope.imgurl=$stateParams.imgurl;
	
	$scope.init = function () {
        new AlloyCrop({
            image_src: $scope.imgurl,
            circle: false, 
            width: document.body.clientWidth * 0.7,
			height: document.body.clientWidth * 0.7 * 16 / 9,
			output: 2,
            ok: function (base64, canvas) {
				$scope.$apply(function () {
					$scope.view = base64; 
					$scope.save()
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
		
	}
	// 上传图片
	$scope.save=function(){
		enterViewLoad.load()
		$http.post($Factory.Account.upload.url,{
			path:'18/mybusiness',
			file:$scope.view,
			orientation:$stateParams.orientation || null
		}).then(function(resData){
			$myBusinessData.myPoster=resData.data.view;
			$ionicLoading.hide();
			$scope.back();
		}).catch(function(e){
			enterViewLoad.customload('上传图片失败')
			$timeout(function(){
				$scope.back()
			},1500)
		})
	};
	
})
