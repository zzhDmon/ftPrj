angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('publishDynamic',{
            url:'/percenter/mybusiness/publishdynamic',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/publishDynamic/publishDynamic.html',
            controller:'publishDynamicCtl',
            data:{isPublic:false}
        })
    });