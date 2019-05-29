
angular.module('App').controller('addShopTDCtl',function($addShopData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.name = $stateParams.name;

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			if($scope.name=="标题"){
				$scope.placeholder="简单明了的说出房源的特色"
				$scope.ershoutd= {content: $addShopData.data.Title||''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addShopData.data.Title=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else if($scope.name=="商铺详情"){
				$scope.placeholder="请输入商铺描述。"
				$scope.ershoutd= {content: $addShopData.data.Discription || ''};
				$scope.templeteType=1;
				
				$scope.save=function(){
					$addShopData.data.Discription=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else{
				$scope.save=function(){
					$rootScope.$ionicGoBack();
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
		var req={
			method: 'POST',
			url: $Factory.TextTemplate.save.url,
			headers: {
			  'Content-Type': 'application/json'
			},
			data:{TextType:$scope.templeteType,Content:$scope.ershoutd.content}
		}
		// $http(req)
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
