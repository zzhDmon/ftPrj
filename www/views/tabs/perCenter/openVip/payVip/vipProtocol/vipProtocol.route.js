angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('vipProtocol',{
                url:'/percenter/openvip/payvip/vipprotocol',
                templateUrl:'views/tabs/perCenter/openVip/payVip/vipProtocol/vipProtocol.html',
                controller:'vipProtocolCtl',
                data:{isPublic:false}
            })
    });