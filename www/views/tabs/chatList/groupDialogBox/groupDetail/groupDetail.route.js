angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('groupDetail',{
            url:'/chatlist/groupdialogbox/groupdetail/params/:id',
            templateUrl:'views/tabs/chatList/groupDialogBox/groupDetail/groupDetail.html',
            controller:'groupDetailCtr',
            data:{isPublic:false}
        })
    });