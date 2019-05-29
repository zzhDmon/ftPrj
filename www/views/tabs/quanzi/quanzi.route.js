angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.quanzi',{
            url:'/tabs/quanzi',
            nativeTransitions:null,
            views:{
                home:{
                    templateUrl:'views/tabs/quanzi/quanzi.html',
                    controller:'quanziCtl'
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/quanzi/quanzi.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });