angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('groupDialogBox',{
            url: '/chatlist/groupdialogbox/params/:id',
            // cache:false,
            templateUrl: 'views/tabs/chatList/groupDialogBox/groupDialogBox.html',
            controller:'groupDialogBoxCtl',
            data:{isPublic:false}
        })
    });