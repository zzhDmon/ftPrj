angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needDetail',{
            url: '/needdetail/params/:id',
            templateUrl: 'views/publicPage/needDetail/needDetail.html',
            controller:'needDetailCtl',
            data:{isPublic:true}
        })
    });