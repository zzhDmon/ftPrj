
angular.module('App').controller('groupAvatarCutCtl',function(NimUtils,appUtils,enterViewLoad,$rootScope,$scope,$stateParams,$ionicHistory,$http,$Factory,$ionicLoading,$timeout){
	$scope.back=function(){
		appUtils.back();
	}	
	$scope.imgurl=$stateParams.imgurl;
	$scope.targetId=$stateParams.id;
	
	$scope.init = function () {
        new AlloyCrop({
            image_src: $scope.imgurl,
            circle: true, 
            width: 200,
            height: 200,
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
				path:'18/teamAvatar',
				file:$scope.view
			}).then(function(resData){
					$scope.ShowImage=resData.data.view;
					
					$scope.changeTeamAvatar();
				},function(err){
					enterViewLoad.customload('保存图片失败')
					$timeout(function(){
						$scope.back()
					},1500)
				})
		};
		// 修改群头像
		$scope.changeTeamAvatar=function(){
			nim.updateTeam({
				teamId: $scope.targetId,
				avatar: $scope.ShowImage,
				done: updateTeamDone
			});
			function updateTeamDone(error,team){
				if(!error){
					enterViewLoad.customload('修改成功')
					$timeout(function(){
						$scope.back()
					},1500)
				}else{
					enterViewLoad.customload('修改失败')
					$timeout(function(){
						$scope.back()
					},1500)
				}
			}
		}
			
	}
	
})
