angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.chatList',{
            url:'/chatlist',
            // nativeTransitions: {
            //     type: "fade"
            // },
            nativeTransitions:null,
            views:{
                classify:{
                    templateUrl:'views/tabs/chatList/chatList.html',
                    controller:'chatListCtl'
                }
            },
            data:{isPublic:false}
        })
    });