angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('orderAgentList',{
            url: '/ordervisit/next/orderAgentList/:houseid',
            cache:false,
            templateUrl: 'views/publicPage/orderVisit/orderAgentList/orderAgentList.html',
            controller:'orderAgentListCtl',
            data:{isPublic:false}
        })
    });