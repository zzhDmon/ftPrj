angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tabs.productDetail',{
            	url:'/percenter/productdetail',
            	cache:false,
            	views:{
            		mine:{
            			templateUrl:'views/tabs/perCenter/productDetail/productDetail.html',
            			controller:'productDetailCtl',
            		}
            	},
            	data:{isPublic:false}
            })
    });