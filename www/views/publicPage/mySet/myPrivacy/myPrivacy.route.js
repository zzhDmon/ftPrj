angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myPrivacy',{
            url:'/publicpage/myset/myprivacy',
            templateUrl:'views/publicPage/mySet/myPrivacy/myPrivacy.html',
            controller:'myPrivacyCtl',
            data:{isPublic:false}
        })
    });