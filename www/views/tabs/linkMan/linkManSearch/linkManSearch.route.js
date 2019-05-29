angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('linkManSearch',{
            url:'/tabs/linkman/linkmansearch',
            templateUrl:'views/tabs/linkMan/linkManSearch/linkManSearch.html',
            controller:'linkManSearchCtl',
            data:{isPublic:false}
        })
    });