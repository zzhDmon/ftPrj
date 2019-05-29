angular.module('App').controller('confirmOrderCtl',function($cartChoosedData,enterViewLoad,appUtils,$cookies,$localStorage,$state,$ionicLoading,$ionicHistory,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.$on('$ionicView.enter',function(){
		// 收货地址
		appUtils.getReceiptAddress(function(res){
			$scope.receiptAddress=res
		})
		$scope.productList = $cartChoosedData.products;
		$scope.totalMoney = $cartChoosedData.totalMoney;
		$scope.originTotalMoney = $cartChoosedData.totalMoney;
//fakeData 
		// $scope.productList=[{"ShopName":"苏函","ShopId":5,"MaxScore":500,"MaxVocher":0,"UseScore":0,"UseVoucher":0,"Status":301,"CartProductInfos":[{"ShopId":5,"UnitPrice":1000.00,"Quantity":1,"ProductId":24,"Name":"飞亚达(FIYTA)手表","ProductStatus":500,"Image":"http://imgs.wujiuyun.com//Images//product/banner//0809E1B6E5A54D72A55EE870E19D87E3.jpg","ProductSKUId":57,"TemplateValues":"{\"Id\":\"0_0\",\"Name\":\"0.35kg、黑色\",\"ShowObj\":{\"重量\":\"0.35kg\",\"颜色\":\"黑色\"}}","Selected":false,"UnitScoreO":250,"UnitVoucher":0},{"ShopId":5,"UnitPrice":-900.00,"Quantity":1,"ProductId":37,"Name":"冠琴(GUANQIN)手表","ProductStatus":500,"Image":"http://imgs.wujiuyun.com//Images//product/banner//C40C1B4DF80946F0A011E53AFC13BE42.jpg","ProductSKUId":78,"TemplateValues":"{\"Id\":\"0_0\",\"Name\":\"其他颜色、0.78kg\",\"ShowObj\":{\"颜色\":\"其他颜色\",\"重量\":\"0.78kg\"}}","Selected":false,"UnitScoreO":250,"UnitVoucher":0}]},{"ShopName":"佳振旺手机专卖店","ShopId":8,"MaxScore":0,"MaxVocher":0,"UseScore":0,"UseVoucher":0,"Status":301,"CartProductInfos":[{"ShopId":8,"UnitPrice":1398.00,"Quantity":1,"ProductId":44,"Name":"vivo Y85 全面屏 美颜拍照手机 移动联通电信4G 双卡双待 4G+32G 香槟金 4GB+32GB","ProductStatus":500,"Image":"http://imgs.wujiuyun.com//Images//product/banner//6BEBEF1AC3EA4FD0955364F73E883CC8.jpg","ProductSKUId":92,"TemplateValues":"{\"Id\":\"0_0_0\",\"Name\":\"黑金、全网通4G+32G、官方标配\",\"ShowObj\":{\"颜 色\":\"黑金\",\"版 本\":\"全网通4G+32G\",\"套餐\":\"官方标配\"}}","Selected":false,"UnitScoreO":0,"UnitVoucher":0}]}]
		// $scope.totalMoney = 2494;
		// $scope.originTotalMoney = 2494;

		// 计算初始化数据
		$scope.initData();
	})

	$scope.initData=function(){
		enterViewLoad.load()
		$scope.productList = $scope.productList.filter(function(item){
			item.MaxScore=0;
			item.MaxVocher=0;
			for(var i=0;i<item.CartProductInfos.length;i++){
				item.MaxScore= item.MaxScore + (item.CartProductInfos[i].UnitScoreO * item.CartProductInfos[i].Quantity)
				item.MaxVocher= item.MaxVocher + (item.CartProductInfos[i].UnitVoucher * item.CartProductInfos[i].Quantity)
			}
			return item
		})
		// 余额
		$http.post($Factory.Money.money.url)
			.then(function(resData){
				// resData.data.Scores = 1000
				$scope.pageData=resData.data;
				$ionicLoading.hide();
			}).catch(function(err){
				$ionicLoading.hide();
			})
		// 总共使用的积分和抵用券
		$scope.usingData={
			UseScore:0,
			UseVoucher:0
		}
		// 确认订单后返回
		$scope.calcUsingData();
	}
/*
	积分抵用券加减操作
*/ 
	// 计算使用积分 抵用券情况
	$scope.calcUsingData=function(type){
		$scope.usingData={
			UseScore:0,
			UseVoucher:0
		}
		$scope.totalMoney = $scope.originTotalMoney
		for(var i=0;i<$scope.productList.length;i++){
			$scope.usingData.UseScore = $scope.usingData.UseScore + $scope.productList[i].UseScore; 
			$scope.usingData.UseVoucher = $scope.usingData.UseVoucher + $scope.productList[i].UseVoucher; 
		}
		$scope.totalMoney = $scope.totalMoney - $scope.usingData.UseScore - $scope.usingData.UseVoucher;
	}
	// 计算使用积分 抵用券是否超过
	$scope.isOverflow=function(type){
		$scope.usingData={
			UseScore:0,
			UseVoucher:0
		}
		for(var i=0;i<$scope.productList.length;i++){
			$scope.usingData.UseScore = $scope.usingData.UseScore + $scope.productList[i].UseScore; 
			$scope.usingData.UseVoucher = $scope.usingData.UseVoucher + $scope.productList[i].UseVoucher; 
		}
		if(type=='score'){
			if($scope.usingData.UseScore > $scope.pageData.Scores){
				return false
			}
		}
		if(type=='vocher'){
			if($scope.usingData.UseVoucher > $scope.pageData.Vochers){
				return false
			}
		}
		return true
	}

	// 加 积分使用
	$scope.addScore=function(group){
		if(group.UseScore>=group.MaxScore){
			enterViewLoad.customload('最高可使用积分'+group.MaxScore)
			return
		}
		if($scope.usingData.UseScore >= $scope.pageData.Scores){
			enterViewLoad.customload('积分不足')
			return
		}
		group.UseScore++
		$scope.calcUsingData()
	}
	// 减 积分使用
	$scope.reduceScore=function(group){
		if(group.UseScore===0)return
		--group.UseScore
		$scope.calcUsingData()
	}
	// 积分变换
	$scope.scoreChange=function(group){
		if(group.UseScore>group.MaxScore){
			enterViewLoad.customload('最高可使用积分'+group.MaxScore)
			group.UseScore=0
		}
		if(group.UseScore<=0 || !group.UseScore){
			group.UseScore=null
		}
		// 计算
		if(!$scope.isOverflow('score')){
			enterViewLoad.customload('积分不足')
			group.UseScore=0
		}
		$scope.calcUsingData()
	}

	// 加 抵用券使用
	$scope.addVocher=function(group){
		if(group.UseVoucher>=group.MaxVocher){
			enterViewLoad.customload('最高可使用抵用金'+group.MaxVocher)
			return
		}
		if($scope.usingData.UseVoucher >= $scope.pageData.Vochers){
			enterViewLoad.customload('抵用券不足')
			return
		}
		group.UseVoucher++
		$scope.calcUsingData()
	}
	// 减 抵用券使用
	$scope.reduceVocher=function(group){
		if(group.UseVoucher<=0)return
		--group.UseVoucher
		$scope.calcUsingData()
	}
	// 抵用券变换
	$scope.vocherChange=function(group){
		if(group.UseVoucher>group.MaxVocher){
			enterViewLoad.customload('最高可使用积分'+group.MaxVocher)
			group.UseVoucher=0
		}
		if(group.UseVoucher<=0 || !group.UseVoucher){
			group.UseVoucher=null
		}
		// 计算
		if(!$scope.isOverflow('vocher')){
			enterViewLoad.customload('积分不足')
			group.UseVoucher=0
		}
		$scope.calcUsingData()
		
	}

/*
	商品数量加减操作
*/ 
	// 商品数量 加
	$scope.addQuantity=function(item){
		item.Quantity += 1;
		item.sum += item.UnitPrice;
		$scope.totalMoney = $scope.originTotalMoney + item.UnitPrice;
		$scope.originTotalMoney = $scope.originTotalMoney + item.UnitPrice;
		$scope.initData()
	}
	// 商品数量 减
	$scope.reduceQuantity=function(item){
		if(item.Quantity<=1){
			return
		}
		item.Quantity -= 1;
		item.sum -= item.UnitPrice;
		$scope.totalMoney = $scope.originTotalMoney - item.UnitPrice;
		$scope.originTotalMoney = $scope.originTotalMoney - item.UnitPrice;
		$scope.initData()
	}
	
	// 提交订单
	$scope.createOrder=function(){
		//商品推荐人
		var goodsFromWho = $cookies.get("goodsFromWho");
		
		$http.post($Factory.ProductOrder.create.url,
			{
				Shopers:$scope.productList,
				Total:$scope.totalMoney,
				Address:$scope.receiptAddress.Province+$scope.receiptAddress.City+
						$scope.receiptAddress.District+$scope.receiptAddress.Street+$scope.receiptAddress.Address
			}).then(function(resData){		
				if(resData.data.status!=0){
					enterViewLoad.customload(resData.data.msg)
					return
				}
				$scope.orderResult=resData.data //TradeNo Total
				$state.go('productPayOrder',{
					tradeno:resData.data.TradeNo,
					total:resData.data.Total,
					ismuilt:resData.data.IsMuilt,
					usedscore:resData.data.UsedScore,
					usedvoucher:resData.data.UsedVoucher

				})

				// 订单生成成功  本地购物车删除订单商品
				try{
					for(var i=0;i<$scope.productList.length;i++){
						for(var j=0;j<$scope.productList[i].CartProductInfos.length;j++){
							for(var k=0;k<$localStorage.shoppingCartList.length;k++){
								if($localStorage.shoppingCartList[k].ShopId==$scope.productList[i].CartProductInfos[j].ShopId&&
									$localStorage.shoppingCartList[k].ProductId==$scope.productList[i].CartProductInfos[j].ProductId&&
									$localStorage.shoppingCartList[k].ProductSKUId==$scope.productList[i].CartProductInfos[j].ProductSKUId){
									$localStorage.shoppingCartList.splice(k,1)	
								}
							}
						}
					}
				}catch(e){}
			}).catch(function(err){
				var msg = (err.data&&err.data.Message) || '生成订单失败'
				enterViewLoad.customload(msg)
			})
	}
})

