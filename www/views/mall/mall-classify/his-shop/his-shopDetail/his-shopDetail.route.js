angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('hisShopDetail',{
            url:'/mall/classify/hisshop/hisshopdetail/:id',
            templateUrl:'views/mall/mall-classify/his-shop/his-shopDetail/his-shopDetail.html',
            controller:'hisShopDetailCtl',
            data:{isPublic:true}
        })
    });