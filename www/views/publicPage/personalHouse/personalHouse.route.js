angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('personalHouse',{
            url: '/personalhouse/:id',
            templateUrl: 'views/publicPage/personalHouse/personalHouse.html',
            controller:'personalHouseCtl',
            data:{isPublic:false}
        })
    });