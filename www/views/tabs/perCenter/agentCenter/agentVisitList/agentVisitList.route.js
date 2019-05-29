angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('agentVisitList',{
                url:'/percenter/agentcenter/agentvisitlist',
                cache:false,
                templateUrl:'views/tabs/perCenter/agentCenter/agentVisitList/agentVisitList.html',
                controller:'agentVisitListCtl',
                data:{isPublic:false}
            })
    });