
angular.module('App').controller('transactionRecordCtl',function(enterViewLoad,appUtils,$rootScope,$timeout,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$http.post($Factory.Money.record.url+'?type=0').then(function(res){
		$scope.recordList=res.data;
	}).catch(function(){
		enterViewLoad.customload('请求数据失败')
	})
	
})

