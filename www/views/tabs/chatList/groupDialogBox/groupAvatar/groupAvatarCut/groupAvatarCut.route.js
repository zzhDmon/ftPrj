angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('groupAvatarCut',{
                url:'/percenter/group/groupavatar/groupavatarcut/params/:id/:imgurl',
                cache:false,
                templateUrl:'views/tabs/chatList/groupDialogBox/groupAvatar/groupAvatarCut/groupAvatarCut.html',
                controller:'groupAvatarCutCtl',
                data:{isPublic:false}
            })
    });