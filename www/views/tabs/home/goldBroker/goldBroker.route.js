angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('goldBroker',{
            url:'/home/goldbroker',
            templateUrl:'views/tabs/home/goldBroker/goldBroker.html',
            controller:'goldBrokerCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/goldBroker/goldBroker.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });