angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('goodsDetail',{
            url: '/mall/classify/goodslist/params/:id',
            cache:false,
            templateUrl: 'views/mall/mall-classify/goods-detail/goods-detail.html',
            controller:'goodsDetailCtl',
            data:{isPublic:true}
        })
    });