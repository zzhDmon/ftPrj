angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('bannerDetailPage',{
            url:'/home/bannerdetailpage',
            templateUrl:'views/tabs/home/bannerDetailPage/bannerDetailPage.html',
            controller:'bannerDetailPageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/bannerDetailPage/bannerDetailPage.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });