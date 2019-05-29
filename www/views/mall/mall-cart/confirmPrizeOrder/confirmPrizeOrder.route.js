angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('confirmPrizeOrder',{	
            url:'/mall/mallcart/goodslist/confirmprizeorder/params/:ProductId/:ProductSKUId/:Quantity/:ShopId',
            templateUrl:'views/mall/mall-cart/confirmPrizeOrder/confirmPrizeOrder.html',
            controller:'confirmPrizeOrderCtl',
            data:{isPublic:false}
        })
    });