angular.module('App').controller('myInfoQrcodeCtl',function(NimUtils,appUtils,enterViewLoad,$http,$Factory,$stateParams,$location,$rootScope,$timeout,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	if($stateParams.id){
		$http.post($Factory.Account.showinfo.url+'?id='+$stateParams.id)
		.then(function(resData){
			$scope.hisInfo=resData.data;	
		}).catch(function(){

		})
	}
	
	if(NimUtils.myselfInfo){
		$scope.myselfInfo=NimUtils.myselfInfo
		var _accid = $stateParams.id || NimUtils.myselfInfo.account
		var qrcode = new QRCode(document.getElementById("my_info_qrcode_detail"), {
			text: 'http://app.fang-tian.com/app/#/downloadpage/fangtian_'+_accid,
			width: 200,
			height: 200,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	}else{
		enterViewLoad.customload('登录超时请重新登录！')
	}
})
