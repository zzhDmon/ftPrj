angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myHomePage',{
            url:'/percenter/myhomepage',
            templateUrl:'views/tabs/perCenter/myHomePage/myHomePage.html',
            controller:'myHomePageCtl',
            data:{isPublic:false}
        })
    });