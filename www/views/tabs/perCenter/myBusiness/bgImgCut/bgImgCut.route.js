angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('bgImgCut',{
                url:'/percenter/mybusiness/bgimgcut/params/:imgurl/:orientation/:type/:id',
                cache:false,
                templateUrl:'views/tabs/perCenter/myBusiness/bgImgCut/bgImgCut.html',
                controller:'bgImgCutCtl',
                data:{isPublic:false}
            })
    });