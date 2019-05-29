angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('homeClassify',{
            url:'/home/homeclassify',
            nativeTransitions:null,
            templateUrl:'views/tabs/home/homeClassify/homeClassify.html',
            controller:'homeClassifyCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/homeClassify/homeClassify.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });