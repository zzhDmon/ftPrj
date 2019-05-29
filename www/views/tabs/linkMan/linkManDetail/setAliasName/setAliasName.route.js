angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('setAliasName',{
            url:'/linkman/linkmandetail/setaliasname/params/:id',
            cache:false,
            templateUrl:'views/tabs/linkMan/linkManDetail/setAliasName/setAliasName.html',
            controller:'setAliasNameCtl',
            data:{isPublic:false}
        })
    });