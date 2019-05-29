angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('thirdGuessPrice',{
            url:'/guessprice/thirdguessgrice/:houseid',
            // cache:false,
            templateUrl:'views/tabs/home/guessPrice/systemPrice/thirdGuessPrice/thirdGuessPrice.html',
            controller:'thirdGuessPriceCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/guessPrice/systemPrice/thirdGuessPrice/thirdGuessPrice.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });