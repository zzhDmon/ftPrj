angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('shippingAddress',{
            url:'/mall/mallmine/addresslist/shippingaddress/params/:id/:province/:city/:district',
            cache:false,
            templateUrl:'views/mall/mall-mine/addressList/shippingAddress/shippingAddress.html',
            controller:'shippingAddressCtl',
            data:{isPublic:true}
        })
    });