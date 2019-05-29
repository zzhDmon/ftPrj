// angular.module('App')
// .factory('JpushUtils', [
//     'enterViewLoad',
//     '$state',
//     '$rootScope',
//     '$timeout',
//     '$window',
//     '$localStorage',
//     function (enterViewLoad,$state,$rootScope,$timeout,$window,$localStorage) {
//         /* util 构造函数 */
//         var Util = function (){
			
//         };

//         /* util 原型对象 */
//         Util.prototype = {
            
//             init:function(){
// 				document.addEventListener("deviceready", function () {
// 					window.JPush.init();
// 					window.JPush.setDebugMode(true);

//                 }, false);
// 				document.addEventListener("jpush.openNotification", function (event) {
// 					var alertContent
// 					alertContent = event.alert
// 					// if(device.platform == "Android") {
// 					// 	alertContent = event.alert
// 					// } else {
// 					// 	alertContent = event.aps.alert
// 					// }
// 					try{
// 						if(event.extras.scene=='p2p'){
// 							$state.go('dialogBox',{id:event.extras.toId})
// 						}else{
// 							$state.go('groupDialogBox',{id:event.extras.toId})
// 						}
// 					}catch(e){
					
// 					}
// 				}, false)
// 			},
// 			addLocalNotification:function(msg){
// 				document.addEventListener("deviceready", function () {
// 					var title = (msg.scene==='p2p')? msg.fromNick||'房田用户':'群消息';
// 					var content = (msg.scene==='p2p') ? 
// 									(msg.text || msg.tip || '未读消息'):((msg.fromNick||'房田用户') + ':' + (msg.text || msg.tip || '收到一条消息'));
// 					var clickObj = {
// 						scene:msg.scene,
// 						toId: msg.scene==='p2p' ? msg.from : msg.to
// 					}
// 					window.JPush.addLocalNotification(
// 						0, //builderId
// 						content, //content
// 						title, //title
// 						msg.idServer, //notificationID
// 						50, //broadcastTime 
// 						JSON.stringify(clickObj) //extras
// 					)
//                 }, false);
// 			}
//         };

//         return new Util();
//     }]);
angular.module('App')
.factory('JpushUtils', [
    'enterViewLoad',
    '$state',
    '$rootScope',
    '$timeout',
    '$window',
    '$localStorage',
    function (enterViewLoad,$state,$rootScope,$timeout,$window,$localStorage) {
        /* util 构造函数 */
        var Util = function (){
			
        };

        /* util 原型对象 */
        Util.prototype = {
            
            init:function(){
				document.addEventListener("deviceready", function () {
					window.JPush.init();
					window.JPush.setDebugMode(true);

                }, false);
				document.addEventListener("jpush.openNotification", function (event) {
					if(window.JPush.isPlatformIOS()){
						try{
							if(event.extras.scene=='p2p'){
								$state.go('dialogBox',{id:event.extras.toId})
							}else{
								$state.go('groupDialogBox',{id:event.extras.toId})
							}
						}catch(e){
							
						}
					}else{
						try{
							if(event.extras.scene=='p2p'){
								$state.go('dialogBox',{id:event.extras.toId})
							}else{
								$state.go('groupDialogBox',{id:event.extras.toId})
							}
						}catch(e){
						
						}
					}
					
				}, false)
			},
			addLocalNotification:function(msg){
				console.log(msg)
				document.addEventListener("deviceready", function () {
					var title = (msg.scene==='p2p')? msg.fromNick||'房田用户':'群消息';
					var content = (msg.scene==='p2p') ? 
									(msg.text || msg.tip || '收到一条消息'):((msg.fromNick||'房田用户') + ':' + (msg.text || msg.tip || '收到一条消息'));
					var clickObj = {
						scene:msg.scene,
						toId: msg.scene==='p2p' ? msg.from : msg.to
					}
		
				
				if(window.JPush.isPlatformIOS()) {
					// iOS
					window.JPush.addLocalNotificationForIOS(
						0, 
						(msg.scene==='p2p')?
						((msg.fromNick||'房田用户') + ':' + content):
						((msg.fromNick||'房田用户') + '(群消息):' + (msg.text || msg.tip || '收到一条消息')), 
						$rootScope.notificationBadge || 0, 
						msg.idServer, 
						clickObj,
					);
				} else {
					// Android
					window.JPush.addLocalNotification(
						0, //builderId
						content, //content
						title, //title
						msg.idServer, //notificationID
						50, //broadcastTime 
						JSON.stringify(clickObj) //extras
					)
				}

				
					
                }, false);
			}
        };

        return new Util();
    }]);