angular.module('App').controller('evaluationDetailCtl',function(enterViewLoad,appUtils,$ionicModal,$localStorage,$ionicSlideBoxDelegate,$http,$Factory,$state,$stateParams,$scope,$rootScope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.houseId=$stateParams.houseid
	$scope.userId=$stateParams.userid

	
	$scope.$on('$ionicView.enter',function(){
		$scope.loadEvaluationDetail()
		$scope.loadHouseInfo()
	})
	$scope.myselfInfo=$localStorage.myselfInfo;
	//数字轮播序号
	$scope.currentIndex=0;
	$scope.changeindex=function(){	
		$scope.currentIndex=$ionicSlideBoxDelegate.$getByHandle('evaluation-detail-handle').currentIndex();
	}

	$scope.loadEvaluationDetail=function(){
		$http.get($Factory.Evalu.get.url,{params:{houseId:$scope.houseId,userId:$scope.userId,type:2}})
		.then(function(resData){
			resData.data.ReplyJson=JSON.parse(resData.data.ReplyJson)||[]
			$scope.evaluationDetail=resData.data
			
		}).catch(function(err){
			enterViewLoad.customload('获取评测列表失败')
		})
		
	}
	// 房源信息
	$scope.loadHouseInfo=function(){
		$http.post($Factory.NewHouseSource.postdetail.url+'/'+$scope.houseId)
			.then(function(resData){
				$scope.houseInfo=resData.data;
			})
	}
// 评论
	$scope.commentInput={
		comment:''
	}
	$scope.subComment=function(){
		$scope.closeCommentModal()
		var addData={
			comment:{
				userinfo:$localStorage.myselfInfo,
				content:$scope.commentInput.comment,
				likeNum:0,
				createTime:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
			}
		}
		$scope.evaluationDetail.ReplyJson.push(addData)
		enterViewLoad.customload('保存成功')
	}
	$ionicModal.fromTemplateUrl('evaluation_detail_comment_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.commentModal = modal;
	});
	$scope.showCommentModal=function(){
		$scope.commentModal.show();	
	}
	$scope.closeCommentModal=function(){
		$scope.commentModal.hide();
	}


	$scope.actionDo=function(agree,disagree,tip){
		$scope.evaluationDetail.AgreeNum=$scope.evaluationDetail.AgreeNum+agree
		$scope.evaluationDetail.DisAgreeNum=$scope.evaluationDetail.DisAgreeNum+disagree
		$scope.evaluationDetail.Tips=$scope.evaluationDetail.Tips+tip
		enterViewLoad.customload('操作成功')
	}
	$scope.$on('$ionicView.beforeLeave',function(){
		$scope.evaluationDetail.ReadNum++

		var realData=$scope.evaluationDetail
		realData.ReplyJson=JSON.stringify(realData.ReplyJson)
		$http.post($Factory.Evalu.reply.url,realData)
			.then(function(resData){
			}).catch(function(err){				
			})
	})
	
})