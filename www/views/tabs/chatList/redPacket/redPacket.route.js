angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('redPacket',{
                url:'/chatlist/redpacket/params/:id',
                cache:false,
                templateUrl:'views/tabs/chatList/redPacket/redPacket.html',
                controller:'redPacketCtl',
                data:{isPublic:false}
            })
    });