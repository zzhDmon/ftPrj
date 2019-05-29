angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('bindRegister',{
            cache:false,
            url: '/bindregister/params/:type/:key',
            templateUrl: 'views/publicPage/bindRegister/bindRegister.html',
            controller:'bindRegisterController',
            data:{isPublic:true}
        })
    });