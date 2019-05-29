angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('logisticsDetails',{
            url:'/mall/mallmine/mymallorders/logisticsdetails/params/:id/:done',
            templateUrl:'views/mall/mall-mine/my-mallOrders/logistics-details/logistics-details.html',
            controller:'logisticsDetailsCtl',
            data:{isPublic:false}
        })
    });