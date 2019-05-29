
angular.module('App').controller('lotteryPageCtl',function(appUtils,enterViewLoad,wechatLinkBase,WechatService,$localStorage,$ionicModal,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$timeout,$interval){
	$scope.back=function(){
		appUtils.back();
	}
	//闪灯效果
	$scope.splashStatus=true;
	var num = 0;
	$scope.splashInterval=$interval(function(){ 
		num++;
		if(num%2==0){
			$scope.splashStatus=true;
		}else{
			$scope.splashStatus=false;
		}
	},1000)

	$scope.clicked=false;
	$scope.$on('$ionicView.enter',function(){
		luck.init('luck');
		$scope.startLottery=function(){
			if($scope.clicked) {
				return false;
			}else{
				$scope.startDraw()
				
				return false;
			}
		}
		// 抽奖次数
		$scope.getTimes();
		// 所有奖品列表
		$scope.allPrizes();
		new Swiper('.lottery-winning-swiper', {
			direction: 'vertical',
			autoplay: true, //自动滑动
			loop: true,
			observer:true,
			on:{
				click: function(swiper){
				  
				},
			}
		});
	})
	
	$scope.$on('$ionicView.leave',function(){
		$interval.cancel($scope.splashInterval)
	})
	$scope.swiperList=[
		'恭喜用户“不服来战”获得50抵用金红包。',
		'恭喜用户“谢塊元”获得3抵用金红包。',
		'恭喜用户“东植”获得3抵用金红包。',
		'恭喜用户“zzg”获得500抵用金红包。',
		'恭喜用户“房田用户9”获得100抵用金红包。',
	]
	// 奖品列表
	$scope.allPrizes=function(){
		$http.post($Factory.Draw.lists.url)
			.then(function(resData){
				$scope.allprizeList=resData.data;
			}).catch(function(err){
				$scope.allprizeList=[];
				enterViewLoad.customload('获取失败')
			})
	}
	// 获取抽奖次数
	$scope.getTimes=function(){
		$http.post($Factory.Draw.times.url)
			.then(function(resData){
				$scope.drawTimes=resData.data;

			}).catch(function(err){
				$scope.drawTimes=resData.data;
				enterViewLoad.customload('获取失败')
			})
	}
	// 抽奖
	$scope.startDraw=function(){
		// 清除中奖数据
		$scope.drawData={}
		$http.post($Factory.Draw.raffle.url)
		.then(function(resData){
			// 抽奖次数
			--$scope.drawTimes;
			$scope.drawData=resData.data; //{Id:1,Money:500}
			// 开始旋转
			luck.speed=100;
			roll();
			$scope.clicked=true;
		}).catch(function(err){
			enterViewLoad.customload('操作失败')

		})
	}
	// 领取奖品
	$scope.getDraw=function(item){
		$http.post($Factory.Draw.getprize.url+'?id='+item.Id)
		.then(function(resData){
			item.Status=1
			enterViewLoad.customload('领取成功')
		}).catch(function(err){
			enterViewLoad.customload('领取失败')
		})
	}
	// 我的奖品
	$scope.myPrizes=function(){
		enterViewLoad.load()
		$http.post($Factory.Draw.myprize.url)
			.then(function(resData){
				$ionicLoading.hide();
				$scope.myprizeList=resData.data.filter(function(item){
					item.CreateTime = item.CreateTime.replace(/T/, " / ")
					return item
				});
				$scope.myprizeList=$scope.myprizeList.reverse()
			}).catch(function(err){
				$scope.myprizeList=[];
				enterViewLoad.customload('获取失败')
			})
	}
	

	// 正在旋转
	$scope.rolling=false
	var luck={
		index:-1,	//当前转动到哪个位置，起点位置
		count:0,	//总共有多少个位置
		timer:0,	//setTimeout的ID，用clearTimeout清除
		speed:20,	//初始转动速度
		times:0,	//转动次数
		cycle:50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
		prize:-1,	//中奖位置
		init:function(id){
			if ($("#"+id).find(".luck-unit").length>0) {
				$luck = $("#"+id);
				$units = $luck.find(".luck-unit");
				this.obj = $luck;
				this.count = $units.length;
				$luck.find(".luck-unit-"+this.index).addClass("active");
			};
		},

		
		roll:function(){
			$scope.rolling=true
			var index = this.index;
			var count = this.count;
			var luck = this.obj;
			index += 1;
			if (index>count-1) {
				index = 0; //转完一圈
			};
			$scope.activeIndex=index;
			this.index=index;
			return false;
		},
		stop:function(index){
			$scope.rolling=false
			this.prize=index;
			return false;
		}
	};


	function roll(){
		luck.times += 1;
		luck.roll();
		if (luck.times > luck.cycle+10 && luck.prize==luck.index) {
			// 停留中奖位置
			$timeout.cancel(luck.timer)
			luck.prize=-1;
			luck.times=0;
			$scope.clicked=false;
			$timeout(function(){
				$scope.rolling=false;
				// 弹出提示
				$scope.showWinningModal()	
			})
		}else{
			if (luck.times<luck.cycle) {
				luck.speed -= 10;
			}else if(luck.times==luck.cycle) {
				// 设置中奖位置
				// var index = Math.random()*(luck.count)|0;
				var index;
				switch($scope.drawData.Money){
					case $scope.allprizeList[0].Money:
						index=0;
						break;
					case $scope.allprizeList[1].Money:
						index=1;
						break;
					case $scope.allprizeList[2].Money:
						index=2;
						break;
					case $scope.allprizeList[3].Money:
						index=3;
						break;
					case $scope.allprizeList[4].Money:
						index=4;
						break;
					case $scope.allprizeList[5].Money:
						index=5;
						break;
					case $scope.allprizeList[6].Money:
						index=6;
						break;
					case $scope.allprizeList[7].Money:
						index=7;
						break;
					case $scope.allprizeList[8].Money:
						index=8;
						break;
					case $scope.allprizeList[9].Money:
						index=9;
						break;
					case $scope.allprizeList[10].Money:
						index=10;
						break;
					case $scope.allprizeList[11].Money:
						index=11;
						break;
					default:
						index=0;
				}
				luck.prize = index;
			}else{
				if (luck.times > luck.cycle+10 && ((luck.prize==0 && luck.index==7) || luck.prize==luck.index+1)) {
					luck.speed += 110;
				}else{
					luck.speed += 20;
				}
			}
			if (luck.speed<40) { //最快速度
				luck.speed=40;
			};
			luck.timer = $timeout(roll,luck.speed);
		}
		return false;
	}


	// 底部弹出
	$ionicModal.fromTemplateUrl('lottery_page_rules_modal', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.Modal = modal;
	});
	$scope.showModal=function(type){
		$scope.modalType=type
		if(type=='prize'){
			$scope.myPrizes()
		}else if(type=='recording'){
			$scope.allPrizes()
		}
		$scope.Modal.show();	
	}
	$scope.closeModal=function(){
		$scope.Modal.hide();
	}
	// 中奖弹出
	$ionicModal.fromTemplateUrl('lottery_page_winning_modal', {
		scope: $scope,
		animation: 'slide-in-left'
	}).then(function(modal) {
		$scope.winningModal = modal;
	});
	$scope.showWinningModal=function(){
		$scope.winningModal.show();
		$timeout(function(){
			$scope.closeWinningModal();
		},3000)
	}
	$scope.closeWinningModal=function(){
		$scope.winningModal.hide();
	}

})

