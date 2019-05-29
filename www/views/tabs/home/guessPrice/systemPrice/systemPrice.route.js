angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.systemPrice',{
            url:'/guessprice/systemprice/:query/:space/:houseid',
            cache:false,
            views:{
                home:{
                    templateUrl:'views/tabs/home/guessPrice/systemPrice/systemPrice.html',
                    controller:'systemPriceCtl',
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/guessPrice/systemPrice/systemPrice.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });