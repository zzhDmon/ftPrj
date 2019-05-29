angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('registershare',{
            cache:false,
            url: '/shareregister/:parphone',
            templateUrl: 'views/publicPage/registerShare/registerShare.html',
            controller:'registerShareCtl',
            data:{isPublic:true}
        })
    });