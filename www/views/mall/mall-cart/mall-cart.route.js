angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallCart',{
            nativeTransitions:null,
            url:'/mall/cart',
            templateUrl:'views/mall/mall-cart/mall-cart.html',
            controller:'mallCartCtl',
            data:{isPublic:false}
        })
    });