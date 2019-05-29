angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myNeeds',{
            url:'/percenter/myneeds/:needtype/:housetype',
            templateUrl:'views/tabs/perCenter/myNeeds/myNeeds.html',
            controller:'myNeedsCtl',
            data:{isPublic:false}
        })
    });