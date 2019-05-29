angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.publishGuessPrice',{
            url:'/guessprice/publishguessprice/:houseid',
            cache:false,
            views:{
                home:{
                    templateUrl:'views/tabs/home/guessPrice/systemPrice/thirdGuessPrice/publishGuessPrice/publishGuessPrice.html',
                    controller:'publishGuessPriceCtl',
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/guessPrice/systemPrice/thirdGuessPrice/publishGuessPrice/publishGuessPrice.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });