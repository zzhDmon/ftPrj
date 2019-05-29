angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.evaluationList',{
            url:'/ifhavehouse/evaluationlist/:houseid/:evaltype',
            cache:false,
            views:{
                home:{
                    templateUrl:'views/tabs/home/evaluationList/evaluationList.html',
                    controller:'evaluationListCtl',
                }
            },
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/evaluationList/evaluationList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });