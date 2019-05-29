angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mySafe',{
            url:'/percenter/mysafe',
            templateUrl:'views/tabs/perCenter/mySafe/mySafe.html',
            controller:'mySafeCtl',
            data:{isPublic:false}
        })
    });