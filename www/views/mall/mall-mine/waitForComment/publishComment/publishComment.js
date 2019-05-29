angular.module('App').controller('publishCommentCtl',function($waitForCommentData,upImgBase,enterViewLoad,appUtils,$ionicPopup,$interval,$ionicModal,$timeout,$http,$Factory,$state,$stateParams,$scope){
	$scope.back=function(){
		appUtils.back()
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.productInfo=$waitForCommentData.data
		$scope.commentData={
			TradeNo: $scope.productInfo.TradeNo,
			ProductStar:3,
			ShopStar:3,
			LogisticsStar:3,
			IsAnonymous: true,
			Content: "",
			Images: "",
			ProductId: $scope.productInfo.productInfo.ProductId,
		}
	})
	
	$scope.switchCheck=function(){
		$scope.commentData.IsAnonymous = !$scope.commentData.IsAnonymous
	}
	// 限制评论100字
	$scope.checkLength=function(){
		if($scope.commentData.Content.length>100){
			enterViewLoad.customload('评论内容少于100字')
			$scope.commentData.Content = $scope.commentData.Content.substr(0,101)
		}
	}
	/*评分*/
	$scope.ratingsObject = {
		iconOn: 'ion-ios-star',//活动图标，默认"ion-ios-star"
		iconOff: 'ion-ios-star-outline',//非活动(非选中)图标,默认"ion-ios-star-outline"
		iconOnColor: 'rgb(255,210,2)',//活动图标颜色,默认值
		iconOffColor:  'rgb(102,102,102)',//非活动图标颜色,默认值
		rating: 3,// 默认显示的打分值
		minRating: 0,//最小显示打分值
		iconSize: '25px',//icon图标大小,默认为"none"
		iconMargin:'13px', //图标之间距离,默认"3px"
		readOnly: false, //禁止点击，只能读，默认false
		callback: function(rating) { //点击之后的回调函数
			$scope.commentData.ProductStar=rating  
		}
	};
	/*商家评分2*/
	$scope.ratingsObjecttwo = {
		iconOn: 'ion-ios-star',
		iconOff: 'ion-ios-star-outline',
		iconOnColor: 'rgb(255,210,2)',
		iconOffColor:  'rgb(102,102,102)',
		rating: 3,
		minRating: 0,
		iconSize: '25px',
		iconMargin:'13px',
		readOnly: false,
		callback: function(rating) {
			$scope.commentData.ShopStar=rating 
		}
	};
	/*物流评分3*/
	$scope.ratingsObjectthree = {
		iconOn: 'ion-ios-star',
		iconOff: 'ion-ios-star-outline',
		iconOnColor: 'rgb(255,210,2)',
		iconOffColor:  'rgb(102,102,102)',
		rating: 3,
		minRating: 0,
		iconSize: '25px',
		iconMargin:'13px',
		readOnly: false,
		callback: function(rating) {
			$scope.commentData.LogisticsStar=rating 
		}
	};
	
	
	// 点击添加图片
	$scope.commentImgs=[]
	$('#publish_comment .comment-imgs').on('click','.txt-in',function(){
		$(this).next().click();
	});
	$('#publish_comment .comment-imgs').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			$http.post($Factory.Account.upload.url,{path:'18/mall/publishComment',file:base})
				.then(function(resData){
					if(resData.data.error==0){
						if($scope.commentImgs.length>10){
							$scope.commentImgs.shift()
							$scope.commentImgs.push(resData.data.view)
						}else{
							$scope.commentImgs.push(resData.data.view)				
						}
					}
				})
		})
	});
	$scope.deleteImg=function(index){
		$scope.commentImgs.splice(index,1)
	}
	// 添加评论
	$scope.addComment=function(item){
		if(!$scope.commentData.Content){
			enterViewLoad.customload('请输入评价内容')
			return
		}
		$scope.commentData.Images=$scope.commentImgs.join('|')
		
		$http.post($Factory.Product.commentadd.url,$scope.commentData)
			.then(function(resData){
				enterViewLoad.customload('评论成功')
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(){
				enterViewLoad.customload('评论失败')
			})
	}
})
/**
 *  星级评分
 * ion-star是ionic星星图标可以自行更换
 *  readonly为false指可进行评价操作，true指只能看
 *  <star-rating ng-model="bo.evaluation" max-value="maxVal" on-change="startsChange" readonly='false'></star-rating>
 *
 */
