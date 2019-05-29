angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.ershouPage',{
            url:'/tabs/housesource/ershoupage/:date',
            views:{
                home:{
                    templateUrl:'views/tabs/home/houseSource/ershouPage/ershouPage.html',
                    controller:'ershouPageCtl',
                }
            },	
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseSource/ershouPage/ershouPage.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });