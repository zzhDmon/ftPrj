angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('confirmOrder',{
            url:'/mall/mallcart/goodslist/confirmorder/params/:id',
            templateUrl:'views/mall/mall-cart/confirmOrder/confirmOrder.html',
            controller:'confirmOrderCtl',
            data:{isPublic:false}
        })
    });