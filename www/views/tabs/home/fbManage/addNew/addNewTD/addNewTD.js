
angular.module('App').controller('addNewTDCtl',function($addNewData,appUtils,$localStorage,$rootScope,$scope,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.name = $stateParams.name;

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			if($stateParams.name=="楼盘名称"){
				$scope.title=$addNewData.data.NewHouseName||'';
				$scope.newtd= {content: $scope.title};
					$scope.save=function(){
						$addNewData.data.NewHouseName=$scope.newtd.content;
						$scope.back();
					}
			}else{
				$scope.landagent=$addNewData.data.LandAgent || '';
				$scope.newtd= {content: $scope.landagent};
				$scope.save=function(){
					$addNewData.data.LandAgent=$scope.newtd.content;		
					$scope.back();	
				}
			}
		})
		
		
	})
	
})
