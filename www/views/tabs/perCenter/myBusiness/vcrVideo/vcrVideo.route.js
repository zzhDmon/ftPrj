angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('vcrVideo',{
            url:'/percenter/vcrVideo/params/:id/:video/:image',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/vcrVideo/vcrVideo.html',
            controller:'vcrVideoCtl',
            data:{isPublic:true}
        })
    });