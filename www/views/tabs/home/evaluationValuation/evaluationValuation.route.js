angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('evaluationValuation',{
            url:'/home/evaluationvaluation/:type',
            templateUrl:'views/tabs/home/evaluationValuation/evaluationValuation.html',
            controller:'evaluationValuationCtl',
            data:{isPublic:false}
        })
    });