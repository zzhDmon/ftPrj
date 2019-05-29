angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('returnAfterSale',{
            url:'/mall/mallmine/returnaftersale',
            templateUrl:'views/mall/mall-mine/return-afterSale/return-afterSale.html',
            controller:'returnAfterSaleCtl',
            data:{isPublic:false}
        })
    });