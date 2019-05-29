angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myHouses',{
            url:'/percenter/myhouses/:type',
            templateUrl:'views/tabs/perCenter/myHouses/myHouses.html',
            controller:'myHousesCtl',
            data:{isPublic:false}
        })
    });