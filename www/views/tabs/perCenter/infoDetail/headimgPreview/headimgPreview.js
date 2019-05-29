
angular.module('App').controller('headimgPreviewCtl',function(appUtils,$timeout,$ionicHistory,$http,$Factory,$state,$rootScope,$scope,$stateParams,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	
	$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			$scope.userinfo=resData.data;
		}).catch(function(err){

		})

	//底部弹出框
	$scope.show = function(){
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: '从相册中选择' }
			],
			cancelText: '取消',
			cancel: function() {
			},
			buttonClicked: function(index) {
				if(index==0){
					$('#headimg_preview input').click();
					$('#headimg_preview input').change(function(){
						var file = $(this)[0].files[0];
						// accept="image/*"
						// if (file.type.startsWith('image')) {
						// }
						$scope.imgurl=URL.createObjectURL(file);
						$state.go('headimgCut',{imgurl:$scope.imgurl})
					});
				}
				return true;
			}
		});
	};
	 
	$scope.init = function () {
        new AlloyCrop({
            image_src: 'http://192.168.0.105:8100/3f9b9a83-1aa3-4407-9ffc-a0885962590f',
            circle: true, // optional parameters , the default value is false
            width: 200,
            height: 200,
            ok: function (base64, canvas) { $scope.$apply(function () { $scope.view = base64; }); },
            cancel: function () { $location.path("myAvatarPrev"); },
            ok_text: "确定", // optional parameters , the default value is ok
            cancel_text: "取消" // optional parameters , the default value is cancel
        });
    }	 
})
