angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('blackList',{
            url:'/linkman/blacklist',
            templateUrl:'views/tabs/linkMan/blackList/blackList.html',
            controller:'blackListCtr',
            data:{isPublic:false}
        })
    });