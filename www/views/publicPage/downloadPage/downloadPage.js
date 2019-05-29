
angular.module('App').controller('downloadPageCtl',function(NimUtils,appUtils,enterViewLoad,$location,$rootScope,$timeout,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	
	window.location='http://a.app.qq.com/o/simple.jsp?pkgname=com.fangtian.ft'
})
