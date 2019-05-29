angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('groupAvatar',{
                url:'/percenter/group/groupavatar/params/:id',
                templateUrl:'views/tabs/chatList/groupDialogBox/groupAvatar/groupAvatar.html',
                controller:'groupAvatarCtl',
                data:{isPublic:false}
            })
    });