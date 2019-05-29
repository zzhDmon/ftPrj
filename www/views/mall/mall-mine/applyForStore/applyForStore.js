angular.module('App').controller('applyForStoreCtl',function(upImgBase,appUtils,enterViewLoad,$ionicPopup,$ionicModal,$ionicListDelegate,$timeout,$http,$Factory,$state,$scope){
	$scope.back=function(){
		appUtils.back();
	};
	$scope.$on('$ionicView.enter',function(){
		$scope.subData={
			CategoryId:null,
			Details:'',
			BusinessLicenseImg:''
		}
		$scope.loadData()
	})
	$scope.$on('$ionicView.leave',function(){
	})
	
	$http.get($Factory.Account.getuserinfo.url)
		.then(function(resData){
			if(!resData.data.Role){
				var confirmPopup = $ionicPopup.confirm({
					title: '您还不是会员，暂无开店资格',
					cancelText: '取消',
					okText: '去开通'
				});				   
				confirmPopup.then(function(res) {
					if(res) {
							$state.go('openVip')
					}else{
						
					}
				});
			}
		}).catch(function(){
			
		})

	// 经营行业
	$scope.loadData=function(){
		$http.get($Factory.Category.query.url+'?pid=')
			.then(function(resData){
				$scope.classifyList=resData.data;
				$scope.subData.CategoryId=$scope.classifyList[0].id
			}).catch(function(){
				enterViewLoad.customload('获取分类列表失败')
			})
	}
	$scope.chooseCategory=function(id){
		$scope.subData.CategoryId=id
	}
	
		
	$ionicModal.fromTemplateUrl('apply_for_store_suc_modal', {
		scope: $scope,
		animation: 'slide-in-left'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
		$timeout(function(){
			$scope.back()
		},1000)
	}



	$scope.businessImgs=[]
	$('#apply_for_store .add-imgs-btn-business').on('click','.in-add-btn-business',function(){
		$(this).next().click();
	});
	$('#apply_for_store .add-imgs-btn-business').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			$http.post($Factory.Account.upload.url,{path:'18/mall/applyforstore',file:base})
				.then(function(resData){
					if(resData.data.error==0){
						$scope.businessImgs.push(resData.data.view)					
					}
				})
		})
	});
	$scope.deleteBusImg=function(index){
		$scope.businessImgs.splice(index,1)	
		$ionicListDelegate.closeOptionButtons();
	}

	$scope.idcardImgs=[]
	$('#apply_for_store .add-imgs-btn-idcard').on('click','.in-add-btn-idcard',function(){
		$(this).next().click();
	});
	$('#apply_for_store .add-imgs-btn-idcard').on('change','input',function(){
		var file = $(this)[0].files[0];
		upImgBase.changeBase(URL.createObjectURL(file),function(base){
			$http.post($Factory.Account.upload.url,{path:'18/mall/applyforstore',file:base})
				.then(function(resData){
					if(resData.data.error==0){
						$scope.idcardImgs.push(resData.data.view)					
					}
				})
		})
	});
	$scope.deleteIdcardImg=function(index){
		$scope.idcardImgs.splice(index,1)	
		$ionicListDelegate.closeOptionButtons();
	}

	$scope.save=function(){
		if(!$scope.subData.Details){
			enterViewLoad.customload('请输入经营范围！')
			return
		}
		if(!$scope.businessImgs.length){
			enterViewLoad.customload('请上传营业执照！')
			return
		}
		if(!$scope.idcardImgs.length){
			enterViewLoad.customload('请上传身份证照片！')
			return
		}

		var subImgs=$scope.businessImgs.concat($scope.idcardImgs)
		$scope.subData.BusinessLicenseImg=subImgs.join('|')
		$http.post($Factory.Shoper.create.url,$scope.subData)
			.then(function(resData){
				$scope.showModal()
			}).catch(function(err){
				if(err.status==400&&err.data.Message=='权限不足'){
					var confirmPopup = $ionicPopup.confirm({
							title: '个人会员以上才可开店！',
							cancelText: '取消',
							okText: '去开通'
						});				   
					confirmPopup.then(function(res) {
					   if(res) {
							$state.go('openVip')
					   }else{
						
					   }
					});
				}else{
					enterViewLoad.customload('操作失败！')
				}
			})
	}
})