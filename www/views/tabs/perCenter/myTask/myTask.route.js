angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myTask',{
            url:'/percenter/mytask',
            cache:false,
            templateUrl:'views/tabs/perCenter/myTask/myTask.html',
            controller:'myTaskCtl',
            data:{isPublic:false}
        })
    });