angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('goodsDetailPrize',{
            url: '/mall/classify/goodslist/goodsdetailprize/params/:id',
            cache:false,
            templateUrl: 'views/mall/mall-classify/goods-detail-prize/goods-detail-prize.html',
            controller:'goodsDetailPrizeCtl',
            data:{isPublic:true}
        })
    });