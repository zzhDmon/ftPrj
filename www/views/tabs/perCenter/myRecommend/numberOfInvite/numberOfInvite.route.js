angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('numberOfInvite',{
            url:'/percenter/myrecommend/numberofinvite',
            templateUrl:'views/tabs/perCenter/myRecommend/numberOfInvite/numberOfInvite.html',
            controller:'numberOfInviteCtl',
            data:{isPublic:false}
        })
    });