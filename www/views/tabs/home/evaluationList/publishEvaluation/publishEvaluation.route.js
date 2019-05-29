angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('publishEvaluation',{
            url:'/ifhavehouse/publishevaluation/:houseid',
            cache:false,
            templateUrl:'views/tabs/home/evaluationList/publishEvaluation/publishEvaluation.html',
            controller:'publishEvaluationCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/evaluationList/publishEvaluation/publishEvaluation.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });