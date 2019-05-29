angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('previewHisShop',{
            url:'/mall/classify/previewhisshop/params/:id',
            templateUrl:'views/mall/mall-classify/preview-his-shop/preview-his-shop.html',
            controller:'previewHisShopCtl',
            data:{isPublic:true}
        })
    });