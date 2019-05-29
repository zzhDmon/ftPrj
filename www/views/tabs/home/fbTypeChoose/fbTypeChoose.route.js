angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('fbTypeChoose',{
            url:'/home/fbtypechoose/params/:type',
            templateUrl:'views/tabs/home/fbTypeChoose/fbTypeChoose.html',
            controller:'fbTypeChooseCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbTypeChoose/fbTypeChoose.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });