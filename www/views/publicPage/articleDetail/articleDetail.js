
angular.module('App').controller('articleDetailCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$ionicPopover,$ionicPopup,$timeout,$ionicActionSheet){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.loadhousetimes=function(){	
		$http.get($Factory.Zone.get.url,{params:{id:$stateParams.id}}).then(function(resData){
			if($localStorage.myselfInfo&&(resData.data.AgressUsers.indexOf($localStorage.myselfInfo.Id)>=0)){
				resData.data.agreed=true
			}
			resData.data.agreeNum = resData.data.AgressUsers.length;
			$scope.dataDetail=resData.data
			
			$timeout(function(){
				$('br').parent().css("height","10");
			})
			$scope.likeNum=resData.data.Persons ? resData.data.Persons.length : 0;
			
		}).catch(function(){
			enterViewLoad.customload('获取房产时报失败')
		})
	}	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadhousetimes()
	})

	// 点赞
	$scope.agreeAction=function(item){
		if(!$localStorage.myselfInfo){
			$state.go('login')
			return
		}
		if($scope.dataDetail.agreed) return
		$http.post($Factory.Zone.agree.url+'?id='+$stateParams.id).then(function(resData){
			$scope.dataDetail.agreed=true
			$scope.dataDetail.agreeNum++
		}).catch(function(err){
			enterViewLoad.customload('操作失败');
		})
	}
	// 回复
    $scope.replyData={
        data:''
	}
	$scope.replyComment=function(){
        if(!$scope.replyData.data) return
        $http.post($Factory.Zone.save.url,{
            type:70,
            ParentId:$stateParams.id,
            Content:$scope.replyData.data
        }).then(function(res){
			$scope.dataDetail.Children.push({
				UserId:$localStorage.myselfInfo.Id,
				UserName:$localStorage.myselfInfo.NickName,
				UserImage:$localStorage.myselfInfo.ShowImage,
				Content:$scope.replyData.data
			})
			$scope.dataDetail.ChildrenCount +=1
			$scope.replyData.data='';
        }).catch(function(){
            $scope.replyData.data=''
            enterViewLoad.customload('评论失败');
        })
    }
    $scope.keyboardHeight=null
    window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
            if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
                $scope.keyboardHeight=e.keyboardHeight
            }
            $scope.keyboardShow=true  
        })
    }) 
    window.addEventListener('native.keyboardhide',function(e){
        $timeout(function(){
            $scope.keyboardShow=false;
            $scope.showBotReply=false;
        })
	})
	
})

