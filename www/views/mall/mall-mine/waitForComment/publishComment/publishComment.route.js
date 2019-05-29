angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('publishComment',{
            url:'/mall/mallmine/waitforcomment/publishcomment/params/:id',
            templateUrl:'views/mall/mall-mine/waitForComment/publishComment/publishComment.html',
            controller:'publishCommentCtl',
            data:{isPublic:false}
        })
    });