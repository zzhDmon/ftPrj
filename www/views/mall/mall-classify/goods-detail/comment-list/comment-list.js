angular.module('App').controller('commentListCtl',function(enterViewLoad,appUtils,$ionicModal,$stateParams,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		$scope.loadData()
		$scope.keyboardShow=false
	})
	$scope.loadData=function(){
		$http.get($Factory.Product.get.url+'?id='+$stateParams.id).then(function(resData){
			
			$scope.productDetail=resData.data
		}).catch(function(){
			enterViewLoad.customload('获取评论列表失败')
		})
	}

	// 点赞
	$scope.agreeComment=function(item){
		$http.post($Factory.Product.agree.url+'?id='+item.Id)
			.then(function(res){
				item.AgressUsers.push(0)
			}).catch(function(err){
				var msg = err.data.Message || '点赞失败'
				enterViewLoad.customload(msg)
			})
	}

	// 评论
	$ionicModal.fromTemplateUrl('product_commentlist_modalview', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.commentsModal = modal;
	});
	$scope.showCommentsModal=function(item){
		$scope.commentsModal.show();	
		$scope.parentComment=item;
		$scope.getChildComments()
	}
	$scope.closeCommentsModal=function(){
		$scope.commentsModal.hide();
	}
	// 获取评论回复
	$scope.getChildComments=function(){
		$http.post($Factory.Product.comments.url+'?pid='+$scope.parentComment.Id)
			.then(function(res){
				$scope.childComments=res.data
			}).catch(function(err){
				
			})
	}
	// 回复评论
	$scope.replayData={
		data:''
	}
	$scope.replyComment=function(){
		if(!$scope.replayData.data){
			enterViewLoad.customload('请输入回复内容！')
			return
		}
		$http.post($Factory.Product.replycomment.url,{
				Content: $scope.replayData.data,
				ParentId: $scope.parentComment.Id,
		  	}).then(function(res){
				$scope.replayData.data='';
				$scope.getChildComments()
				$scope.parentComment.ChildrenCount++
			}).catch(function(err){
				enterViewLoad.customload('回复失败！')
			})
	}
	
	$scope.keyboardHeight=null
	window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
			if(!$scope.keyboardHeight){
				$scope.keyboardHeight=e.keyboardHeight
			}
            $scope.keyboardShow=true  
		})
    }) 
    window.addEventListener('native.keyboardhide',function(e){
		$timeout(function(){
			$scope.keyboardShow=false
		})
    })
})