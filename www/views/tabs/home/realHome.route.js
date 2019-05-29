angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.realHome',{
            url:'/realhome',
            nativeTransitions:null,
            views:{
                home:{
                    templateUrl:'views/tabs/home/realHome.html',
                    controller:'realHomeCtl'
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/realHome.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });