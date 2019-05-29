angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('refundDetail',{
            url:'/mall/mallmine/returnaftersale/refunddetail/params/:id',
            templateUrl:'views/mall/mall-mine/return-afterSale/refund-detail/refund-detail.html',
            controller:'refundDetailCtl',
            data:{isPublic:false}
        })
    });