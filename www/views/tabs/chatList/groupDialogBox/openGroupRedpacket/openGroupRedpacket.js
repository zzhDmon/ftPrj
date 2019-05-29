
angular.module('App').controller('openGroupRedpacketCtl',function($openGroupRedpacketData,appUtils,enterViewLoad,$ionicLoading,$timeout,$scope,$state,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.$on('$ionicView.enter',function(){
		enterViewLoad.load();
		try{
			$scope.paramsData = $openGroupRedpacketData.data;
			$scope.queryData = $openGroupRedpacketData.data.content.data;
			
			$http.post($Factory.Money.opengrouppack.url, $scope.queryData)
				.then(function(resData){
					$ionicLoading.hide();
					$scope.pageData = resData.data;
					// 头像旋转
					$scope.rotate=true;
				}).catch(function(e){
					$scope.pageData = {};
					var msg = (e.data && e.data.Message) || '操作失败'
					enterViewLoad.customload(msg)
				})

				// 收红包
				// var content = {
				// 	type:  102,
				// 	data: {
				// 		text: $scope.paramsData.fromNick || '房田用户',
				// 	}
				// };
				// nim.sendCustomMsg({
				// 	scene: 'team',
				// 	to: $scope.paramsData.to,
				// 	content: JSON.stringify(content),
				// 	done: sendMsgDone
				// });
				// function sendMsgDone(error,msg){
				// 	console.log(err)
				// }
		}catch(e){
			$ionicLoading.hide();
		}
	})
	$scope.$on('$ionicView.leave',function(){
		$openGroupRedpacketData.data=null;
		$scope.rotate=false;
	})
})
.factory('$openGroupRedpacketData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
        data:null,
	};

	return new Util();
}]);
