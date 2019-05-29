angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('goodsList',{
            url:'/mall/classify/goodslist/params/:type/:typename/:ptype/:query/:saletype',
            templateUrl:'views/mall/mall-classify/goods-list/goods-list.html',
            controller:'goodsListCtl',
            data:{isPublic:true}
        })
    });