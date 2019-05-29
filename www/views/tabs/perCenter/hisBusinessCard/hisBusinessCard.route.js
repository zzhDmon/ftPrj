angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('hisBusinessCard',{
            url:'/percenter/hisbusinesscard/params/:id',
            cache:false,
            templateUrl:'views/tabs/perCenter/hisBusinessCard/hisBusinessCard.html',
            controller:'hisBusinessCardCtl',
            data:{isPublic:true}
        })
    });