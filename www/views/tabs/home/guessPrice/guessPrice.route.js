angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('guessPrice',{
            url:'/home/guessprice',
            // cache:false,
            templateUrl:'views/tabs/home/guessPrice/guessPrice.html',
            controller:'guessPriceCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/guessPrice/guessPrice.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });