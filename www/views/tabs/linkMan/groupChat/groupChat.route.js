angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('groupChat',{
            url:'/linkman/groupchat',
            templateUrl:'views/tabs/linkMan/groupChat/groupChat.html',
            controller:'groupChatCtr',
            data:{isPublic:false}
        })
    });