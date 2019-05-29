angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('scanResult',{
                url:'/linkman/scanresult/params/:result',
                cache:false,
                templateUrl:'views/tabs/linkMan/scanResult/scanResult.html',
                controller:'scanResultCtl',
                data:{isPublic:false}
            })
    });