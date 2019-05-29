angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('chooseOrderHouse',{
            url:'/ordervisit/chooseorderhouse',
            templateUrl:'views/publicPage/orderVisit/chooseOrderHouse/chooseOrderHouse.html',
            controller:'chooseOrderHouseCtl',
            data:{isPublic:true}
        })
    });