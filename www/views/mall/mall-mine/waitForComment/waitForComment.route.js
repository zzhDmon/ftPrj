angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('waitForComment',{
            url:'/mall/mallmine/waitforcomment',
            templateUrl:'views/mall/mall-mine/waitForComment/waitForComment.html',
            controller:'waitForCommentCtl',
            data:{isPublic:false}
        })
    });