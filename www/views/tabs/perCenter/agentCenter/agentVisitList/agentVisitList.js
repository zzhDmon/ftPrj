angular.module('App')
.controller('agentVisitListCtl',function(appUtils,$ionicLoading,$ionicScrollDelegate,$ionicHistory,$Factory,$http,$scope,$state,$rootScope,$ionicPopover,$timeout){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.slideChoose=0;
	$scope.changeSlideChoose=function(index){
		$scope.slideChoose=index;
		var left=(20 * index) + 5 +'%'
		$("#agent_visit_list .head-slide .under-line").animate({
			left:left
		},150)
	}


	$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=0').then(function(res){
		$scope.wantlookList=res.data;
	})
	
	$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=3').then(function(res){
		$scope.checklookList=res.data;
	})

	
	$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=4').then(function(res){
		$scope.willtradeList=res.data;
	})
	
	$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=5').then(function(res){
		$scope.willtradeList=res.data;
	})
	
	$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=6').then(function(res){
		$scope.tradedList=res.data;
	})


	$scope.cancelLook=function($event,info){
		$event.stopPropagation()
		info.RecordStatus=2;
		$http.post($Factory.NewHouseTrade.looking.url,{params:info}).then(function(res){
			$ionicLoading.show({
				template:'操作成功',
				duration:1500
			});
			$http.post($Factory.NewHouseTrade.agentlist.url+'?recordStatus=0').then(function(res){
				$scope.wantlookList=res.data;
			})
		})
	}
	
	
})