.directive('ionicRatings', [function() {
    return {
		restrict: 'AE',
		replace: true,
		template: '<div class="ionic_ratings">' +
		'<span class="icon {{::iconOff}} ionic_rating_icon_off" ng-style="::iconOffColor" ng-click="ratingsClicked(1)" ng-show="rating < 1"></span>' +
		'<span class="icon {{::iconOn}} ionic_rating_icon_on" ng-style="::iconOnColor" ng-click="ratingsUnClicked(1)" ng-show="rating > 0"></span>' +
		'<span class="icon {{::iconOff}} ionic_rating_icon_off" ng-style="::iconOffColor" ng-click="ratingsClicked(2)" ng-show="rating < 2"></span>' +
		'<span class="icon {{::iconOn}} ionic_rating_icon_on" ng-style="::iconOnColor" ng-click="ratingsUnClicked(2)" ng-show="rating > 1"></span>' +
		'<span class="icon {{::iconOff}} ionic_rating_icon_off" ng-style="::iconOffColor" ng-click="ratingsClicked(3)" ng-show="rating < 3"></span>' +
		'<span class="icon {{::iconOn}} ionic_rating_icon_on" ng-style="::iconOnColor" ng-click="ratingsUnClicked(3)" ng-show="rating > 2"></span>' +
		'<span class="icon {{::iconOff}} ionic_rating_icon_off" ng-style="::iconOffColor" ng-click="ratingsClicked(4)" ng-show="rating < 4"></span>' +
		'<span class="icon {{::iconOn}} ionic_rating_icon_on" ng-style="::iconOnColor" ng-click="ratingsUnClicked(4)" ng-show="rating > 3"></span>' +
		'<span class="icon {{::iconOff}} ionic_rating_icon_off" ng-style="::iconOffColor" ng-click="ratingsClicked(5)" ng-show="rating < 5"></span>' +
		'<span class="icon {{::iconOn}} ionic_rating_icon_on" ng-style="::iconOnColor" ng-click="ratingsUnClicked(5)" ng-show="rating > 4"></span></div>',
		scope: {
		  // 绑定ionicRatings指令的属性ratingsobj
		  ratingsObj: '=ratingsobj'
		},
		link: function(scope, element, attrs) {
  
		  //初始化默认值
		  scope.iconOn = scope.ratingsObj.iconOn || 'ion-ios-star';
		  scope.iconOff = scope.ratingsObj.iconOff || 'ion-ios-star-outline';
		  scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(27,197,187)';
		  scope.iconOffColor =  scope.ratingsObj.iconOffColor || 'rgb(27,197,187)';
		  scope.iconSize = scope.ratingsObj.iconSize || 'none';
		  scope.iconMargin = scope.ratingsObj.iconMargin || '3px';
		  scope.rating =  scope.ratingsObj.rating || 1;
		  scope.minRating = scope.ratingsObj.minRating || 0;
		  
		  if(!scope.ratingsObj.readOnly) {
			scope.readOnly = false;
		  }else {
			scope.readOnly = scope.ratingsObj.readOnly;
		  }
		  
  
		  //设置活动图标颜色
		  scope.iconOnColor = {
				color: scope.iconOnColor,
				fontSize: scope.iconSize,
				marginLeft: scope.iconMargin
		  };
  
		  //设置非活动图标颜色
		  scope.iconOffColor = {
			color: scope.iconOffColor,
			fontSize: scope.iconSize,
			marginLeft: scope.iconMargin
		  };
  
		  //设置显示评论值
		  scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;
  
		  //设置中间变量保存已设置的值
		  scope.prevRating = 0;
  
		  // 禁止点击，只能读
		  if(scope.readOnly) {
			var icons = element[0].querySelectorAll('.icon');
			icons.forEach(function(ele) {
			  ele.style.pointerEvents = 'none'
			});
  
		  }
		  //调用点击函数
		  scope.ratingsClicked = function(val) {
			if(scope.minRating !== 0 && val < scope.minRating) {
			  scope.rating = scope.minRating;
			}else {
			  scope.rating = val;
			}
  
			scope.prevRating = val;
  
			scope.ratingsObj.callback(scope.rating);
		  };
  
		  //调用取消的点击函数
		  scope.ratingsUnClicked = function(val) {
			if(scope.minRating !== 0 && val < scope.minRating) {
			  scope.rating = scope.minRating;
			} else {
			  scope.rating = val;
			}
			if (scope.prevRating == val) {
			  if (scope.minRating !== 0) {
				scope.rating = scope.minRating;
			  } else {
				scope.rating = 0;
			  }
			}
			scope.prevRating = val;
  
			scope.ratingsObj.callback(scope.rating);
		  };
		}
	  }
  }]);
