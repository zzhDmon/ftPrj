angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('realName',{
            url: '/realname',
            cache:false,
            templateUrl: 'views/publicPage/realName/realName.html',
            controller:'realNameCtl',
            data:{isPublic:false}
        })
    });