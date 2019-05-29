angular.module('App').controller('agentEntranceCtl',function(appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.initData()
	})

	$scope.initData=function(){
		//房源加载 
		$scope.oldQueryData={
			cityId:1,
			pagesize:5,
			pagenum:0,
			type:1,
			query:'',
			district:'',
			street:'',
			minprize:'',
			maxprize:'',
			roomType:'',
			sort:''
		}
		$http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.oldQueryData})
			.then(function(resData){
				$scope.$broadcast('scroll.refreshComplete');
				for(var i=0;i<resData.data.length;i++){
					var str=resData.data[i].Thumb
					resData.data[i].Thumb=str.replace(/230x150/, "90x90")
				}
				$scope.oldhousearr=resData.data;
			}).catch(function(){
				$scope.$broadcast('scroll.refreshComplete');
			})
	}
	
})