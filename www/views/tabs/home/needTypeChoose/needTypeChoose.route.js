angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needTypeChoose',{
            url:'/home/needtypechoose/params/:type',
            templateUrl:'views/tabs/home/needTypeChoose/needTypeChoose.html',
            controller:'needTypeChooseCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needTypeChoose/needTypeChoose.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });