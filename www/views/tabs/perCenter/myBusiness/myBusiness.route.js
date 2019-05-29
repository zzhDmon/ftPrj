angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myBusiness',{
            url:'/percenter/mybusiness',
            // cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/myBusiness.html',
            controller:'myBusinessCtl',
            data:{isPublic:false}
        })
    });