angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('humanMap',{
            url:'/percenter/humanmap',
            cache:false,
            templateUrl:'views/tabs/perCenter/humanMap/humanMap.html',
            controller:'humanMapCtl',
            data:{isPublic:false}
        })
    });