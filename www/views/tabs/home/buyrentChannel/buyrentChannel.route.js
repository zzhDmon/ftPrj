angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('buyrentChannel',{
            url:'/buyrentchannel',
            templateUrl:'views/tabs/home/buyrentChannel/buyrentChannel.html',
            controller:'buyrentChannelCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/buyrentChannel/buyrentChannel.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });