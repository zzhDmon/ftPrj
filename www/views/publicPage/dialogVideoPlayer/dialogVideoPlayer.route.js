angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('dialogVideoPlayer',{
            url:'/dialogvideoplayer/params/:url/:image',
            cache:false,
            templateUrl:'views/publicPage/dialogVideoPlayer/dialogVideoPlayer.html',
            controller:'dialogVideoPlayerCtl',
            data:{isPublic:true}
        })
    });