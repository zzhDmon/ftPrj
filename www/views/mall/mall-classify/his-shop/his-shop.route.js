angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('hisShop',{
            url:'/mall/classify/hisshop/params/:id/:ismyself',
            templateUrl:'views/mall/mall-classify/his-shop/his-shop.html',
            controller:'hisShopCtl',
            data:{isPublic:true}
        })
    });