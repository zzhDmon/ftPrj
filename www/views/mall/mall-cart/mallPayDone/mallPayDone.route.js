angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('mallPayDone',{
                url:'/mall/mallcart/mallpaydone',
                templateUrl:'views/mall/mall-cart/mallPayDone/mallPayDone.html',
                controller:'mallPayDoneCtl',
                data:{isPublic:false}
            })
    });