angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('agencyAgreement',{
            url: '/agencyagreement/params/:houseid/:agencytype',
            templateUrl: 'views/publicPage/agencyAgreement/agencyAgreement.html',
            controller:'agencyAgreementCtl',
            data:{isPublic:false}
        })
    });