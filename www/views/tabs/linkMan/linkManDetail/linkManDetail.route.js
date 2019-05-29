angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('linkManDetail',{
            url:'/linkman/linkmandetail/params/:account/:phone',
            cache:false,
            templateUrl:'views/tabs/linkMan/linkManDetail/linkManDetail.html',
            controller:'linkManDetailCtr',
            data:{isPublic:false}
        })
    });