angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.rentPage',{
            url:'/housesource/rentpage/:date',
            views:{
                home:{
                    templateUrl:'views/tabs/home/houseSource/rentPage/rentPage.html',
                    controller:'rentPageCtl',
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseSource/rentPage/rentPage.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });