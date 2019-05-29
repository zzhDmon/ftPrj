angular.module('App').controller('goodsListCtl',function(enterViewLoad,appUtils,$stateParams,$ionicSlideBoxDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.goDetail=function(item){
		if(item.ProductSaleType==59){
			$state.go('goodsDetailPrize',{id:item.Id})
		}else{
			$state.go('goodsDetail',{id:item.Id})
		}
	}
	$scope.moreFilterData=[
		{
			"title":"全部服务",
			"field":"Service",
			"list":[
				{"text":"新品","value":"小户型","isChecked":false},
				{"text":"有货","value":"现房","isChecked":false},
				{"text":"促销","value":"新房优惠","isChecked":false},
				{"text":"折扣","value":"品牌地产","isChecked":false},
				{"text":"会员专享","value":"投资地产","isChecked":false},
				{"text":"顺丰快递","value":"花园洋房","isChecked":false}
			]
		},
		{
			"title":"品牌",
			"field":"HousePeriod",
			"list":[
				{"text":"劳力士","value":2,"isChecked":false},
				{"text":"卡西欧","value":3,"isChecked":false},
				{"text":"宾爵","value":3,"isChecked":false},
				{"text":"宝曼","value":4,"isChecked":false}
			]
		},
		{
			"title":"风格",
			"field":"BuildType",
			"list":[
				{"text":"休闲","value":"普通住宅","isChecked":false},
				{"text":"时尚","value":"高端住宅","isChecked":false},
				{"text":"商务","value":"综合体","isChecked":false},
				{"text":"运动","value":"SOHO","isChecked":false},
				{"text":"智能","value":"商铺","isChecked":false},
				{"text":"极简","value":"写字楼","isChecked":false}
			]
		},
	]
	$scope.$on('$ionicView.enter',function(){
		$scope.getTypeList();
		$scope.haveMore=true;
	})
	$scope.$on('$ionicView.leave',function(){
		// 移除加入购物车时新增的dom
		$(".u-flyer").remove();
	})

	$ionicModal.fromTemplateUrl('goods_list_modal', {
		scope: $scope,
		animation: 'slide-in-left'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.showModal=function(){
		$scope.modal.show();	
	}
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
// 路由参数
	$scope.paramsData={
		type:$stateParams.type,
		typename:$stateParams.typename,
		ptype:$stateParams.ptype,
		query:$stateParams.query,
		saletype:$stateParams.saletype,

	}
	// 默认分类
	$scope.defaultType={
		id:$stateParams.type,
		text:$stateParams.typename
	}
	// 分类列表
	$scope.getTypeList=function(){
		$http.get($Factory.Category.query.url+'?pid='+$stateParams.ptype)
			.then(function(resData){
				$scope.typeList=resData.data
			}).catch(function(){
				enterViewLoad.customload('获取分类列表失败')
			})
	}
	$scope.typeSlideToggle=function(){
		$('#goods_list .filter-item').find('.other-list').slideToggle('fast')
	}
	$scope.changeType=function(item){
		$scope.defaultType=item
		$scope.queryData.type=item.id;
		$scope.refreshLoad()
	}

	// 销量 折扣升降序切换
	$scope.sale=''
	$scope.discount=''
	$scope.changeSale=function(){
		$scope.sale = $scope.sale==1 ? 2 : 1;
		$scope.judgeSort()
	}
	$scope.changeDiscount=function(){
		$scope.discount = $scope.discount==2 ? 1 : 2;
		$scope.judgeSort()
	}
	$scope.judgeSort=function(){
		// if($scope.sale==1&&$scope.discount==1){
		// 	$scope.queryData.sort=11
		// }else if($scope.sale==2&&$scope.discount==1){
		// 	$scope.queryData.sort=21
		// }else if($scope.sale==2&&$scope.discount==2){
		// 	$scope.queryData.sort=22
		// }else{
		// 	$scope.queryData.sort=12
		// }
		if($scope.discount==1){
			$scope.queryData.sort=21
		}else if($scope.discount==2){
			$scope.queryData.sort=22
		}else{
			$scope.queryData.sort=12
		}
	
		$scope.refreshLoad()
	}

	$scope.queryData={
		pagenum:0,
		pagesize:10,
		sort:12,
		query:$stateParams.query,
		SaleType:$stateParams.saletype,
		type:$stateParams.type
	}
	$scope.productList=[]
	$scope.haveMore=true;
	// 商铺列表
	$scope.loadData=function(ifloadmore){
		$http.post($Factory.Product.query.url,$scope.queryData)
			.then(function(resData){
				if(resData.data.length<=0){
					$scope.haveMore = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					if(ifloadmore)return;
				}
				$scope.haveMore = true;
				if(ifloadmore){
					$scope.queryData.pagenum += 1;
					$scope.productList = $scope.productList.concat(resData.data)
					$scope.$broadcast('scroll.infiniteScrollComplete');	
				}else{
					$scope.queryData.pagenum = 1;
					$scope.productList=resData.data
					$scope.$broadcast('scroll.refreshComplete');
				}
			}).catch(function(){
				$scope.haveMore = false;
				enterViewLoad.customload('获取商品失败')
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.$broadcast('scroll.refreshComplete');
			})
	}

	$scope.loadMore = function(ifloadmore){
		$scope.loadData(true)
	}
	$scope.refreshLoad = function(ifloadmore){
		$scope.queryData.pagenum = 0
		$scope.loadData(false);
	}

	

	// 加入购物车动画
	$scope.addToCart=function($event,item){
		$event.stopPropagation();
		var offset=$('#goods_list .fix-right-cart').offset(),
			flyer = $('<img class="u-flyer" src="'+item.Image+'"/>');
		
		flyer.fly({
			start: {
				left: 100,
				top: $event.pageY - 50
			},
			end: {
				left: offset.left,
				top: offset.top,
				width: 0,
				height: 0
			}
		});
	}
		
})