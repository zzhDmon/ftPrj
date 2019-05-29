
angular.module('App').controller('addShopCtl',function($addShopData,appUtils,enterViewLoad,$ionicScrollDelegate,$localStorage,$ionicModal,$ionicHistory,$timeout,$http,$Factory,$scope,$rootScope,$state,$stateParams,$ionicPopover){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.headtitle = '商铺新增';
	if($stateParams.id>0){
		$scope.headtitle = '商铺修改';		
	}
	$scope.paramsId = $stateParams.id * 1

	$scope.pageType=$stateParams.type;
	$scope.behaviour=$stateParams.behaviour*1;
	
	$scope.isTransfer={
		value:false
	};
	
	// 软键盘弹出 页面滚动
	$scope.scrollTo=function(to){
		$ionicScrollDelegate.scrollTo(0, to || 0, true)
	}
	$scope.addShopScrollListing=function(){
		$scope.currentTop = $ionicScrollDelegate.getScrollPosition().top;
		$addShopData.scrollTo = $scope.currentTop
	}
	window.addEventListener('native.keyboardshow',function(e){
		$scope.scrollTo($scope.currentTop)
	})
	
//显示过滤 
	$scope.filterShowData=function(arr,data,callback){
		$.map(arr,function(val) {
			if(val.text==data){
				if(val.subType){
					callback(val.value,val.subType)
				}else{
					callback(val.value)
				}
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
		$scope.scrollTo($addShopData.scrollTo)
	})
	$scope.initData=function(){
		$http.get('jsonData/addShop/subShopData.json').then(function(resData){	
			//付款方式
			// $scope.paytype=[]
			// for(var i=0;i<99;i++){
			// 	$scope.paytype.push(i)
			// }
			// $.scrEvent({
			// 	data: $scope.paytype,  
			// 	evEle: '.paytype-fu',         
			// 	title: '付',           
			// 	defValue: '1', 
			// 	afterAction: function (data) { 
			// 		$('.paytype-fu').val(data)
			// 		$scope.addShopSubData.PayMouth=data;
			// 	}
			// });
			// $.scrEvent({
			// 	data: $scope.paytype,  
			// 	evEle: '.paytype-ya',         
			// 	title: '押',           
			// 	defValue: '0', 
			// 	afterAction: function (data) { 
			// 		$('.paytype-ya').val(data)
			// 		$scope.addShopSubData.MortMonth=data;
			// 	}
			// });
			//楼层
			$scope.paytype=[]
			for(var i=0;i<99;i++){
				$scope.paytype.push(i)
			}
			$.scrEvent2({
				data: $scope.paytype,
				data2: $scope.paytype,
				evEle: '.shop-paytype',
				title: '选择付款方式',
				defValue: 1,
				defValue2: 1,
				eleName: '付',
				eleName2: '押',
				afterAction: function (data1, data2) {
					$scope.addShopShowData.payType='付'+data1+'押'+data2
					$('.shop-paytype').val('付'+data1+'押'+data2);
					$scope.addShopSubData.PayMouth=data1;
					$scope.addShopSubData.MortMonth=data2;
				}
			});
			
			$.scrEvent({
				data: ['经营中','空置中'],  
				evEle: '.shop-businessstatus',         
				title: '选择经营状态',           
				defValue: '经营中', 
				afterAction: function (data) { 
					$('.shop-businessstatus').val(data)
					$scope.addShopShowData.businessStatus=data
					switch(data){
						case '经营中':
							$scope.addShopSubData.BusinessState=0;
							break
						case '空置中':
							$scope.addShopSubData.BusinessState=1;
							break
						default:
							$scope.addShopSubData.BusinessState=0;
							break
					}
				}
			});
			//楼层
			$scope.loucengarr=[]
			for(var i=0;i<99;i++){
				$scope.loucengarr.push(i)
			}
			$.scrEvent({
				data: $scope.paytype,  
				evEle: '.shop-louceng-from',         
				title: '选择起始层',           
				defValue: '1', 
				afterAction: function (data) { 
					$('.shop-louceng-from').val(data+'层')
					$scope.addShopSubData.Floor=data;
				}
			});
			$.scrEvent({
				data: $scope.paytype,  
				evEle: '.shop-louceng-mid',         
				title: '选择至几层',           
				defValue: '2', 
				afterAction: function (data) { 
					$('.shop-louceng-mid').val(data+'层')
					$scope.addShopSubData.MiddleFloor=data;
				}
			});
			$.scrEvent({
				data: $scope.paytype,  
				evEle: '.shop-louceng-total',         
				title: '选择总楼层',           
				defValue: '1', 
				afterAction: function (data) { 
					$('.shop-louceng-total').val(data+'层')
					$scope.addShopSubData.TotalFloor=data;
				}
			});
		
	
			$.scrEvent({
				data: ['不代理','可被代理','可探讨代理'],  
				evEle: '.shop-proxtype',       
				title: '选择代理状态',         
				defValue: '不代理',          
				afterAction: function (data) { 
					$(".shop-proxtype").val(data);
					$scope.addShopShowData.proxType=data;
					switch(data){
						case '不代理':
							$scope.addShopSubData.ProxType=0;
							break;	
						case '可被代理':
							$scope.addShopSubData.ProxType=1;
							break;	
						case '可探讨代理':
							$scope.addShopSubData.ProxType=2;
							break;
						default:
							$scope.addShopSubData.ProxType=0;
							break;	
					}
				}
			});
			
			// 页面显示
			if($stateParams.id>0){
				$http.get($Factory.SimpleHouse.getdetail.url,{params:{id:$stateParams.id,isshop:true}}).then(function(resData){
					if($addShopData.data && $addShopData.data.Id==resData.data.Id){
						$scope.addShopSubData=$addShopData.data;
						$scope.addShopShowData=$addShopData.showData;
					}else{
						if(resData.data.Behaviour==3){
							$scope.isTransfer.value = true;
						}
						
						$scope.addShopSubData=resData.data;
						$scope.addShopShowData={
							louCeng:'',
							manageType:'',
							subType:'',
							proxType:'',
							payType:'付'+resData.data.PayMouth+'押'+resData.data.MortMonth,
							businessStatus:'',
						}
						$scope.addShopSubData.ConfigurJson=JSON.parse($scope.addShopSubData.ConfigurJson)					
					}
				})
			}else{
				if($addShopData.data && !$addShopData.showData.Id){
					$scope.addShopSubData = $addShopData.data;
					$scope.addShopShowData = $addShopData.showData;
				}else{
					// 初始化数据结构模型
					$scope.addShopShowData={
						louCeng:'',
						manageType:'',
						subType:'',
						proxType:'',
						payType:'',
						businessStatus:'',
					}
					$scope.addShopSubData={
						AccountId:0,
						Address:null,
						AuthStatus:0,
						Behaviour:0,
						BusinessState:0,
						City:appUtils.city.id,
						CommunityId:null,
						CommunityName:null,
						ConfigurJson:[
							{"text":"客梯","value":1,"isChecked":false},
							{"text":"货梯","value":2,"isChecked":false},
							{"text":"中央空调","value":3,"isChecked":false},
							{"text":"停车位","value":4,"isChecked":false},
							{"text":"天然气","value":5,"isChecked":false},
							{"text":"电话/网络","value":6,"isChecked":false},
							{"text":"暖气","value":7,"isChecked":false},
							{"text":"扶梯","value":8,"isChecked":false},
							{"text":"上水","value":9,"isChecked":false},
							{"text":"下水","value":10,"isChecked":false},
							{"text":"排烟","value":11,"isChecked":false},
							{"text":"排污","value":12,"isChecked":false},
							{"text":"管煤","value":13,"isChecked":false},
							{"text":"380V","value":11,"isChecked":false},
							{"text":"可明火","value":12,"isChecked":false},
							{"text":"外摆区","value":13,"isChecked":false}
						],
						Depth:null,
						Discription:null,
						District:null,
						Floor:null,
						FloorType:0,
						FreeMouth:null,
						Height:null,
						HouseRate:0,
						HouseType:1,
						Id:0,
						IndoorImages:[],
						IndoorShowImages:[] ,
						ManageType:0,
						MiddleFloor:null,
						MinMouth:null,
						MortMonth:0,
						PayMouth:0,
						PayType:null,
						Price:null,
						ShopType:0,
						Space:null,
						Street:null,
						SubType:0,
						Tags:[],
						Title:null,
						TotalFloor:null,
						TransferFee:0,
						UserType:2,
						With:null,
						resiMonth:0
					}
		
				}	
			}
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
	}

	
	// 图片图库获取
	$scope.photoChoose = function(){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post($Factory.Account.upload.url,{
				path:'18/otherHouseSource',
				file:base,
				orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addShopSubData.IndoorImages.push(resData.data.url)
					$scope.addShopSubData.IndoorShowImages.push(resData.data.view);
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
		
	}
	// 图片相机获取
	$scope.cameraBase = function(){
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post($Factory.Account.upload.url,{
				path:'18/otherHouseSource',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addShopSubData.IndoorImages.push(resData.data.url)
					$scope.addShopSubData.IndoorShowImages.push(resData.data.view);
				}
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}

	//点击叉号去除
	$scope.remove=function(index){
		$scope.addShopSubData.IndoorImages.splice(index,1)
		$scope.addShopSubData.IndoorShowImages.splice(index,1);
	}
	// sort 图片
	Sortable.create(document.getElementById('addShop_sortindoor_img'), {
        group: {
            name:"otherwords",
            pull: 'clone',
            put: true 
        },
        animation: 150, //动画参数
        onAdd: function (evt){ 
        },
        onUpdate: function (evt){  
        },
        onRemove: function (evt){ 
        },
        onStart:function(evt){ 
        },
        onSort:function(evt){ 
        },
		onEnd: function(evt){ 
			$timeout(function(){
				var waitImgItem=$scope.addShopSubData.IndoorImages[evt.oldIndex]
				var waitShowImgItem=$scope.addShopSubData.IndoorShowImages[evt.oldIndex]
				$scope.addShopSubData.IndoorImages.splice(evt.oldIndex,1)
				$scope.addShopSubData.IndoorShowImages.splice(evt.oldIndex,1);
				// 新增
				$scope.addShopSubData.IndoorImages.splice(evt.newIndex,0,waitImgItem)
				$scope.addShopSubData.IndoorShowImages.splice(evt.newIndex,0,waitShowImgItem);
			})
		}
    });
		
    
	$ionicModal.fromTemplateUrl('shop_GoLogin-modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
		});
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
// 预览
	$ionicModal.fromTemplateUrl('add_shop_preview_modal', {
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

	$scope.publish=function(){
		

		if(!$scope.addShopSubData.Address && $scope.behaviour==1){
			enterViewLoad.customload('请输入房地坐落');
			return
		}
		if(!$scope.addShopSubData.Title){
			enterViewLoad.customload('请输入标题');
			return
		}
		if(!$scope.addShopSubData.Space){
			enterViewLoad.customload('请输入面积');
			return
		}
		if(!$scope.addShopSubData.Price){
			enterViewLoad.customload('请输入价格');
			return
		}
		

		if($scope.addShopSubData.IndoorImages.length<3){
			enterViewLoad.customload('选择至少三张图片');
			return
		}else if($scope.addShopSubData.IndoorImages.length>10){
			enterViewLoad.customload('选择最多十张图片');
			return
		}else{}

		if($scope.behaviour==1){
			$scope.addShopSubData.Behaviour=$scope.behaviour;
		}else{
			if(!$scope.isTransfer.value){
				$scope.addShopSubData.Behaviour=2;
			}else{
				$scope.addShopSubData.Behaviour=3;
			}
		}

		
		var realSubData= JSON.parse(JSON.stringify($scope.addShopSubData))
		realSubData.ConfigurJson=JSON.stringify(realSubData.ConfigurJson)
		
		$http.post($Factory.SimpleHouse.shopsave.url,realSubData).then(function(resData){
				$scope.deleteSubData=true;
				$addShopData.scrollTo = 0;

				if($stateParams.id>0){
					enterViewLoad.customload('修改成功');
				}else{enterViewLoad.customload('新增成功');}
				
				$timeout(function(){
					$state.go('myHouses',{type:3})
				},1500)
		}).catch(function(res){
			// $scope.addShopSubData.ConfigurJson=JSON.parse($scope.addShopSubData.ConfigurJson);
			if(res.status==400){
				$scope.modalType='realname';
				$scope.modal.show();
			}
			else if(res.status==401){
				$scope.modalType='login';
				$scope.modal.show();
			}else if(res.status==500){
				enterViewLoad.customload('请将信息填写完整');
			}
		})								
	}	
		
	$scope.$on('$ionicView.beforeLeave',function(event,data){
		if(!$scope.deleteSubData){
			if($scope.addShopSubData){		
				$addShopData.data=$scope.addShopSubData;		
				$addShopData.showData=$scope.addShopShowData;		
			}
		}else{
			$addShopData.data = null;
			$addShopData.showData = null;
		}
	})    	   
})
.factory('$addShopData', [function () {
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
