angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myPoints',{
            url:'/percenter/mypoints',
            cache:false,
            templateUrl:'views/tabs/perCenter/myPoints/myPoints.html',
            controller:'myPointsCtl',
            data:{isPublic:false}
        })
    });