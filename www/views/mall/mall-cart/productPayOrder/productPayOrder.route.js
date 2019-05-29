angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('productPayOrder',{
            url:'/mall/mallcart/goodslist/productpayorder/params/:tradeno/:total/:ismuilt/:usedscore/:usedvoucher',
            cache:false,
            templateUrl:'views/mall/mall-cart/productPayOrder/productPayOrder.html',
            controller:'productPayOrderCtl',
            data:{isPublic:false}
        })
    });