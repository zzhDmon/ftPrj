
angular.module('App').controller('dealDetailCtl',function(enterViewLoad,appUtils,$rootScope,$timeout,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.RecordType=$stateParams.order
	// $http.post($Factory.Money.record.url+'?type=0').then(function(res){
		
	// }).catch(function(){
	// 	enterViewLoad.customload('请求数据失败')
	// })	
})
