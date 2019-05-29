angular.module('App').controller('myTaskCtl',function(appUtils,enterViewLoad,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	
	var _css = function (el, obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				el.style[key] = obj[key];
			}
		}
	}

	 
	  
	// $timeout(function(){
	// 	var initalX = initalY = 0
	// 	var element = document.getElementById('test_alloy')
	// 	new AlloyFinger(element, {
	// 		multipointStart: function () {
	// 			// self.initScale = self.img.scaleX;
	// 			console.log('start')
	// 		},
	// 		pinch: function (evt){
	// 			// self.img.scaleX = self.img.scaleY = self.initScale * evt.scale;
	// 			console.log(evt.scale)
	// 			// element.style.transform='scale('+now_scale+') rotate('+now_rotate+'deg)';
	// 		},
	// 		pressMove: function (evt) {
	// 			console.log('x',evt.deltaX)	
	// 			console.log('y',evt.deltaY)	
	// 			initalX += evt.deltaX
	// 			initalY += evt.deltaY
	// 			_css(element, {
	// 				zIndex: "100",
	// 				left: initalX + "px",
	// 				top: initalY + "px"
	// 			});
	// 			// self.img.translateX += evt.deltaX;
	// 			// self.img.translateY += evt.deltaY;
	// 			evt.preventDefault();
	// 		}
	// 	});
	// })
})
