angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('cityChoose',{
            url:'/citychoose',
            cache:false,
            templateUrl:'views/tabs/home/cityChoose/cityChoose.html',
            controller:'cityChooseCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/cityChoose/cityChoose.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });