angular.module('App')
.controller('orderVisitListCtl',function(appUtils,$ionicLoading,$ionicHistory,$Factory,$http,$scope,$state,$rootScope,$ionicPopover,$timeout){
	$scope.back=function(){
		appUtils.back();
    }

	$http.post($Factory.NewHouseTrade.orderlist.url+'?recordStatus=0').then(function(res){
		$scope.wantlookList=res.data;
	})
	// 交易
	$http.post($Factory.NewHouseTrade.orderlist.url+'?recordStatus=4').then(function(res){
		$scope.willtradeList=res.data;
	})
	// 交易完成
	$http.post($Factory.NewHouseTrade.orderlist.url+'?recordStatus=6').then(function(res){
		$scope.tradedList=res.data;
	})

	$scope.showType=0;
	$scope.switchSlide=function(index){
		$scope.showType=index;
		var left=(index * 33.33) + 6.5 +'%';
		$("#order_visit_list .flex-wrapper .under-line").animate({
			left:left
		},150)
	}

	$scope.cancelLook=function($event,info){
		$event.stopPropagation()
		
		var req={
			method:'POST',
			url:$Factory.NewHouseTrade.cancelorder.url,
			headers: {
				'Content-Type': 'application/json'					
			},
			data:info.NewHouseId
		}
		$http(req).then(function(res){
			$ionicLoading.show({
				template:'操作成功',
				duration:1500
			});

			$http.post($Factory.NewHouseTrade.orderlist.url+'?recordStatus=0').then(function(res){
				$scope.wantlookList=res.data;
			})
		})
	}
	
	
})


