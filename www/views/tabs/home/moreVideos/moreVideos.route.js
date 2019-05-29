angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('moreVideos',{
            url:'/home/morevideos',
            templateUrl:'views/tabs/home/moreVideos/moreVideos.html',
            controller:'moreVideosCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/moreVideos/moreVideos.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });