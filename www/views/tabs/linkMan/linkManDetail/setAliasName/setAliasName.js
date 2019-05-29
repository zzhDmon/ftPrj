
angular.module('App').controller('setAliasNameCtl',function(NimUtils,appUtils,enterViewLoad,$ionicPopup,$timeout,$ionicHistory,$ionicLoading,$rootScope,$http,$Factory,$scope,$stateParams,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.targetId = $stateParams.id;
	$scope.userinfo={
		Name:'',
		Tag:'朋友'
	}
	$scope.nameEmpty=function(){
		$scope.userinfo.Name=''
	}

	$scope.$on('$ionicView.enter',function(){
		var myFriends = NimUtils.myFriends;
		for(var i=0;i<myFriends.length;i++){
			if(myFriends[i].account===$stateParams.id){
				$scope.userinfo.Name=myFriends[i].alias || ''
			}
		}
	})
	
	// 标签
	$.scrEvent({
		data: ['朋友','票友','同事','同学','家人'], 
		evEle: '.setaliasname-tag',          
		title: '选择标签分类',           
		defValue: '朋友',           
		afterAction: function (data) {
			$(".setaliasname-tag").val(data);
			$scope.userinfo.Tag=data;
		}
	});


	$scope.isBlack={
		data: NimUtils.isBlack($scope.targetId)
	}
	$scope.blockChange=function(){
		if($scope.isBlack.data){
			var confirmPopup = $ionicPopup.confirm({
				title: '确定加入黑名单？',
				cancelText: '取消',
				okText: '确认'
			});
			confirmPopup.then(function(res) {
				if(res) {

				}else{
					$scope.isBlack.data=false
				}
			})
		}
	}

    $scope.save=function(){
		nim.updateFriend({
			account: $scope.targetId,
			alias: $scope.userinfo.Name,
			done: updateFriendDone
		});
		function updateFriendDone(error, obj){
			if (!error) {
				enterViewLoad.customload('保存成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}else{
				enterViewLoad.customload('修改备注失败')
			}
		}
		// 黑名单操作后
		if($scope.clickCheckBox){
			if($scope.isBlack.data){
				$scope.addBlack()
			}else{
				$scope.removeBlack()
			}
		}
    }
	$scope.addBlack=function(){
		nim.addToBlacklist({
			account: $scope.targetId,
			done: addToBlacklistDone
		});
		function addToBlacklistDone(error, obj) {
			if (!error) {
				enterViewLoad.customload('保存成功')
				NimUtils.blacklist = nim.mergeRelations(NimUtils.blacklist, obj.record);
			}
		}
	}
	// 移除
	$scope.removeBlack=function(){
		nim.removeFromBlacklist({
			account: $scope.targetId,
			done: removeFromBlacklistDone
		});
		function removeFromBlacklistDone(error, obj) {
			if (!error) {
				enterViewLoad.customload('保存成功')
				NimUtils.blacklist = nim.cutRelations(NimUtils.blacklist, obj.record);
			}
		}
	}
	
	// /setaliasname/params/292f659ac9e247bea46a35ec5ac73e84
});
