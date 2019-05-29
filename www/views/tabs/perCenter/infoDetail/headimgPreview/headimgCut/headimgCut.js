
angular.module('App').controller('headimgCutCtl',function(NimUtils,appUtils,enterViewLoad,$rootScope,$scope,$stateParams,$ionicHistory,$http,$Factory,$ionicLoading,$timeout){
	$scope.back=function(){
		appUtils.back();
	}	
	$scope.imgurl=$stateParams.imgurl;
	
	$scope.init = function () {
        new AlloyCrop({
            image_src: $scope.imgurl,
            circle: false, 
            width: 300,
			height: 300,
			output: 1,
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
	
	$scope.$on('$ionicView.enter',function(){
			$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				$scope.userinfo = resData.data;
			}).catch(function(){
			})
	    })
	
	
	$scope.done=function(){
		// 上传图片
		$scope.save=function(){
			$http.post($Factory.Account.upload.url,{
				path:'18/userHeadImg',
				file:$scope.view
			}).then(function(resData){
					$scope.userinfo.Image=resData.data.url;
					$scope.userinfo.ShowImage=resData.data.view;
					
					$scope.changeUserinfo();
					$scope.changeJMinfo();
				},function(err){
					enterViewLoad.customload('保存图片失败')
					
					$timeout(function(){
						$scope.back()
					},1500)
				})
		};
		// 修改头像
		$scope.changeUserinfo=function(){
			$http.post($Factory.Account.setuserinfo.url,$scope.userinfo)
				.then(function(resData){
					enterViewLoad.customload('修改成功')
					$timeout(function(){
						$scope.back()
					},1500);
				},function(err){
					enterViewLoad.customload('修改失败')
					$timeout(function(){
						$scope.back()
					},1500)
				})
		};
		// 云信
		$scope.changeJMinfo=function(){
			nim.updateMyInfo({
				avatar: $scope.userinfo.ShowImage,
				done: updateMyInfoDone
			});
			function updateMyInfoDone(error, user) {
				if (!error) {
					NimUtils.updateMyInfo()
				}else{
					enterViewLoad.customload('聊天头像修改失败')	
				}
			}
		};
			
	}
	
})
