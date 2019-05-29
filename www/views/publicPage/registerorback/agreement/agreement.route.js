angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('agreement',{
            url: '/registerorback/next/agreement',
            templateUrl: 'views/publicPage/registerorback/agreement/agreement.html',
            controller:'registerAgreementController',
            data:{isPublic:true}
        })
    });