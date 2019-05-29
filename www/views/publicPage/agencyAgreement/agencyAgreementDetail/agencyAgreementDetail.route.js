angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('agencyAgreementDetail',{
            url: '/agencyagreementdetail/:agencytype',
            cache:false,
            templateUrl: 'views/publicPage/agencyAgreement/agencyAgreementDetail/agencyAgreementDetail.html',
            controller:'agencyAgreementDetailCtl',
            data:{isPublic:false}
        })
    });