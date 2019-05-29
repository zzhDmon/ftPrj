angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.guessPriceCommunity',{
            url:'/guessprice/guesspricecommunity',
            cache:false,
            views:{
                home:{
                    templateUrl:'views/tabs/home/guessPrice/guessPriceCommunity/guessPriceCommunity.html',
                    controller:'guessPriceCommunityCtl',
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/guessPrice/guessPriceCommunity/guessPriceCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });