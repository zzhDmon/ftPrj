angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.createGroup',{
            url:'/linkman/groupchat/creategroup',
            cache:false,
            views:{
                find:{
                    templateUrl:'views/tabs/linkMan/groupChat/createGroup/createGroup.html',
                    controller:'createGroupCtr',
                }
            },
            data:{isPublic:false}
        })
    });