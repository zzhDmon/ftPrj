angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('changePassword',{
            url:'/page/myset/changepwd',
            cache:false,		
            templateUrl:'views/publicPage/mySet/changePwd/changePwd.html',
            controller:'changePwdCtl',
            data:{isPublic:true}
        })
    });