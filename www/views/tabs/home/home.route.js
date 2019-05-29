angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.Home',{
            url:'/home',
            nativeTransitions:null,
            views:{
                home:{
                    templateUrl:'views/tabs/home/home.html',
                    controller:'HomeCtl'
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/home.js'
                    ]);
                }]
            },
            data:{isPublic:true}
        })
    });