angular.module('App')
.controller('myNeedsCtl',function(appUtils,enterViewLoad,$ionicPopup,$ionicActionSheet,$ionicLoading,$Factory,$http,$scope,$rootScope,$state,$stateParams,$ionicPopover,$timeout){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		if($stateParams.needtype=='buy'){
			$scope.isBuy=true;
			$scope.headTitle='求购'
		}else{
			$scope.isBuy=false;
			$scope.headTitle='求租'
		}

		var rotateNum = 0;
		$scope.transform= 'rotate(0deg)';
		$scope.switchBuySell=function(){
			rotateNum += 180;
			$scope.transform= 'rotate('+rotateNum+'deg)';
			if($scope.isBuy){
				$scope.isBuy=false;
				$scope.headTitle='求租'
				$scope.houseType=2;
				$scope.loadNeeds($scope.houseType)
			}else{
				$scope.isBuy=true;
				$scope.headTitle='求购'
				$scope.houseType=0;
				$scope.loadNeeds($scope.houseType)
			}
		}
		
		

		$scope.houseType=0
		$scope.switchHouseType=function(index){
			
			$scope.houseType=index;
			$scope.loadNeeds($scope.houseType)
		}
// 进入加载
		$scope.loadNeeds($scope.houseType)
	})



	$scope.loadNeeds=function(housetype){
		$http.get($Factory.HouseNeed.query.url,{params:{Type:housetype}})
			.then(function(resData){
				$scope.needList=resData.data
			}).catch(function(){
				$ionicLoading.show({
					template:'获取数据失败',
					duration:1500
				})
			})
	}
    
	
	$scope.showAction =function(needid){
		var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: '详情' },
              { text: '编辑' }
            ],
            destructiveText: '删除',
            // titleText: '操作',
			cancelText: '取消',
			destructiveButtonClicked:function(){
				var confirmPopup = $ionicPopup.confirm({
					title: '确定删除？',
					cancelText: '取消',
					okText: '删除'
				 });
				 confirmPopup.then(function(res){
					if(res) {
						$http.post($Factory.HouseNeed.delete.url,needid)
							.then(function(resData){
								enterViewLoad.customload('删除成功')
								$scope.loadNeeds($scope.houseType)
							}).catch(function(){
								enterViewLoad.customload('删除失败')
							})
					}else{
					}
				});
				
				hideSheet();
			},
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
				if(index==0){
					$state.go('needDetail',{id:needid})
				}else{
					if($scope.isBuy){
						$state.go('addBuyNeed',{type:$scope.houseType,id:needid})
					}else{
						$state.go('addRentNeed',{type:$scope.houseType,id:needid})
					}
				}
              return true;
            }
        });
    };


})


