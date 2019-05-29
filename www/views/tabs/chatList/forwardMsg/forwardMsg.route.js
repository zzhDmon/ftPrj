angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('forwardMsg',{
            url:'/chatlist/forwardmsg',
            templateUrl:'views/tabs/chatList/forwardMsg/forwardMsg.html',
            controller:'forwardMsgCtr',
            data:{isPublic:false}
        })
    });