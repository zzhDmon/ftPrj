angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('newFriends',{
            url:'/linkman/newfriends',
            templateUrl:'views/tabs/linkMan/newFriends/newFriends.html',
            controller:'newFriendsCtr',
            data:{isPublic:false}
        })
    });