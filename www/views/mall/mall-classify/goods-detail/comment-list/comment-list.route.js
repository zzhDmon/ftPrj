angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('commentList',{
            url:'/mall/classify/goodsdetail/comment/params/:id',
            templateUrl:'views/mall/mall-classify/goods-detail/comment-list/comment-list.html',
            controller:'commentListCtl',
            data:{isPublic:true}
        })
    });