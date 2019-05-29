angular.module('App').controller('openVipCtl',function(appUtils,enterViewLoad,$ionicActionSheet,$ionicScrollDelegate,$ionicSlideBoxDelegate,$ionicHistory,$timeout,$scope,$rootScope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back(); 
	}
	$scope.$on('$ionicView.enter',function(){
		$scope.getLevel()
	})


	$scope.getLevel=function(){
		// 当前等级
		$http.get($Factory.Account.getuserinfo.url)
			.then(function(resData){
				$scope.currentRole=resData.data.Role;
					switch(resData.data.Role){
						case '普通':
							$scope.currentVipLevel=0;
							break;
						case '白银':
							$scope.currentVipLevel=1;
							break;
						case '黄金':
							$scope.currentVipLevel=2;
							break;
						case '铂金':
							$scope.currentVipLevel=3;
							break;
						case '钻石':
							$scope.currentVipLevel=4;
							break;
						case '股东':
							$scope.currentVipLevel=5;
							break;
						default:
							$scope.currentVipLevel=0;
							break;
					}
					$scope.currentClass='personal'
					// 剩余时间
					$scope.roleDay=resData.data.RoleDay
			}).catch(function(err){
				$scope.currentVipLevel=0;
				$scope.currentClass='personal'
			})
		
		$http.get($Factory.ReChange.query.url)
			.then(function(resData){
				// 可选vip
				$scope.chooseableVip=resData.data;
				for(var i=0;i<resData.data.length;i++){
					
					if(resData.data[i].Title=='个人会员'){
						$scope.personPrice=(resData.data[i].TotalFee/100).toFixed(2)
					}else if(resData.data[i].Title=='团队首领'){
						$scope.teamPrice=(resData.data[i].TotalFee/100).toFixed(2)
					}else if(resData.data[i].Title=='商户老板'){
						$scope.shopPrice=(resData.data[i].TotalFee/100).toFixed(2)
					}else if(resData.data[i].Title=='企业主'){
						$scope.businessPrice=(resData.data[i].TotalFee/100).toFixed(2)
					}else{}
				}
			}).catch(function(err){
			})
	}
	
	$scope.goPayVip=function(){
		if($scope.wantVipLevel<=$scope.currentVipLevel){
			var msg = '个人会员'
			if($scope.currentVipLevel==1){
				msg = '个人会员'
			}else if($scope.currentVipLevel==2){
				msg = '团队首领'
			}else if($scope.currentVipLevel==3){
				msg = '商户老板'
			}else if($scope.currentVipLevel==4){
				msg = '企业主'
			}else{}
			enterViewLoad.customload('您已开通'+msg)
		}else{
			var payParams={productid:'',price:'',vipname:''};
			var paramsIndex=$scope.wantVipLevel - $scope.currentVipLevel -1;
			payParams.productid=$scope.chooseableVip[paramsIndex].Id;
			payParams.price=$scope.chooseableVip[paramsIndex].TotalFee;
			payParams.vipname=$scope.chooseableVip[paramsIndex].Title;
			
			$state.go('tabs.payVip',payParams)
		}
	}

	$scope.vipLevelImgs=[
		"imgs/viplevel/个人会员.png",
		"imgs/viplevel/团队首领.png",
		"imgs/viplevel/商户老板.png",
		"imgs/viplevel/企业主.png",
	]
	// 滑动图片
	$scope.wantVipLevel=1;
	$scope.changeindex=function(){
		$scope.wantVipLevel=$ionicSlideBoxDelegate.$getByHandle('vip-level-slide-handle').currentIndex() + 1;
		// 更新DOM高度
		$ionicScrollDelegate.resize();
		if($scope.wantVipLevel==1){
			$scope.currentClass='personal'
		}else if($scope.wantVipLevel==2){
			$scope.currentClass='team'
		}else if($scope.wantVipLevel==3){
			$scope.currentClass='shop'
		}else if($scope.wantVipLevel==4){
			$scope.currentClass='company'
		}
	}
	$scope.prePage=function(){
		$ionicSlideBoxDelegate.$getByHandle('vip-level-slide-handle').previous()
	}
	$scope.nextPage=function(){
		$ionicSlideBoxDelegate.$getByHandle('vip-level-slide-handle').next()
	}

	$scope.applyMoney=function(){
		var hideSheet = $ionicActionSheet.show({
            buttons: [
              	{ text: '申请退款' },
            ],
			cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				$http.post($Factory.WaitReceive.refound.url)
				.then(function(){
					enterViewLoad.customload('申请成功')
				}).catch(function(){
					enterViewLoad.customload('操作失败')
				})
				return true;
			}
        });
	}

})	
.filter('cutVipName', function () {
  return function (value) {
    if (!value){
    	return ''
    } ;

	var result;
	
    result = value.slice(0,-1) 

    return result;
  };
});
