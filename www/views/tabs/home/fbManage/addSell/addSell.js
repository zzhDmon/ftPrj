
angular.module('App').controller('addSellCtl',function($addSellData,appUtils,wechatLinkBase,WechatService,$ionicScrollDelegate,$localStorage,$ionicModal,enterViewLoad,$ionicLoading,$ionicHistory,$timeout,$http,$Factory,$scope,$rootScope,$state,$stateParams,$ionicPopover){
	
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.headtitle = '二手房新增';
	if($stateParams.id>0){
		$scope.headtitle = '二手房修改';		
	}

// $getByHandle('add-sell-Scroll')
	// 软键盘弹出 页面滚动
	$scope.scrollTo=function(to){
		$ionicScrollDelegate.scrollTo(0, to || 0, false)
	}
	$scope.addSellScrollListing=function(){
		$scope.currentTop = $ionicScrollDelegate.getScrollPosition().top;
		$addSellData.scrollTo = $scope.currentTop  
	}
	window.addEventListener('native.keyboardshow',function(e){
		$scope.scrollTo($scope.currentTop)
	}) 
	
//show<=>sub
	$scope.filterShowData=function(arr,data,callback){
		$.map(arr,function(val) {
			if(val.text==data){
				callback(val.value)
				return
			}
		});
	}
	$scope.filterChangeData=function(arr,data,callback){
		$.map(arr,function(val) {
			if(val.value==data){
				callback(val.text)
				return
			}
		});
	}
	
	$scope.$on('$ionicView.enter',function(){
		$scope.initData()
		$scope.scrollTo($addSellData.scrollTo)
	})
	$scope.initData=function(){
		$http.get('jsonData/addSell/sellHouseData.json').then(function(resData){		
			// 佣金
			// $scope.commission=resData.data.Commission;
			// $scope.commissionarr=[]
			// for(var i=0;i<$scope.commission.length;i++){
			// 	$scope.commissionarr.push($scope.commission[i].text)
			// }	
			// $.scrEvent({
			// 	  data: $scope.commissionarr,  
			// 	  evEle: '.qu-commission',       
			// 	  title: '选择佣金比例',         
			// 	  defValue: '0.5%',          
			// 	afterAction: function (data) { 
			// 		$(".qu-commission").val(data);
			// 		$scope.addSellShowData.commissionNum=data;
			// 		console.log(data)
			// 		$scope.filterShowData($scope.commission,data,function(value){
			// 			$scope.addSellSubData.ExProp.Commission=value;
			// 			console.log(value)
			// 		})
			// 	}
			// });
			// 产权
			$scope.righttype=resData.data.PropertyRight.Type;
			$scope.righttypearr=[]
			for(var i=0;i<$scope.righttype.length;i++){
				$scope.righttypearr.push($scope.righttype[i].text)
			}	
			$.scrEvent({
				  data: $scope.righttypearr,  
				  evEle: '.qu-righttype',       
				  title: '选择产权类型',         
				  defValue: '商品房',          
				afterAction: function (data) { 
					$(".qu-righttype").val(data);
					$scope.addSellShowData.chanquanType=data;
					$scope.filterShowData($scope.righttype,data,function(value){
						$scope.addSellSubData.ExProp.RightType=value;
					})
				}
			});
			$scope.rightyear=resData.data.PropertyRight.Year;
			$scope.rightyeararr=[]
			for(var i=0;i<$scope.rightyear.length;i++){
				$scope.rightyeararr.push($scope.rightyear[i].text)
			}
	
			$.scrEvent({
				  data: $scope.rightyeararr,  
				  evEle: '.qu-rightyear',       
				  title: '选择产权年限',         
				  defValue: '70年',          
				afterAction: function (data) { 
					$(".qu-rightyear").val(data);
					$scope.addSellShowData.chanquanYear=data;
					$scope.filterShowData($scope.rightyear,data,function(value){
						$scope.addSellSubData.ExProp.RightYear=value;
					})
				}
			});
			// 房屋年限
			$scope.usedyear=resData.data.UsedYear;
			$scope.usedyeararr=[]
			for(var i=0;i<$scope.usedyear.length;i++){
				$scope.usedyeararr.push($scope.usedyear[i].text)
			}	
			$.scrEvent({
				  data: $scope.usedyeararr,  
				  evEle: '.qu-usedyear',       
				  title: '选择房屋年限',         
				  defValue: '满二',          
				afterAction: function (data) { 
					$(".qu-usedyear").val(data);
					$scope.addSellShowData.fangwuYear=data;
					$scope.filterShowData($scope.usedyear,data,function(value){
						$scope.addSellSubData.ExProp.UsedYear=value;
					})
				}
			});
	
			$.scrEvent({
				  data: ['不代理','可被代理','可探讨代理'],  
				  evEle: '.qu-proxtype',       
				  title: '选择代理状态',         
				  defValue: '不代理',          
				afterAction: function (data) { 
					$(".qu-proxtype").val(data);
					$scope.addSellShowData.proxType=data;
					switch(data){
						case '不代理':
							$scope.addSellSubData.ProxType=0;
							break;	
						case '可被代理':
							$scope.addSellSubData.ProxType=1;
							break;	
						case '可探讨代理':
							$scope.addSellSubData.ProxType=2;
							break;
						default:
							$scope.addSellSubData.ProxType=0;
							break;	
					}
				}
			});
			
	//self 
			$scope.chaoxiang=resData.data.HouseStatus.Orientation;
			$scope.chaoxiangarr=[]
			for(var i=0;i<$scope.chaoxiang.length;i++){
				$scope.chaoxiangarr.push($scope.chaoxiang[i].text)
			}	
			$.scrEvent({
				  data: $scope.chaoxiangarr, 
				  evEle: '.qu-chaoxiang',          
				  title: '选择朝向',           
				  defValue: '东',           
				afterAction: function (data) {
					$(".qu-chaoxiang").val(data);
					$scope.addSellSubData.Orientation=data;
				}
			});
			//楼层
			var loucengarr=[]
			for(var i=0;i<99;i++){
				loucengarr.push(i)
			}
			$.scrEventCus2({
				data: loucengarr,
				data2: loucengarr,
				evEle: '.sell-louceng',
				title: '选择楼层',
				defValue: 1,
				defValue2: 1,
				eleName: '层',
				eleName2: '层',
				eleNo:'第',
				eleTotal:'共',
				afterAction: function (data1, data2) {
				  $('.sell-louceng').val(data1 + '/' + data2);
				  $scope.addSellSubData.Floor=data1;
				  $scope.addSellSubData.TotalFloor=data2;
				  $scope.addSellShowData.louCeng=data1+'/'+data2
				}
			});
			
			//房型
			$.scrEvent3({
				data: [0,1,2,3,4,5,6,7,8,9],
				data2: [0,1,2,3,4,5,6,7,8,9],
				data3: [0,1,2,3,4,5,6,7,8,9],
				evEle: '.qu-fangxing',
				title: '选择户型',
				defValue: 1,
				defValue2: 1,
				defValue3: 1,
				eleName: '室',
				eleName2: '厅',
				eleName3: '卫',
				afterAction: function (data1, data2,data3) {
				  $('.qu-fangxing').val(data1 + '室' + data2 + '厅'+data3+'卫');
				  $scope.addSellSubData.RoomType=data1;
				  $scope.addSellSubData.HallType=data2;
				  $scope.addSellSubData.BathType=data3;
				  $scope.addSellShowData.fangXing=data1 + '室' + data2 + '厅'+data3+'卫';
				  
				}
			});
				
			//类型
			var leixing=resData.data.HouseStatus.HouseType;
			var leixingarr=[];
			for(var i=0;i<leixing.length;i++){
				leixingarr.push(leixing[i].text)
			}
			$.scrEvent({
			  data: leixingarr, 
			  evEle: '.qu-leixing',         
			  title: '选择类型',           
			  defValue: '普通住宅',          
			  afterAction: function (data) { 
				$(".qu-leixing").val(data);
				$scope.addSellSubData.BuildType=data;
			  }
			});
			
			//装修
			var zhuangxiu=resData.data.HouseStatus.Fitment;
			var zhuangxiuarr=[];
			for(var i=0;i<zhuangxiu.length;i++){
				zhuangxiuarr.push(zhuangxiu[i].text)
			}
			$.scrEvent({
				  data: zhuangxiuarr, 
				  evEle: '.qu-zhuangxiu',  
				  title: '选择装修',          
				  defValue: '毛坯',      
				  afterAction: function (data) { 
					$(".qu-zhuangxiu").val(data);
					$scope.addSellSubData.Fitment=data;
				  }
			});
		   
	
			// 页面显示
			if($stateParams.id>0){
				$http.get($Factory.NewHouseSource.detail.url,{params:{id:$stateParams.id}}).then(function(resData){
					// if($localStorage.addSellSubData&&$localStorage.addSellSubData.Id==resData.data.Id){
					if($addSellData.data && $addSellData.data.Id==resData.data.Id){
						// $scope.addSellShowData=$localStorage.addSellShowData;
						// $scope.addSellSubData=$localStorage.addSellSubData;
						$scope.addSellShowData=$addSellData.showData;
						$scope.addSellSubData=$addSellData.data;
					}else{
						$scope.addSellShowData={
							louCeng:resData.data.Floor+'/'+resData.data.TotalFloor,
							fangXing:resData.data.RoomType+'室'+resData.data.HallType+'厅'+resData.data.BathType+'卫',
							chanquanYear:'',
							chanquanType:'',
							fangwuYear:'',
							proxType:'',
							commissionNum:'',
							huShiHao:'',
						}
					
						if(resData.data.ExProp){
							resData.data.ExProp=JSON.parse(resData.data.ExProp)
							$scope.filterChangeData($scope.usedyear,resData.data.ExProp.UsedYear,function(text){
								$scope.addSellShowData.fangwuYear=text;
							})
							$scope.filterChangeData($scope.rightyear,resData.data.ExProp.RightYear,function(text){
								$scope.addSellShowData.chanquanYear=text;
							})
							$scope.filterChangeData($scope.righttype,resData.data.ExProp.RightType,function(text){
								$scope.addSellShowData.chanquanType=text;
							})
							// 佣金不需要再过滤
							// $scope.filterChangeData($scope.commission,resData.data.ExProp.Commission,function(text){
							// 	console.log(text)
							// 	$scope.addSellShowData.commissionNum=text;
							// })
						}else{
							resData.data.ExProp={
								HouseNum1:null, 
								HouseUnit1:null,
								HouseNum2 :null,
								HouseUnit2:null,
								HouseNum3:null,
								RightYear:null,
								RightType:null,
								HasElevator:false,
								UsedYear:null,
								OnlyOne:false,
								IsNew:false,
								Commission:null
							}
						}
					
						switch(resData.data.ProxyStatus){
							case 0:
								$scope.addSellShowData.proxType='不代理';
								break
							case 1:
								$scope.addSellShowData.proxType='可代理';
								break
							case 2:
								$scope.addSellShowData.proxType='可探讨代理';
								break
							default:
								$scope.addSellShowData.proxType='不代理';
								break
						}	
						$scope.addSellSubData=resData.data;						
					}
				})
			}else{
				if($addSellData.data && !$addSellData.data.Id){					
					$scope.addSellShowData=$addSellData.showData;
					$scope.addSellSubData=$addSellData.data;					
				}else{
					$scope.addSellShowData={
						louCeng:'',
						fangXing:'',
						chanquanYear:'',
						chanquanType:'',
						fangwuYear:'',
						proxType:'',
						commissionNum:'',
						huShiHao:'',
					}
					$scope.addSellSubData={
						City:appUtils.city.id,
						Type: 1,
						Address:'',
						IndoorImages: [],
						IndoorShowImages: [],
						LayoutImages: [],
						LayoutShowImages: [],
						Title: "",
						Number: "",
						Price: "",
						PayType: "",
						RentType: "",
						Space: "",
						InnerSpace: "",
						RoomType: "",
						HallType: "",
						BathType: "",
						Floor: "",
						TotalFloor: "",
						BuildType: "",
						Orientation: "",
						Fitment: "",
						Year: "",
						Special: [],
						Configure: [],
						Discription: "",
						Recommend: true,
						AccountId: "",
						CommunityId: "",
						CreateTime: "",
						CommunityName: "",
						CommunityAddress: "",
						Tags: [],
						ProxyStatus: 0,
						Commuport:'',
						ExProp:{
							HouseNum1:null, 
							HouseUnit1:null,
							HouseNum2 :null,
							HouseUnit2:null,
							HouseNum3:null,
							RightYear:null,
							RightType:null,
							HasElevator:false,
							UsedYear:null,
							OnlyOne:false,
							IsNew:false,
							Commission:null
						},
						OwnerPsy:null,
						ServiceIntro:null,
						IsShowPhone:false,
						UserType:2,
	
					}
				}	
			}
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
	}

	// 室内图片图库获取
	$scope.photoChoose = function(){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
					path:'18/sellHouseSource',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addSellSubData.IndoorImages.push(resData.data.url)
					$scope.addSellSubData.IndoorShowImages.push(resData.data.view);
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
		
	}
	// 室内图片相机获取
	$scope.indoorCameraBase = function(){
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post( $Factory.Account.upload.url,{
					path:'18/sellHouseSource',
					file:base
				}).then(function(resData){
				if(resData.data.error==0){
					$scope.addSellSubData.IndoorImages.push(resData.data.url)
					$scope.addSellSubData.IndoorShowImages.push(resData.data.view);
				}
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}

	//点击叉号去除
	$scope.remove=function(index){
		$scope.addSellSubData.IndoorImages.splice(index,1)
		$scope.addSellSubData.IndoorShowImages.splice(index,1);
	}

	// sort 图片
	Sortable.create(document.getElementById('addsell_sortindoor_img'), {
        group: {
            name:"indoorwords",
            pull: '',
            put: false 
        },
        animation: 150, //动画参数
        onAdd: function (evt){ //拖拽时候添加有新的节点的时候发生该事件
            //  console.log('onAdd.foo:', [evt.item, evt.from]); 
        },
        onUpdate: function (evt){ //拖拽更新节点位置发生该事件
            //  console.log('onUpdate.foo:', [evt.item, evt.from]); 
        },
        onRemove: function (evt){ //删除拖拽节点的时候促发该事件
            //  console.log('onRemove.foo:', [evt.item, evt.from]); 
        },
        onStart:function(evt){ //开始拖拽出发该函数
            //  console.log('onStart.foo:', [evt.item, evt.from]);
        },
        onSort:function(evt){ //发生排序发生该事件
            //  console.log('onSort.foo:', [evt.item, evt.from]);
        },
		onEnd: function(evt){ //拖拽完毕之后发生该事件
			$timeout(function(){
				var waitImgItem=$scope.addSellSubData.IndoorImages[evt.oldIndex]
				var waitShowImgItem=$scope.addSellSubData.IndoorShowImages[evt.oldIndex]
				$scope.addSellSubData.IndoorImages.splice(evt.oldIndex,1)
				$scope.addSellSubData.IndoorShowImages.splice(evt.oldIndex,1);
				// 新增
				$scope.addSellSubData.IndoorImages.splice(evt.newIndex,0,waitImgItem)
				$scope.addSellSubData.IndoorShowImages.splice(evt.newIndex,0,waitShowImgItem);
			})
		}
    });


		
// 是否登录  
	$ionicModal.fromTemplateUrl('sellGoLogin-modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
		});
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
// 预览
	$ionicModal.fromTemplateUrl('add_sell_preview_modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.previewModal = modal;
		});
	$scope.showPreviewModal=function(){
		$scope.previewModal.show();
	}
	$scope.closePreviewModal=function(){
		$scope.previewModal.hide();
	}
// 认证
	$ionicModal.fromTemplateUrl('choose_share_auth_modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.authShareModal = modal;
		});
		
	$scope.showauthShareModal=function(){
		$scope.authShareModal.show();
		$scope.addSellSuccess=true;
	}
	$scope.closeauthShareModal=function(){
		$scope.authShareModal.hide();
	}
// 分享框
	$ionicModal.fromTemplateUrl('bottom_share_modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.bottomShareModal = modal;
		});
	$scope.showBottomShareModal=function(){
		$scope.bottomShareModal.show();
	}
	
	$scope.closeBottomShareModal=function(){
		$scope.bottomShareModal.hide();
	}
	$scope.$on('modal.hidden', function() {
		$scope.addSellSuccess=false;
		if($scope.addSellSuccess){
			if($scope.ShareOrAuth&&$scope.ShareOrAuth=='share'){
				
			}else if($scope.ShareOrAuth&&$scope.ShareOrAuth=='auth'){
				
			}else{
				$state.go('myHouses',{type:1})
			}
		}
	});
	
	$scope.chooseShare=function(){
		$scope.ShareOrAuth=='share';
		$scope.showBottomShareModal()
	}
	$scope.chooseAuth=function(){
		$scope.ShareOrAuth=='auth';
		$state.go('realHouse',{id:$scope.returnId})
	}
	$scope.share = function (shareto){
		var shareImgUrl=$scope.addSellSubData.IndoorImages[0] || 'http://imgs.wujiuyun.com/images/logo.png';
		if(shareto==0||shareto==1){
			wechatLinkBase.changeBase(shareImgUrl,function(base64){
				var params = {
					scene: shareto,
					message: {
						title: $scope.addSellShowData.Title,
						thumb: base64,
						description:$scope.addSellSubData.Discription || '房田网为您推荐',
						media: {
							type: Wechat.Type.LINK,
							webpageUrl:appUtils.shareHost+"/#/sellhousedetail/"+$scope.returnId
						}
					}
				};
				WechatService.share(params);
			})
		}else{
			if(shareto==2){
				var args = {};
				args.url = appUtils.shareHost+"/#/sellhousedetail/"+$scope.returnId;
				args.title = $scope.addSellShowData.Title;
				args.description =$scope.addSellSubData.Discription || '房田网为您推荐';
				args.imageUrl = $scope.shareImgUrl;
				args.appName = "房田网";
				appUtils.qqShareQQAndroid(args,function(){
					
				},function(failReason){

				});
			}else{
				var args = {};
				args.url = appUtils.shareHost+"/#/sellhousedetail/"+$scope.returnId;
				args.title =  $scope.addSellShowData.Title;
				args.description = $scope.addSellSubData.Discription || '房田网为您推荐';
				var imgs =[$scope.shareImgUrl];
				args.imageUrl = imgs;
				YCQQ.shareToQzone(function () {
				}, function (failReason) {
				}, args);
			}
		}
    }
	
	$scope.publish=function(){
		if($scope.addSellSubData.IndoorImages.length<3){
			enterViewLoad.customload('至少三张室内图')
			return
		}else if($scope.addSellSubData.IndoorImages.length>10){
			enterViewLoad.customload('最多十张室内图')
			return
		}else{}

		if(!$scope.addSellSubData.CommunityName){
			enterViewLoad.customload('请选择小区')	
			return
		}
		if(!$scope.addSellSubData.Address){
			enterViewLoad.customload('请输入房地坐落')	
			return
		}
		if(!$scope.addSellSubData.Title){
			enterViewLoad.customload('请输入标题')	
			return
		}
		if(!$scope.addSellSubData.Space){
			enterViewLoad.customload('请输入产权面积')		
			return
		}
		if(!$scope.addSellSubData.Price){
			enterViewLoad.customload('请输入售价')		
			return
		}
		if(!$scope.addSellSubData.RoomType && !$scope.addSellSubData.HallType && !$scope.addSellSubData.BathType){
			enterViewLoad.customload('请选择户型')		
			return
		}
		
		var realSubData= JSON.parse(JSON.stringify($scope.addSellSubData)) 
		realSubData.ExProp=JSON.stringify(realSubData.ExProp)
		
		$http.post($Factory.NewHouseSource.save.url,realSubData).then(function(resData){
			// resData.data=>id
			$scope.deleteSubData=true;
			$addSellData.scrollTo = 0

			if($stateParams.id>0){
				enterViewLoad.customload('修改成功');
			}else{enterViewLoad.customload('新增成功');}	
			$timeout(function(){
				$state.go('myHouses',{type:1})
			},1500)
			// if($stateParams.id>0){
			// 	enterViewLoad.customload('新增房源成功');	
			// 	$timeout(function(){
			// 		$state.go('myHouses',{type:1})
			// 	},1500)
			// }else{
			// 	$scope.showauthShareModal();
			// 	$scope.returnId=resData.data;
			// }
		}).catch(function(res){
			if(res.status==400){
				$scope.modalType='realname';
				$scope.modal.show();
			}else if(res.status==401){
				$scope.modalType='login';
				$scope.modal.show();
			}else if(res.status==500){
				enterViewLoad.customload('服务器错误')	
			}else{
				enterViewLoad.customload('新增房源失败')	
			}
		})								
	}	
  
	$scope.$on('$ionicView.beforeLeave',function(event,data){
		if(!$scope.deleteSubData){
			if($scope.addSellSubData){
				var obj=$('#add_sell input[type="checkbox"]');  
				$scope.addSellSubData.Special=[];
				for(var i=0; i<obj.length; i++){ 
					if(obj[i].checked){
						$scope.addSellSubData.Special.push(i+1); //如果选中，将value添加到变量s中
					} 
				}		
				$addSellData.data=$scope.addSellSubData;
				$addSellData.showData=$scope.addSellShowData;	
			}
		}else{
			$addSellData.data=null
			$addSellData.showData = null
		}
	})    	   
})
.factory('$addSellData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
		data:null,
		showData:null,
		scrollTo:null
	};

	return new Util();
}]);
