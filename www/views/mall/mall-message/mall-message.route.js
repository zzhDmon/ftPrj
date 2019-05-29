angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallMessage',{
            nativeTransitions:null,
            url:'/mall/message',
            templateUrl:'views/mall/mall-message/mall-message.html',
            controller:'mallMessageCtl',
            data:{isPublic:true}
        })
    });