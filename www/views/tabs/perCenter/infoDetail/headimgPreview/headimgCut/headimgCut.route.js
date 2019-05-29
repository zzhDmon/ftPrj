angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('headimgCut',{
                url:'/percenter/infodetail/headimgpreview/headimgcut/:imgurl',
                cache:false,
                templateUrl:'views/tabs/perCenter/infoDetail/headimgPreview/headimgCut/headimgCut.html',
                controller:'headimgCutCtl',
                data:{isPublic:false}
            })
    });