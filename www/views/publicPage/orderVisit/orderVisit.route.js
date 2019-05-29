angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('orderVisit',{
        	url: '/ordervisit/params/:houseid',
        	templateUrl: 'views/publicPage/orderVisit/orderVisit.html',
        	controller:'orderVisitCtl',
        	data:{isPublic:false}
        })
    });