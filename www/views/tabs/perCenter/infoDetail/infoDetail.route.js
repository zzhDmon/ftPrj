angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('infoDetail',{
                url:'/percenter/infodetail',
                // cache:false,
                templateUrl:'views/tabs/perCenter/infoDetail/infoDetail.html',
                controller:'infoDetailCtl',
                data:{isPublic:false}
            })
    });