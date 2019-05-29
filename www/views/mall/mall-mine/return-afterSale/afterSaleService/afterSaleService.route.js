angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('afterSaleService',{
            url:'/mall/mallmine/returnaftersale/aftersaleservice',
            templateUrl:'views/mall/mall-mine/return-afterSale/afterSaleService/afterSaleService.html',
            controller:'afterSaleServiceCtl',
            data:{isPublic:false}
        })
    });