angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('openGroupRedpacket',{
            url:'/chatlist/groupdialogbox/opengroupredpacket',
            cache:false,
            templateUrl:'views/tabs/chatList/groupDialogBox/openGroupRedpacket/openGroupRedpacket.html',
            controller:'openGroupRedpacketCtl',
            data:{isPublic:false}
        })
    });