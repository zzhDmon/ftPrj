angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mobileContact',{
            url:'/linkman/addfriend/mobilecontact',
            cache:false,
            templateUrl:'views/tabs/linkMan/addFriend/mobileContact/mobileContact.html',
            controller:'mobileContactCtr',
            data:{isPublic:false}
        })
    });