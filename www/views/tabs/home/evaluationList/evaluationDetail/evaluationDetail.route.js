angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('evaluationDetail',{
            url:'/ifhavehouse/evaluationdetail/:houseid/:userid',
            cache:false,
            templateUrl:'views/tabs/home/evaluationList/evaluationDetail/evaluationDetail.html',
            controller:'evaluationDetailCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/evaluationList/evaluationDetail/evaluationDetail.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });