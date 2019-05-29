// 页面间数据共享
angular.module('App')
.factory('$myBusinessData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
        tag:null,
        myPoster:''//简介海报
	};

	return new Util();
}]);