angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('houseSearch',{
            url:'/home/housesearch/params/:type',
            cache:false,
            templateUrl:'views/tabs/home/houseSearch/houseSearch.html',
            controller:'houseSearchCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseSearch/houseSearch.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });