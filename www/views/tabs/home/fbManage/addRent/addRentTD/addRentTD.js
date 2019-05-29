
angular.module('App').controller('addRentTDCtl',function($addRentData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.name = $stateParams.name;

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		
		$timeout(function(){
			if($scope.name=="标题"){
				$scope.placeholder='请输入房源标题信息'
				$scope.renttd= {content: $addRentData.data.Title||''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addRentData.data.Title=$scope.renttd.content;
					$scope.back();
				}
			}else{
				$scope.placeholder='请输入房源描述信息'
				$scope.renttd= {content:$addRentData.data.Discription || ''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addRentData.data.Discription=$scope.renttd.content;
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
		$scope.renttd.content=content;
		$scope.closeTemplete()
	}

	$scope.saveTemp=function(){
		if($scope.renttd.content.length<1){
			enterViewLoad.customload('模板不能为空')
			return
		}
		$http.post($Factory.TextTemplate.save.url,{
			TextType:$scope.templeteType,
			Content:$scope.renttd.content}).then(function(resData){
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
