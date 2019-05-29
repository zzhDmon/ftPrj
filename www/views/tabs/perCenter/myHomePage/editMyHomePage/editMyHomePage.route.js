angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('editMyHomePage',{
            url:'/percenter/myhomepage/editmyhomePage',
            templateUrl:'views/tabs/perCenter/myHomePage/editMyHomePage/editMyHomePage.html',
            controller:'editMyHomePageCtl',
            data:{isPublic:false}
        })
    });