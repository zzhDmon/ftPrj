angular.module('App').controller('addSellTDCtl',function($addSellData,enterViewLoad,appUtils,$ionicLoading,$Factory,$http,$cordovaKeyboard,$localStorage,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.name = $stateParams.name;

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			if($scope.name=="标题"){
				$scope.placeholder="简单明了的说出房源的特色。"
				$scope.ershoutd= {content: $addSellData.data.Title||''};
				$scope.templeteType=1;
				
				$scope.save=function(){
					$addSellData.data.Title=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else if($scope.name=="房源详情"){
				$scope.placeholder="请输入房产描述。"
				$scope.ershoutd= {content: $addSellData.data.Discription || ''};
				$scope.templeteType=1;

				$scope.save=function(){
					$addSellData.data.Discription=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else if($scope.name=="业主心态"){
				$scope.placeholder="请输入业主心态，可从房东卖房原因、是否急售等方面进行描述。"
				$scope.ershoutd= {content: $addSellData.data.OwnerPsy || ''};
				$scope.templeteType=2;
				
				$scope.save=function(){
					$addSellData.data.OwnerPsy=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else if($scope.name=="小区配套"){
				$scope.placeholder="请输入小区配套"
				$scope.ershoutd= {content: $addSellData.data.Commuport || ''};
				$scope.templeteType=3;
				
				$scope.save=function(){
					$addSellData.data.Commuport=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else if($scope.name=="服务介绍"){
				$scope.placeholder="请输入服务介绍，可从行业年限、专业经验、服务态度、可提供的服务种类（比如代办贷款）等方面进行描述。"
				$scope.ershoutd= {content: $addSellData.data.ServiceIntro || ''};
				$scope.templeteType=4;
				
				$scope.save=function(){
					$addSellData.data.ServiceIntro=$scope.ershoutd.content;
					$rootScope.$ionicGoBack();
				}
			}else{

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

	$scope.chooseTemp=function(content){
		$scope.ershoutd.content=content;
		$scope.closeTemplete();
	}

	$scope.delTemp=function(id){
		var req={
			method: 'POST',
			url: $Factory.TextTemplate.delete.url+'?id='+id,
			headers: {
			  'Content-Type': 'application/json'
			},
		}
		$http(req).then(function(resData){
			$scope.getData()
		})
	}
})
