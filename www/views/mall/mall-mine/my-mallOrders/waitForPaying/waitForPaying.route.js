angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('waitForPaying',{
            url:'/mall/mallmine/mymallorders/waitforpaying/params/:order',
            templateUrl:'views/mall/mall-mine/my-mallOrders/waitForPaying/waitForPaying.html',
            controller:'waitForPayingCtl',
            data:{isPublic:false}
        })
    });