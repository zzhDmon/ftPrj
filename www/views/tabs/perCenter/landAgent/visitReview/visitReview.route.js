angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('visitReview',{
                url:'/percenter/landagent/visitReview',
                cache:false,
                templateUrl:'views/tabs/perCenter/landAgent/visitReview/visitReview.html',
                controller:'visitReviewCtl',
                data:{isPublic:true}
            })
    });