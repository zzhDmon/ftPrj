angular.module('App')
.factory('NimUtils', [
	'JpushUtils',
	'appUtils',
    'enterViewLoad',
    '$state',
    '$rootScope',
    '$timeout',
    '$window',
    '$localStorage',
    function (JpushUtils,appUtils,enterViewLoad,$state,$rootScope,$timeout,$window,$localStorage) {
        /* util 构造函数 */
        var Util = function (){
			this.blacklist=[]
        };

        /* util 原型对象 */
        Util.prototype = {
            
            init:function(account){
				
				var data={}
				var _this = this
				// 引入SDK类的引用以后，获取SDK对象实例
				var nim = window.nim =  SDK.NIM.getInstance({
					debug:false,
					// appKey: 'bef572f57e11ca29a66702326eae4559',
					appKey: '8aee74edb225d383078833387195792b',
					account: account.accid,
					token: account.token,
					db: false,
					syncSessionUnread: true,
					syncRobots: true,
					autoMarkRead: true,//sh==收到消息自动标为已读
					syncRoamingMsgs:true,
					onconnect: onConnect,
					onerror: onError,
					onwillreconnect: onWillReconnect,
					ondisconnect: onDisconnect,
				
					// onsyncdone: function onSyncDone() {
					//   dispatch('hideLoading');
					//   if (_2.default.state.currSessionId) {
					// 	dispatch('setCurrSession', _2.default.state.currSessionId);
					//   }
					// }
			
					// 多端登录
					onloginportschange: onLoginPortsChange,
					// 用户关系
					onblacklist: onBlacklist,
					onsyncmarkinblacklist: onMarkInBlacklist,
					onmutelist: onMutelist,
					onsyncmarkinmutelist: onMarkInMutelist,
					// 好友关系
					onfriends: onFriends,
					onsyncfriendaction: onSyncFriendAction,
					// 用户名片
					onmyinfo: onMyInfo,
					onupdatemyinfo: onUpdateMyInfo,
					onusers: onUsers,
					onupdateuser: onUpdateUser,
					// 机器人列表的回调
					onrobots: onRobots,
					// 群组
					onteams: onTeams,
					onsynccreateteam: onCreateTeam,
					onUpdateTeam: onUpdateTeam,
					onteammembers: onTeamMembers,
					// onsyncteammembersdone: onSyncTeamMembersDone,
					onupdateteammember: onUpdateTeamMember,
					// 群消息业务已读通知
					onTeamMsgReceipt: onTeamMsgReceipt,
					shouldCountNotifyUnread: function (msg) {
						// console.log(msg)
						// 群消息是否加入未读数 true加入
						// 根据msg的属性自己添加过滤器
						// if (msg.something === someting) {
						// 	return true
						// }
					},
					// 会话
					onsessions: onSessions,
					onupdatesession: onUpdateSession,
					// 消息
					onroamingmsgs: onRoamingMsgs,
					onofflinemsgs: onOfflineMsgs,
					onmsg: onMsg,
					// 系统通知
					onofflinesysmsgs: onOfflineSysMsgs,
					onsysmsg: onSysMsg,
					onupdatesysmsg: onUpdateSysMsg,
					onsysmsgunread: onSysMsgUnread,
					onupdatesysmsgunread: onUpdateSysMsgUnread,
					onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
					oncustomsysmsg: onCustomSysMsg,
					// 收到广播消息
					onbroadcastmsg: onBroadcastMsg,
					onbroadcastmsgs: onBroadcastMsgs,
					// 同步完成
					onsyncdone: onSyncDone,
				});
				function onConnect() {
					// console.log('连接成功');
				}
				function onWillReconnect(obj) {
					// 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
					console.log('即将重连');
				}
				function onDisconnect(error) {
					// 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
					if (error) {
						switch (error.code) {
							// 账号或者密码错误, 请跳转到登录页面并提示错误
							case 302:
							console.log(error.code)
								break;
							// 被踢, 请提示错误后跳转到登录页面
							case 'kicked':
								$state.go('tabs.perCenter');
								appUtils.resetLocalStorage();
								_this.clearData();
								// 被踢下线
								break;
							default:
								break;
						}
					}
				}
				function onError(error) {
					console.log(error);
				}
			
				function onLoginPortsChange(loginPorts) {
					console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
				}
			
				function onBlacklist(blacklist) {
					// console.log('收到黑名单', blacklist);
					_this.blacklist = nim.mergeRelations(_this.blacklist, blacklist);
					_this.blacklist = nim.cutRelations(_this.blacklist, blacklist.invalid);
				}
				function onMarkInBlacklist(obj) {
					console.log(obj);
					console.log(obj.account + '被你在其它端' + (obj.isAdd ? '加入' : '移除') + '黑名单');
					if (obj.isAdd) {
						addToBlacklist(obj);
					} else {
						removeFromBlacklist(obj);
					}
				}
				function addToBlacklist(obj) {
					_this.blacklist = nim.mergeRelations(_this.blacklist, obj.record);
					refreshBlacklistUI();
				}
				function removeFromBlacklist(obj) {
					_this.blacklist = nim.cutRelations(_this.blacklist, obj.record);
					refreshBlacklistUI();
				}
				function refreshBlacklistUI() {
					// 刷新界面
				}
				function onMutelist(mutelist) {
					// console.log('收到静音列表', mutelist);
					data.mutelist = nim.mergeRelations(data.mutelist, mutelist);
					data.mutelist = nim.cutRelations(data.mutelist, mutelist.invalid);
					refreshMutelistUI();
				}
				function onMarkInMutelist(obj) {
					console.log(obj);
					console.log(obj.account + '被你' + (obj.isAdd ? '加入' : '移除') + '静音列表');
					if (obj.isAdd) {
						addToMutelist(obj);
					} else {
						removeFromMutelist(obj);
					}
				}
				function addToMutelist(obj) {
					data.mutelist = nim.mergeRelations(data.mutelist, obj.record);
					refreshMutelistUI();
				}
				function removeFromMutelist(obj) {
					data.mutelist = nim.cutRelations(data.mutelist, obj.record);
					refreshMutelistUI();
				}
				function refreshMutelistUI() {
					// 刷新界面
				}
			
				function onFriends(friends) {
					_this.myFriends = nim.mergeFriends(_this.myFriends, friends);
					_this.myFriends = nim.cutFriends(_this.myFriends, friends.invalid);
					refreshFriendsUI();
				}
				function onSyncFriendAction(obj) {
					switch (obj.type) {
					case 'addFriend':
						console.log('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
						onAddFriend(obj.friend);
						break;
					case 'applyFriend':
						console.log('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
						break;
					case 'passFriendApply':
						console.log('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
						onAddFriend(obj.friend);
						break;
					case 'rejectFriendApply':
						console.log('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
						break;
					case 'deleteFriend':
						console.log('你在其它端删了一个好友' + obj.account);
						onDeleteFriend(obj.account);
						break;
					case 'updateFriend':
						console.log('你在其它端更新了一个好友', obj.friend);
						onUpdateFriend(obj.friend);
						break;
					}
				}
				function onAddFriend(friend) {
					_this.myFriends = nim.mergeFriends(_this.myFriends, friend);
					refreshFriendsUI();
				}
				function onDeleteFriend(account) {
					_this.myFriends = nim.cutFriendsByAccounts(_this.myFriends, account);
					refreshFriendsUI();
				}
				function onUpdateFriend(friend) {
					_this.myFriends = nim.mergeFriends(_this.myFriends, friend);
					refreshFriendsUI();
				}
				function refreshFriendsUI() {
					// 刷新界面
				}
			
				function onMyInfo(user) {
					_this.myselfInfo=user;
					// 同步房田平台信息
					if(!user.avatar || !user.nick){
						nim.updateMyInfo({
							nick: $localStorage.myselfInfo.NickName,
							avatar: $localStorage.ShowImage || 'http://imgs.wujiuyun.com//Images//logo.png' ,
							done: updateMyInfoDone
						});
						function updateMyInfoDone(error, user){
						}
					}
				}
				function onUpdateMyInfo(user) {
					_this.myselfInfo = NIM.util.merge(_this.myselfInfo, user);
					console.log(_this.myselfInfo)
				}
				function onUsers(users) {
					// console.log('收到用户名片列表', users);
					data.users = nim.mergeUsers(data.users, users);
				}
				function onUpdateUser(user) {
					// console.log('用户名片更新了', user);
					data.users = nim.mergeUsers(data.users, user);
				}
				function onRobots (robots) {
					// 客户私有化方案不支持
					console.log('收到机器人列表', robots);
					data.robots = robots;
				}
				function onTeams(teams) {
					// console.log('群列表', teams);
					_this.myTeams = nim.mergeTeams(_this.myTeams, teams);
					onInvalidTeams(teams.invalid);
				}
				function onInvalidTeams(teams) {
					data.teams = nim.cutTeams(data.teams, teams);
					data.invalidTeams = nim.mergeTeams(data.invalidTeams, teams);
				}
				function onCreateTeam(team) {
					console.log('你创建了一个群', team);
					_this.myTeams = nim.mergeTeams(_this.myTeams, team);
					onTeamMembers({
						teamId: team.teamId,
						members: owner
					});
				}
				
				function onTeamMembers(teamId, members) {
					console.log('群id', teamId, '群成员', members);
					// var teamId = obj.teamId;
					// var members = obj.members;
					// data.teamMembers = data.teamMembers || {};
					// data.teamMembers[teamId] = nim.mergeTeamMembers(data.teamMembers[teamId], members);
					// data.teamMembers[teamId] = nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
				
				}
				function onSyncTeamMembersDone() {
				    console.log('同步群列表完成');
				}
				function onUpdateTeam (team) {
					console.log('群状态更新', team)
				}
				function onUpdateTeamMember(teamMember) {
					console.log('群成员信息更新了', teamMember);
					onTeamMembers({
						teamId: teamMember.teamId,
						members: teamMember
					});
				}
				
				function onTeamMsgReceipt (teamMsgReceipts) {
					console.log('群消息已读通知', teamMsgReceipts)
				}
			
				function onSessions(sessions){
					_this.sessionList=sessions
					_this.sessionList = nim.mergeSessions(_this.sessionList, sessions);
					_this.setSessionUread(_this.sessionList)
					
					for(var i=0;i<sessions.length;i++){
						if(sessions[i].scene=='p2p'){
							_this.sessionUsers.push(sessions[i].to)
						}
					}
					// 获取会话对象信息
					_this.getSessionUsersInfo(_this.sessionUsers,function(){})
				}
				function onUpdateSession(session){
					_this.sessionList = nim.mergeSessions(_this.sessionList, session);
					_this.setSessionUread(_this.sessionList)
					if(session.scene=='p2p' &&  _this.sessionUsers.indexOf(session.to)<0){
						// 更新p2p会话列表
						_this.sessionUsers.push(session.to)
					}
					//更新会话列表个人信息 
					_this.getSessionUsersInfo(_this.sessionUsers,function(){
						$rootScope.$emit('updateSessions',_this.sessionList)
					})
				}
				
			
				function onRoamingMsgs(obj) {
					// console.log('漫游消息', obj);
					pushMsg(obj.msgs);
				}
				function onOfflineMsgs(obj) {
					console.log('离线消息', obj);
					pushMsg(obj.msgs);
				}
				function onMsg(msg){
					// console.log(msg)
					if(!($rootScope.currentStateName=='dialogBox'||$rootScope.currentStateName=='groupDialogBox')){
						// 不在单聊和群聊界面
						JpushUtils.addLocalNotification(msg);
					}
					// 收到消息
					$rootScope.$emit('RECEIVEMSG',msg)
					// 更新我的群组
					if(msg.type=='notification'&&(msg.attach.type=='removeTeamMembers'||msg.attach.type=='addTeamMembers' || msg.attach.type=='updateTeam')){
						_this.updateMyTeams()
					}
					pushMsg(msg);
				}
				function onBroadcastMsg(msg) {
					console.log('收到广播消息', msg);
				}
				function onBroadcastMsgs(msgs) {
					console.log('收到广播消息列表', msgs);
				}
				function pushMsg(msgs) {
					if (!Array.isArray(msgs)) { msgs = [msgs]; }
					var sessionId = msgs[0].sessionId;
					data.msgs = data.msgs || {};
					data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
				}
			
				function onOfflineSysMsgs(sysMsgs) {
					console.log('收到离线系统通知', sysMsgs);
					
					pushSysMsgs(sysMsgs);
				}
				function onSysMsg(sysMsg) {
					console.log('收到系统通知', sysMsg)
					pushSysMsgs(sysMsg);
					// 刷新我的好友
					var _reloadMyFriends=function(){
						nim.getFriends({
							done: getFriendsDone
						});
						function getFriendsDone(error, friends){
							if (!error) {
								_this.myFriends=friends
							}else{err()}
						}
					}
					switch(sysMsg.type){
						case 'applyFriend':
							break;
						case 'passFriendApply':
							_reloadMyFriends()
							break;
						case 'addFriend':
							_reloadMyFriends()
							break;
						case 'deleteFriend':
							_reloadMyFriends()
							break;
						case 'deleteMsg':
							$rootScope.$emit('DELETEMSG',sysMsg.msg)
							break;
						case 'teamInvite'://邀请进群
							break;
						default:
							break;
					}

					
				}
				function onUpdateSysMsg(sysMsg){
					pushSysMsgs(sysMsg);
				}
				function pushSysMsgs(sysMsgs){
					_this.sysMsg.allSysMsg = nim.mergeSysMsgs(_this.sysMsg.allSysMsg, sysMsgs);
					$rootScope.$emit('SYSMSGUPDATE',_this.sysMsg)
				}
				function onSysMsgUnread(obj) {
					_this.sysMsg.allSysMsgUnread =  obj.addFriend + //添加好友
													obj.applyFriend + //申请添加好友
													obj.passFriendApply + //统一添加好友
													obj.rejectFriendApply +//拒绝添加好友
													obj.teamInvite +//邀请加群
													obj.rejectTeamInvite +//拒绝加群
													obj.deleteFriend //删除好友
				}
				function onUpdateSysMsgUnread(obj) {
					console.log('系统通知未读数更新了', obj);
					_this.sysMsg.allSysMsgUnread = obj.addFriend + //添加好友
													obj.applyFriend + //申请添加好友
													obj.passFriendApply + //统一添加好友
													obj.rejectFriendApply +//拒绝添加好友
													obj.teamInvite +//邀请加群
													obj.rejectTeamInvite +//拒绝加群
													obj.deleteFriend //删除好友
					
				}
				function refreshSysMsgsUI(){
					// 刷新界面
				}
				function onOfflineCustomSysMsgs(sysMsgs) {
					console.log('收到离线自定义系统通知', sysMsgs);
				}
				function onCustomSysMsg(sysMsg) {
					console.log('收到自定义系统通知', sysMsg);
				}
			
				function onSyncDone() {
					// console.log('同步完成');
				}	 
			},
			// 判断是否为好友  
			isFriend:function(account){
				var friendsArr= this.myFriends
				for(var i=0;i<friendsArr.length;i++){
					if(friendsArr[i].account==account){
						return true
					}
				}
				return false
			},
			// 判断是否为黑名单  
			isBlack:function(account){
				var blackArr= this.blacklist
				for(var i=0;i<blackArr.length;i++){
					if(blackArr[i].account==account){
						return true
					}
				}
				return false
			},
            // 会话列表 会话未读数
			sessionList:[],
			sessionUnread:0,
			setSessionUread:function(sessions){
				this.sessionUnread=0;
				var _this = this;
				for(var i=0;i<sessions.length;i++){
					this.sessionUnread=this.sessionUnread+sessions[i].unread
				}
				// 设置App角标
				this.initBadge(this.sessionUnread)
			},
			// 我的信息
			myselfInfo:null,
			updateMyInfo:function(){
				var _this = this
				nim.getUser({
					account: this.myselfInfo.account,
					done: getUserDone
				});
				function getUserDone(error, user) {
					if (!error) {
						_this.myselfInfo=user;
					}
				}
			},
			//  我的群组
			myTeams:[],
			updateMyTeams:function(){
				nim.getTeams({
					done: getTeamsDone
				});
				var _this = this
				function getTeamsDone(error, teams){
					if (!error) {
						_this.myTeams=teams;
					}
				}
			},
			// 会话列表中的用户和群
			sessionUsers:[],
			// 会话列表中的用户信息和群信息
			sessionUsersInfo:{},
			getSessionUsersInfo:function(users,done){
				var _this = this
				_this.getUsers({
					accounts: users,
					done: getUsersDone
				});
				function getUsersDone(error, users) {
					if (!error) {
						// 转成对象
						users.map(function(e,i){
							try {
								if(typeof JSON.parse(e.custom) == "object") {
									e.custom = JSON.parse(e.custom)
								}
							} catch(err) {
							}
							_this.sessionUsersInfo[e.account]=e;
						});
						done()
					}
				}
			},
			// 我的好友
			myFriends:[],
			// 好友信息
			myFriendsInfo:function(suc,err){
				var _this = this;
				nim.getFriends({
					done: getFriendsDone
				});
				function getFriendsDone(error, friends){
					// _this.myFriends=friends
					
					if (!error) {
						_getFriendsInfo(friends)
					}else{
						err()
					}
				}
				var _getFriendsInfo=function(accounts){
					if(accounts.length<=0){
						suc([])
						return
					}
					var _myFriendsAccount=[]
					for(var i=0;i<accounts.length;i++){
						_myFriendsAccount.push(accounts[i].account)
					}
					
					_this.getUsers({
						accounts: _myFriendsAccount,
						done: getUsersDone
					});
					function getUsersDone(error,friendsinfo){
						if (!error) {
							for(var i=0;i<accounts.length;i++){
								for(var j=0;j<friendsinfo.length;j++){
									if(accounts[i].account==friendsinfo[j].account){
										friendsinfo[j].alias = accounts[i].alias || ''
									}
								}
							}
							suc(friendsinfo)
						}else{
							err()
						}
					}
				}
			},
			getUsers:function(option){//option {}
				var resultArr=[],
					queryCount=0;
				function groupFnc(data) {
					var result = [];
					var groupItem;
					for (var i = 0; i < data.length; i++) {
						if (i % 150 == 0) {
							groupItem != null && result.push(groupItem);
							groupItem = [];
						}
						groupItem.push(data[i]);
					}
					result.push(groupItem);
					return result;
				}
				function getOneGroup(users,needtime){
					nim.getUsers({
						accounts: users,
						done: getUsersDone
					});
					function getUsersDone(error, friends){
						if (!error) {
							queryCount++
							resultArr = resultArr.concat(friends)
							if(queryCount>=needtime){
								option.done(null,resultArr)
							}
						}
					}
				}
				// 分组并获取
				var groups = groupFnc(option.accounts)
				for(var i=0;i<groups.length;i++){
					getOneGroup(groups[i],groups.length)
				}
			},
			// 系统消息
			sysMsg:{
				allSysMsg:[],
				allSysMsgUnread:null,
			},
			addFriend:function(target,suc,err){
				nim.applyFriend({
					account: target,
					ps: this.myselfInfo.account+'加您为好友',
					done: applyFriendDone
				});
				function applyFriendDone(error, obj) {
					if(!error){
						suc()
					}else{
						err()
					}
				}
			},
			
			deleteFriend:function(account,suc,err){
				nim.deleteFriend({
					account: account,
					done: deleteFriendDone
				});
				function deleteFriendDone(error,obj) {
					if(!error) {
						suc(obj)
					}else{
						err()
					}
				}
			},
            emojiList:function(){
				var emojiList = {
					"[大笑]":{file:"emoji_0.png"},"[可爱]":{file:"emoji_01.png"},"[色]":{file:"emoji_02.png"},"[嘘]":{file:"emoji_03.png"},"[亲]":{file:"emoji_04.png"},"[呆]":{file:"emoji_05.png"},"[口水]":{file:"emoji_06.png"},"[汗]":{file:"emoji_145.png"},"[呲牙]":{file:"emoji_07.png"},"[鬼脸]":{file:"emoji_08.png"},"[害羞]":{file:"emoji_09.png"},"[偷笑]":{file:"emoji_10.png"},"[调皮]":{file:"emoji_11.png"},"[可怜]":{file:"emoji_12.png"},"[敲]":{file:"emoji_13.png"},"[惊讶]":{file:"emoji_14.png"},"[流感]":{file:"emoji_15.png"},"[委屈]":{file:"emoji_16.png"},"[流泪]":{file:"emoji_17.png"},"[嚎哭]":{file:"emoji_18.png"},"[惊恐]":{file:"emoji_19.png"},"[怒]":{file:"emoji_20.png"},"[酷]":{file:"emoji_21.png"},"[不说]":{file:"emoji_22.png"},"[鄙视]":{file:"emoji_23.png"},"[阿弥陀佛]":{file:"emoji_24.png"},"[奸笑]":{file:"emoji_25.png"},"[睡着]":{file:"emoji_26.png"},"[口罩]":{file:"emoji_27.png"},"[努力]":{file:"emoji_28.png"},"[抠鼻孔]":{file:"emoji_29.png"},"[疑问]":{file:"emoji_30.png"},"[怒骂]":{file:"emoji_31.png"},"[晕]":{file:"emoji_32.png"},"[呕吐]":{file:"emoji_33.png"},"[拜一拜]":{file:"emoji_160.png"},"[惊喜]":{file:"emoji_161.png"},"[流汗]":{file:"emoji_162.png"},"[卖萌]":{file:"emoji_163.png"},"[默契眨眼]":{file:"emoji_164.png"},"[烧香拜佛]":{file:"emoji_165.png"},"[晚安]":{file:"emoji_166.png"},"[强]":{file:"emoji_34.png"},"[弱]":{file:"emoji_35.png"},"[OK]":{file:"emoji_36.png"},"[拳头]":{file:"emoji_37.png"},"[胜利]":{file:"emoji_38.png"},"[鼓掌]":{file:"emoji_39.png"},"[握手]":{file:"emoji_200.png"},"[发怒]":{file:"emoji_40.png"},"[骷髅]":{file:"emoji_41.png"},"[便便]":{file:"emoji_42.png"},"[火]":{file:"emoji_43.png"},"[溜]":{file:"emoji_44.png"},"[爱心]":{file:"emoji_45.png"},"[心碎]":{file:"emoji_46.png"},"[钟情]":{file:"emoji_47.png"},"[唇]":{file:"emoji_48.png"},"[戒指]":{file:"emoji_49.png"},"[钻石]":{file:"emoji_50.png"},"[太阳]":{file:"emoji_51.png"},"[有时晴]":{file:"emoji_52.png"},"[多云]":{file:"emoji_53.png"},"[雷]":{file:"emoji_54.png"},"[雨]":{file:"emoji_55.png"},"[雪花]":{file:"emoji_56.png"},"[爱人]":{file:"emoji_57.png"},"[帽子]":{file:"emoji_58.png"},"[皇冠]":{file:"emoji_59.png"},"[篮球]":{file:"emoji_60.png"},"[足球]":{file:"emoji_61.png"},"[垒球]":{file:"emoji_62.png"},"[网球]":{file:"emoji_63.png"},"[台球]":{file:"emoji_64.png"},"[咖啡]":{file:"emoji_65.png"},"[啤酒]":{file:"emoji_66.png"},"[干杯]":{file:"emoji_67.png"},"[柠檬汁]":{file:"emoji_68.png"},"[餐具]":{file:"emoji_69.png"},"[汉堡]":{file:"emoji_70.png"},"[鸡腿]":{file:"emoji_71.png"},"[面条]":{file:"emoji_72.png"},"[冰淇淋]":{file:"emoji_73.png"},"[沙冰]":{file:"emoji_74.png"},"[生日蛋糕]":{file:"emoji_75.png"},"[蛋糕]":{file:"emoji_76.png"},"[糖果]":{file:"emoji_77.png"},"[葡萄]":{file:"emoji_78.png"},"[西瓜]":{file:"emoji_79.png"},"[光碟]":{file:"emoji_80.png"},"[手机]":{file:"emoji_81.png"},"[电话]":{file:"emoji_82.png"},"[电视]":{file:"emoji_83.png"},"[声音开启]":{file:"emoji_84.png"},"[声音关闭]":{file:"emoji_85.png"},"[铃铛]":{file:"emoji_86.png"},"[锁头]":{file:"emoji_87.png"},"[放大镜]":{file:"emoji_88.png"},"[灯泡]":{file:"emoji_89.png"},"[锤头]":{file:"emoji_90.png"},"[烟]":{file:"emoji_91.png"},"[炸弹]":{file:"emoji_92.png"},"[枪]":{file:"emoji_93.png"},"[刀]":{file:"emoji_94.png"},"[药]":{file:"emoji_95.png"},"[打针]":{file:"emoji_96.png"},"[钱袋]":{file:"emoji_97.png"},"[钞票]":{file:"emoji_98.png"},"[银行卡]":{file:"emoji_99.png"},"[手柄]":{file:"emoji_100.png"},"[麻将]":{file:"emoji_101.png"},"[调色板]":{file:"emoji_102.png"},"[电影]":{file:"emoji_103.png"},"[麦克风]":{file:"emoji_104.png"},"[耳机]":{file:"emoji_105.png"},"[音乐]":{file:"emoji_106.png"},"[吉他]":{file:"emoji_107.png"},"[火箭]":{file:"emoji_108.png"},"[飞机]":{file:"emoji_109.png"},"[火车]":{file:"emoji_110.png"},"[公交]":{file:"emoji_111.png"},"[轿车]":{file:"emoji_112.png"},"[出租车]":{file:"emoji_113.png"},"[警车]":{file:"emoji_114.png"},"[自行车]":{file:"emoji_115.png"}
				}
				for (var key in emojiList) {
					var item = emojiList[key]
					item.img = 'imgs/emoji/'+item.file
				}
				return emojiList
			},
			// 退出数据清零
			clearData:function(){
				this.sessionList=[];
				this.sessionUnread=null;
				this.sysMsg.allSysMsg=[];
				this.sysMsg.allSysMsgUnread=null;
				this.clearBadge();
			},
			// 设置图标数字
			initBadge:function (num) {
				document.addEventListener("deviceready", function () {
					cordova.plugins.notification.badge.set(num || 0);
                }, false);
			},
			addBadge:function(){
				document.addEventListener("deviceready", function () {
					cordova.plugins.notification.badge.increase(1, function (badge) {
					});
                }, false);
			},
			reduceBadge :function () {
				document.addEventListener("deviceready", function () {
					cordova.plugins.notification.badge.decrease(1, function (badge) {
					});
                }, false);
			},
			clearBadge :function () {
				document.addEventListener("deviceready", function () {
					cordova.plugins.notification.badge.clear();
                }, false);
			},
        };

        return new Util();
    }]);