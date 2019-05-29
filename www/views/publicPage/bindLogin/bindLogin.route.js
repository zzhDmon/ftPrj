angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('bindLogin',{
            url: '/bindlogin/params/:type/:key',
            cache:false,
            templateUrl: 'views/publicPage/bindLogin/bindLogin.html',
            controller:'bindLoginController',
            data:{isPublic:true}
        })
    });