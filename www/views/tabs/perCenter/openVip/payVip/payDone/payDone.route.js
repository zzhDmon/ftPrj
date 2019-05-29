angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('payDone',{
                url:'/percenter/openvip/payvip/paydone',
                templateUrl:'views/tabs/perCenter/openVip/payVip/payDone/payDone.html',
                controller:'payDoneCtl',
                data:{isPublic:false}
            })
    });