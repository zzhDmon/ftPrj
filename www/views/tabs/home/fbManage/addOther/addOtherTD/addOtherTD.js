
angular.module('App').controller('addOtherTDCtl',function($addOtherData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$localStorage,$rootScope,$scope,$state,$stateParams,$timeout){
	$scope.back=function(){
		appUtils.back();	
	}
	
	$scope.name = $stateParams.name;

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			if($scope.name=="标题"){
				$scope.placeholder='请输入房源标题信息'
				$scope.ershoutd= {content: $addOtherData.data.Title||''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addOtherData.data.Title=$scope.ershoutd.content;
					$scope.back();
				}
			}else if($scope.name=="房源描述"){
				if($addOtherData.data.HouseType==2){
					$scope.placeholder='请输入商圈描述信息'
				}else if($addOtherData.data.HouseType==3){
					$scope.placeholder='请输入厂房描述信息'
				}else if($addOtherData.data.HouseType==4){
					$scope.placeholder='请输入仓库描述信息'
				}else if($addOtherData.data.HouseType==5){
					$scope.placeholder='请输入车位描述信息'
				}else{
					$scope.placeholder='请输入房源描述信息'
				}
				$scope.ershoutd= {content: $addOtherData.data.Discription || ''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addOtherData.data.Discription=$scope.ershoutd.content;
					$scope.back();
				}
			}else{
				$scope.save=function(){
					$scope.back();
				}
			}

			$scope.getData=function(){
				$http.get($Factory.TextTemplate.query.url,{params:{type:$scope.templeteType,isself:true}}).then(function(resData){
					$scope.selfArr=resData.data
				})
				$http.get($Factory.TextTemplate.query.url,{params:{type:$scope.templeteType,isself:false}}).then(function(resData){
					$scope.pubArr=resData.data
				})
			}
			$scope.getData()
		})
		
	})

	$scope.showTemplete=true;
	$scope.closeTemplete=function(){
		$scope.showTemplete=false
	}
	$scope.chooseTemp=function(content){
		$scope.ershoutd.content=content;
		$scope.closeTemplete();
	}

	$scope.saveTemp=function(){
		if($scope.ershoutd.content.length<1){
			enterViewLoad.customload('模板不能为空')
			return
		}
		
		$http.post($Factory.TextTemplate.save.url,{
			TextType:$scope.templeteType,
			Content:$scope.ershoutd.content}).then(function(resData){
			$scope.getData();
			enterViewLoad.customload('保存模板成功')
		}).catch(function(err){
			if(err.status==401){
				enterViewLoad.customload('尚未登录')
				$timeout(function(){
					$state.go('login')
				},1500)
			}
		})
	}
	

	$scope.delTemp=function(id){
		$http.post($Factory.TextTemplate.delete.url+'?id='+id)
			.then(function(resData){
				$scope.getData()
			})
	}

})
