angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('personalNeed',{
            url: '/personalneed/:id',
            templateUrl: 'views/publicPage/personalNeed/personalNeed.html',
            controller:'personalNeedCtl',
            data:{isPublic:false}
        })
    });