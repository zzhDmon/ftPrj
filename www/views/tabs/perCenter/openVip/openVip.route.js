angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('openVip',{
            url:'/percenter/openvip',
            templateUrl:'views/tabs/perCenter/openVip/openVip.html',
            controller:'openVipCtl',
            data:{isPublic:true}
        })
    });