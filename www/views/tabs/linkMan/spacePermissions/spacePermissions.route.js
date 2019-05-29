angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('spacePermissions',{
            url:'/linkman/spacepermissions',
            templateUrl:'views/tabs/linkMan/spacePermissions/spacePermissions.html',
            controller:'spacePermissionsCtr',
            data:{isPublic:false}
        })
    });