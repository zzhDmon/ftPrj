angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('agencyAgreementCheck',{
            url: '/agencyagreementcheck/:account/:houseid/:userid',
            cache:false,
            templateUrl: 'views/publicPage/agencyAgreementCheck/agencyAgreementCheck.html',
            controller:'agencyAgreementCheckCtl',
            data:{isPublic:false}
        })
    });