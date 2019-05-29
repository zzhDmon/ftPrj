angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.payVip',{
            url:'/percenter/openvip/payvip/params/:productid/:price/:vipname',
            cache:false,
            views:{
                mine:{
                    templateUrl:'views/tabs/perCenter/openVip/payVip/payVip.html',
                    controller:'payVipCtl',
                }
            },
            data:{isPublic:false}
        })
    });