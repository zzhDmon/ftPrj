
angular.module('App').controller('groupAvatarCtl',function(appUtils,$timeout,$http,$Factory,$state,$rootScope,$scope,$stateParams,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.targetId=$stateParams.id	

	$scope.$on('$ionicView.enter',function(){
		nim.getTeam({
			teamId: $scope.targetId,
			done: getTeamDone
		});
		function getTeamDone(error, obj) {
			if(!error){
				$timeout(function(){
					$scope.targetInfo=obj
				})
			}
		}
	})

	
	//底部弹出框
	$scope.show = function(){
		$('#group_avatar input').click();
		$('#group_avatar input').change(function(){
			var file = $(this)[0].files[0];
			// accept="image/*"
			if (file.type.startsWith('image')) {
				$scope.imgurl=URL.createObjectURL(file);
				$state.go('groupAvatarCut',{id:$scope.targetId,imgurl:$scope.imgurl})
			}
		});
		// var hideSheet = $ionicActionSheet.show({
		// 	buttons: [
		// 		{ text: '从相册中选择' }
		// 	],
		// 	cancelText: '取消',
		// 	cancel: function() {
		// 	},
		// 	buttonClicked: function(index) {
		// 		if(index==0){
					
		// 		}
		// 	return true;
		// 	}
		// });
	};
	  
})
