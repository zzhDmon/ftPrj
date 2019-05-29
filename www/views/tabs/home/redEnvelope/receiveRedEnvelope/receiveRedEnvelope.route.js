angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('receiveRedEnvelope',{
            url:'/home/redenvelope/receiveredenvelope/params/:open',
            templateUrl:'views/tabs/home/redEnvelope/receiveRedEnvelope/receiveRedEnvelope.html',
            controller:'receiveRedEnvelopeCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/redEnvelope/receiveRedEnvelope/receiveRedEnvelope.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });