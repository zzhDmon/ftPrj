angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('houseOnMap',{
            url:'/houseonmap',
            cache:false,
            templateUrl:'views/tabs/home/houseOnMap/houseOnMap.html',
            controller:'houseOnMapCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseOnMap/houseOnMap.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });