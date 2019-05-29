angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('transferTeam',{
            url:'/chatlist/transferteam/params/:id',
            cache:false,
            templateUrl:'views/tabs/chatList/transferTeam/transferTeam.html',
            controller:'transferTeamCtr',
            data:{isPublic:false}
        })
    });