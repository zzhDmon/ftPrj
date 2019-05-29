angular.module('App').controller('mallCartCtl',function($cartChoosedData,NimUtils,enterViewLoad,appUtils,$localStorage,$ionicListDelegate,$ionicModal,$ionicScrollDelegate,$timeout,$http,$Factory,$state,$rootScope,$scope,$ionicHistory){
	$scope.back=function(){
		appUtils.back()
	}
	
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.fromStateName = $rootScope.fromStateName;
	})
	$scope.$on('$ionicView.enter',function(){
		if($rootScope.fromStateName!='goodsDetail'){
			//商品详情过来 不用清除浏览历史
			$ionicHistory.clearHistory();
		}
		// 计算会话未读数
		var _calcUnread = function(sessions){
			for(var i=0;i<sessions.length;i++){
				$scope.totalUnread=$scope.totalUnread+sessions[i].unread
			}
		}
		// 会话未读数
		$scope.totalUnread=0;
		_calcUnread(NimUtils.sessionList)
		// 会话列表 未读数 更新
		$rootScope.$on('updateSessions',function(event,data){
			$timeout(function(){
				$scope.totalUnread=0;
				_calcUnread(data)
			})
		})

		$scope.activeTabName='mall-cart'

		// 获取购物车
		$scope.loadData();
		// 编辑状态
		$scope.isEditStatus=false;
	})


	  
	// 获取购物车
	$scope.loadData=function(){
		$scope.shoppingCartList=appUtils.shoppingCartList
		$scope.shoppingCartCount=appUtils.shoppingCartCount
		$scope.allSelected=false;

		$http.post($Factory.ProductOrder.carts.url,$scope.shoppingCartList)
			.then(function(resData){
				for(var i=0;i<resData.data.length;i++){
					resData.data[i].CartProductInfos.filter(function(item){
						item.sum = item.Quantity * item.UnitPrice
						return item
					})
				}
				$scope.cartGoods=resData.data;
			}).catch(function(){
				enterViewLoad.customload('获取购物车失败')
			})
	}
	//创建订单 选中的的商品
	$scope.goConfirmOrder=function(){
		var copyData = JSON.parse(JSON.stringify($scope.cartGoods)) || []
		for(var i=0;i<copyData.length;i++){
			copyData[i].CartProductInfos=copyData[i].CartProductInfos.filter(function(item){
				return item.Selected
			})
		}
		for(var j=0;j<copyData.length;j++){
			if(copyData[j].CartProductInfos.length<=0){
				copyData.splice(j,1)
			}
		}
		if(copyData.length<1){
			enterViewLoad.customload('请选择购买的商品')
			return
		}
		$cartChoosedData.products=copyData
		$cartChoosedData.totalMoney=$scope.moneyTotal
		$state.go('confirmOrder')	
	}
	// 删除购物车 选中的的商品
	$scope.deleteProducts=function(){
		var copyData = JSON.parse(JSON.stringify($scope.cartGoods)) || []
		for(var i=0;i<copyData.length;i++){
			copyData[i].CartProductInfos=copyData[i].CartProductInfos.filter(function(item){
				return item.Selected
			})
		}
		for(var j=0;j<copyData.length;j++){
			if(copyData[j].CartProductInfos.length<=0){
				copyData.splice(j,1)
			}
		}
		if(copyData.length<1){
			enterViewLoad.customload('请选择需要删除的商品')
			return
		}
		// 对比删除
		for(var i=0;i<copyData.length;i++){
			for(var j=0;j<copyData[i].CartProductInfos.length;j++){
				for(var k=0;k<$localStorage.shoppingCartList.length;k++){
					if($localStorage.shoppingCartList[k].ShopId==copyData[i].CartProductInfos[j].ShopId&&
						$localStorage.shoppingCartList[k].ProductId==copyData[i].CartProductInfos[j].ProductId&&
						$localStorage.shoppingCartList[k].ProductSKUId==copyData[i].CartProductInfos[j].ProductSKUId){
						$localStorage.shoppingCartList.splice(k,1)	
					}
				}
			}
		}
		enterViewLoad.customload('删除成功')
		// 重新加载
		$scope.loadData();
		$scope.isEditStatus=false;
	}
	
	//左滑删除商品  父级index
	$scope.deleteProduct = function(parentindex,index,item) {
		for(var i =0;i<$localStorage.shoppingCartList.length;i++){
			if($localStorage.shoppingCartList[i].ShopId==item.ShopId&&
				$localStorage.shoppingCartList[i].ProductId==item.ProductId&&
				$localStorage.shoppingCartList[i].ProductSKUId==item.ProductSKUId){
					$localStorage.shoppingCartList.splice(i, 1);
				}
		}

		$scope.cartGoods[parentindex].CartProductInfos.splice(index, 1);
		
		$scope.echoChanegToAll()
		$ionicListDelegate.closeOptionButtons();
	}
	

	// 单个商品数量减少
	$scope.reduceCount = function($event,item){
		$event.stopPropagation();
		item.Quantity = item.Quantity>1 ? --item.Quantity : 1;
	}
	// 单个商品数量添加
	$scope.addCount = function($event,item){
		$event.stopPropagation();
		item.Quantity = ++item.Quantity;
	}

	// 全选初始
	$scope.allSelected=false;
	// 单项选中变化 判断 全选状态变化
	$scope.echoChanegToAll=function(){
		var cc = 0; //计算当前数组中checked为真的数目
		var totalLength = 0; //购物车商品总数
		for(var i = 0; i<$scope.cartGoods.length; i++){
			totalLength = totalLength + $scope.cartGoods[i].CartProductInfos.length
			for(var j = 0;j<$scope.cartGoods[i].CartProductInfos.length;j++){
				$scope.cartGoods[i].CartProductInfos[j].Selected ? cc++ : cc;
			}
		}
	
		$scope.allSelected = ((cc == totalLength) && cc > 0); //当为真的数目=数组长度时，证明全部勾选
	}
	// 单项选中
	$scope.echoChange=function(item,allselected){
		item.Selected=!item.Selected
		$scope.echoChanegToAll()
	}
	//全选按钮check的点击事件
	$scope.selectAllClick =function(isselect) {
		$scope.allSelected = isselect;
		for(var i = 0; i < $scope.cartGoods.length; i++) {
			// $scope.cartGoods[i].Selected = isselect;
			for(var j=0;j<$scope.cartGoods[i].CartProductInfos.length;j++){
				$scope.cartGoods[i].CartProductInfos[j].Selected = isselect;
			}
		}
	}
	
	//监控数据
	$scope.$watch('cartGoods', function(newValue, oldValue, scope) {
		$scope.moneyTotal = 0; //总计选中商品金额
		$scope.selectedGoods = 0; //计数器（选中商品数）
		$scope.goodsTotal = 0; //购物车总商品数
		for(var i in newValue) {
			for(var j=0;j<newValue[i].CartProductInfos.length;j++){
				var sumN = newValue[i].CartProductInfos[j].Quantity * newValue[i].CartProductInfos[j].UnitPrice; //计算出新的结果
				$scope.cartGoods[i].CartProductInfos[j].sum = sumN.toFixed(2); //保留两位小数并且把它赋值给元数据;
				
				$scope.goodsTotal = $scope.goodsTotal + newValue[i].CartProductInfos[j].Quantity;
				if(newValue[i].CartProductInfos[j].Selected) {
					$scope.moneyTotal += sumN;
					$scope.selectedGoods = $scope.selectedGoods + newValue[i].CartProductInfos[j].Quantity;
				}
			}
		}
	}, true);
		
})
.factory('$cartChoosedData', [function () {
        /* util 构造函数 */
        var Util = function () {
            
        };
        /* util 原型对象 */
        Util.prototype = {
            // 分享链接 站点
			products:null,
			totalMoney:null   
		};

        return new Util();
}]);