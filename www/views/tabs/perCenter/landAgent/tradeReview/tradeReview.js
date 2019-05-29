angular.module('App')
.controller('tradeReviewCtl',function(appUtils,$Factory,$http,$scope,$rootScope,$timeout){
	$scope.back=function(){
		appUtils.back();
    }

	// var req={
	// 	method:'POST',
	// 	url:$Factory.NewHouseTrade.wantlook.url,
	// 	headers: {
	// 		'Content-Type': 'application/json'					
	// 	  },
	// 	data:{NewHouseId:48,ProxerId:1,LookTime:'2018-04-06'}
	// }
	// $http(req).then(function(res){
	// 	console.log(res)
	// })

	$scope.showType=0;
	$scope.headSlide=function(index){
		$scope.showType=index;
		var left=(index * 50)+15+'%';
		$('#trade_review .head-slide .under-line').animate({
			left:left
		},150)
	}
	
	$http.post($Factory.NewHouseTrade.landagentlist.url+'?recordStatus=5').then(function(res){
		$scope.willdoneList=res.data
	})

	$http.post($Factory.NewHouseTrade.landagentlist.url+'?recordStatus=6').then(function(res){
		$scope.doneList=res.data
	})

})


