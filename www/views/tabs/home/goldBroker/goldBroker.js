angular.module('App').controller('goldBrokerCtl',function(enterViewLoad,appUtils,$interval,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}
	// //初始化正则表达式,加上括号(),形成可捕获元组.ig表示全局匹配和不区分大小写
    // var reg = new RegExp("("+searchVal +")","ig");
    // //高亮要查找的字符串
    // text = text.replace(reg,"<b>$1</b>");
    // poetry.innerHTML = text;
	
})