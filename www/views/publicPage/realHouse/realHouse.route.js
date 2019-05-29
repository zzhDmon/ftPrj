angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('realHouse',{
            url: '/realhouse/params/:id/:address/:housetype',
            cache:false,
            templateUrl: 'views/publicPage/realHouse/realHouse.html',
            controller:'realHouseCtl',
            data:{isPublic:false}
        })
    });