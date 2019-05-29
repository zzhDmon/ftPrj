angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('orderVisitList',{
            url:'/percenter/usercenter/uservisitlist',
            cache:false,
            templateUrl:'views/tabs/perCenter/userCenter/orderVisitList/orderVisitList.html',
            controller:'orderVisitListCtl',
            data:{isPublic:false}
        })
    });