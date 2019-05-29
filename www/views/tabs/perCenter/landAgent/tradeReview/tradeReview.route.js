angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tradeReview',{
                url:'/percenter/landagent/tradeReview',
                cache:false,
                templateUrl:'views/tabs/perCenter/landAgent/tradeReview/tradeReview.html',
                controller:'tradeReviewCtl',
                data:{isPublic:true}
            })
    });