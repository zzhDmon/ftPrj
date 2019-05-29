angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.groupInvite',{
            url:'/chatlist/groupinvite/params/:id',
            cache:false,
            views:{
                classify:{
                    templateUrl:'views/tabs/chatList/groupInvite/groupInvite.html',
                    controller:'groupInviteCtr',
                }
            },
            data:{isPublic:false}
        })
    });