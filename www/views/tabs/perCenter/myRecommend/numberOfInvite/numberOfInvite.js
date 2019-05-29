angular.module('App').controller('numberOfInviteCtl',function(appUtils,enterViewLoad,WechatService,$location,wechatLinkBase,$ionicModal,$rootScope,$ionicScrollDelegate,$timeout,$scope,$state,$stateParams,$http,$Factory,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$http.post($Factory.Account.gethier.url)
			.then(function(res){
				res.data.total=(res.data.total/100).toFixed(2)
				res.data.childCount=0;
				for(var i=0;i<res.data.children.length;i++){
					res.data.childCount += res.data.children[i].Children.length;
				}
				$scope.myInvitation=res.data;
			}).catch(function(){
				enterViewLoad.customload('获取失败')
			})
	
		$scope.subListActive=null
		$scope.showSubList=function(index){
			if($scope.subListActive==index){
				$scope.subListActive=null
			}else{
				$scope.subListActive=index;
			}
			$ionicScrollDelegate.resize();
		}
	})

	
	// 点击用户头像
	$scope.toLinkMan=function(uid){
		$http.post($Factory.Neteast.user.url+'?id='+uid).then(function(resData){
			if(resData.data.return_code=="SUCCESS"){
				$state.go('linkManDetail',{account:resData.data.return_msg.accid})
			}else{
				$ionicLoading.show({
					template:resData.data.return_msg,
					duration:1500
				})
			}
		}).catch(function(){
			enterViewLoad.customload('用户未开通微聊');
		})
	}
})
