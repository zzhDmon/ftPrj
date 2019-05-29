angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('posPay',{
                url:'/percenter/openvip/payvip/pospay/params/:productid/:fee/:year',
                cache:false,
                templateUrl:'views/tabs/perCenter/openVip/payVip/posPay/posPay.html',
                controller:'posPayCtl',
                data:{isPublic:false}
            })
    });