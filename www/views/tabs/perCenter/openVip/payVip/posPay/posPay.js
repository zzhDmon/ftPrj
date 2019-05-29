
angular.module('App').controller('posPayCtl',function(enterViewLoad,appUtils,$rootScope,$ionicHistory,$timeout,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.orderData={
		ProductId:$stateParams.productid,
		Fee:$stateParams.fee,
		Years:$stateParams.year,
	}
	$http.post($Factory.Allin.pos.url,$scope.orderData)
		.then(function(resData){
			if(resData.data.return_code=='SUCCESS'){
				var return_msg = JSON.parse(resData.data.return_msg)
				$scope.orderNumber=return_msg.orderNo

				var qrcode = new QRCode(document.getElementById("pospay_qrcode"), {
					text: return_msg.orderNo,
					width: 200,
					height: 200,
					colorDark : "#000000",
					colorLight : "#ffffff",
					correctLevel : QRCode.CorrectLevel.H
				});
			}else if(resData.data.return_msg=='未绑定手机。'){
				enterViewLoad.customload('未绑定,请添加银行卡',2000)
			}else{
				enterViewLoad.customload('未绑定,请添加银行卡',2000)
			}
		}).catch(function(params) {
			enterViewLoad.customload('生成订单失败')
		})
})
