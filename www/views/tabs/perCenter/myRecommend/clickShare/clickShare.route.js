angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.clickShare',{
            url:'/percenter/myrecommend/clickshare/:id',
            cache:false,
            views:{
                mine:{
                    templateUrl:'views/tabs/perCenter/myRecommend/clickShare/clickShare.html',
                    controller:'clickShareCtl',
                }
            },
            data:{isPublic:false}
        })
    });