angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('noCtrVideo',{
            url:'/home/noctrvideo/params/:pagenum/:followed',
            cache:false,
            nativeTransitions: {
                type: "slide",
                direction: "up",
            },
            nativeTransitionsBack: {
                type: "slide",
                direction: "down",
            },
            templateUrl:'views/tabs/home/noCtrVideo/noCtrVideo.html',
            controller:'noCtrVideoCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/noCtrVideo/noCtrVideo.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });