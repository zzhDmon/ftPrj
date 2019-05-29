angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myMallOrders',{
            url:'/mall/mallmine/mymallorders/params/:type',
            templateUrl:'views/mall/mall-mine/my-mallOrders/my-mallOrders.html',
            controller:'myMallOrdersCtl',
            data:{isPublic:false}
        })
    });