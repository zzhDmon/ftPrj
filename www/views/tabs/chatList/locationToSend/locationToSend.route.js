angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('locationToSend',{
                url:'/chatlist/locationtosend/params/:toscene/:toid',
                cache:false,
                templateUrl:'views/tabs/chatList/locationToSend/locationToSend.html',
                controller:'locationToSendCtl',
                data:{isPublic:false}
            })
    });