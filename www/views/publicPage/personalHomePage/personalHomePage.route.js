angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('personalHomePage',{
            url: '/personalhomepage/:id',
            templateUrl: 'views/publicPage/personalHomePage/personalHomePage.html',
            controller:'personalHomePageCtl',
            data:{isPublic:false}
        })
    });