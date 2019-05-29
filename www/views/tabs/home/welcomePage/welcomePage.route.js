angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('welcomePage',{
            url:'/home/welcomepage',
            templateUrl:'views/tabs/home/welcomePage/welcomePage.html',
            controller:'welcomePageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/welcomePage/welcomePage.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });