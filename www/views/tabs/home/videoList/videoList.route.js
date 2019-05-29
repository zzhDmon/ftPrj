angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('videoList',{
            url:'/home/videolist',
            cache:false,
            templateUrl:'views/tabs/home/videoList/videoList.html',
            controller:'videoListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/videoList/videoList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });