angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('groupRedPacket',{
                url:'/chatlist/groupredpacket/params/:id',
                cache:false,
                templateUrl:'views/tabs/chatList/groupRedPacket/groupRedPacket.html',
                controller:'groupRedPacketCtl',
                data:{isPublic:false}
            })
    });