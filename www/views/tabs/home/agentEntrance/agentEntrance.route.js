angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('agentEntrance',{
            url:'/agententrance',
            // cache:false,
            templateUrl:'views/tabs/home/agentEntrance/agentEntrance.html',
            controller:'agentEntranceCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/agentEntrance/agentEntrance.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });