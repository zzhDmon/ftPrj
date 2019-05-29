angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('visitReport',{
            url: '/visitreport/params/:houseid',
            cache:false,
        	templateUrl: 'views/publicPage/visitReport/visitReport.html',
        	controller:'visitReportCtl',
        	data:{isPublic:false}
        })
    });