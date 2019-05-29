
angular.module('App').controller('addRentCtl',function($addRentData,enterViewLoad,upImgBase,appUtils,$ionicScrollDelegate,$localStorage,$ionicModal,$ionicHistory,$http,$Factory,$rootScope,$scope,$state,$stateParams,$ionicPopover,$timeout){
	
	$scope.back=function(){
		appUtils.back();
	}
	
	// 软键盘弹出 页面滚动
	$scope.scrollTo=function(to){
		$ionicScrollDelegate.scrollTo(0, to || 0, false)
	}
	$scope.addRentScrollListing=function(){
		$scope.currentTop = $ionicScrollDelegate.getScrollPosition().top;
		$addRentData.scrollTo = $scope.currentTop
	}
	window.addEventListener('native.keyboardshow',function(e){
		$scope.scrollTo($scope.currentTop)
	})

	$scope.doType = '新增';
	if($stateParams.id>0){
		$scope.doType = '修改'
	}
	$scope.attach=$stateParams.attach
	switch ($scope.attach*1){
		case 1:
			$scope.headTitle='品牌公寓';
			break;
		case 2:
			$scope.headTitle='个人房源';
			break;
		case 3:
			$scope.headTitle='房东委托';
			break;
		case 4:
			$scope.headTitle='合租';
			break;
		case 5:
			$scope.headTitle='短租';
			break;
		default:
			$scope.headTitle='整租';
			break;
	}

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
		$scope.scrollTo($addRentData.scrollTo)
	})
	$scope.initData = function(){
		$http.get('jsonData/addRent/rentHouseData.json').then(function(resData){
			//租房方式
			$.scrEvent({
			  data: ['整租','合租','短租'], 
			  evEle: '.zf-zufang',          
			  title: '租房方式',           
			  defValue: '整租',            
			  afterAction: function (data) {  
				$(".zf-zufang").val(data);
				$scope.addRentSubData.RentType=data;
			  }
			});
			
			 //付款方式
			$scope.fukuangtype=resData.data.PayType;
			var fukuangarr=[];
			for(var i=0;i<$scope.fukuangtype.length;i++){
				fukuangarr.push($scope.fukuangtype[i].text)
			}
			$.scrEvent({
				data: fukuangarr,   
				evEle: '.zf-fukuan',     
				title: '选择付款方式',         
				defValue: '押1付1',          
				afterAction: function (data) {   
					$(".zf-fukuan").val(data);
					$scope.addRentShowData.fukuanType=data;
					$scope.filterShowData($scope.fukuangtype,data,function(value){
						$scope.addRentSubData.PayType=value;
					})
				}
			});
			// 户型
			$.scrEvent3({
				data: [0,1,2,3,4,5,6,7,8,9],
				data2: [0,1,2,3,4,5,6,7,8,9],
				data3: [0,1,2,3,4,5,6,7,8,9],
				evEle: '.zf-fangxing',
				title: '选择户型',
				defValue: 1,
				defValue2: 1,
				defValue3: 1,
				eleName: '室',
				eleName2: '厅',
				eleName3: '卫',
				afterAction: function (data1, data2,data3) {
				  $('.zf-fangxing').val(data1 + '室' + data2 + '厅'+data3+'卫');
				  $scope.addRentSubData.RoomType=data1;
				  $scope.addRentSubData.HallType=data2;
				  $scope.addRentSubData.BathType=data3;
				  $scope.addRentShowData.fangXing=data1 + '室' + data2 + '厅'+data3+'卫';
				  
				}
			});
			//楼层
			var loucengarr=[]
			for(var i=0;i<99;i++){
				loucengarr.push(i)
			}
			$.scrEvent2({
				data: loucengarr,
				data2: loucengarr,
				evEle: '.zf-louceng',
				title: '选择楼层',
				defValue: 1,
				defValue2: 1,
				afterAction: function (data1, data2) {
				  $('.zf-louceng').val(data1 + '/' + data2);
				  $scope.addRentSubData.Floor=data1;
				  $scope.addRentSubData.TotalFloor=data2;
				  $scope.addRentShowData.louCeng=data1+'/'+data2
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
			  evEle: '.zf-leixing',         
			  title: '选择类型',           
			  defValue: '普通住宅',          
			  afterAction: function (data) { 
				$(".zf-leixing").val(data);
				$scope.addRentSubData.BuildType=data;
			  }
			});
	
			$scope.chaoxiang=resData.data.RentRoom.Orientation;
			$scope.chaoxiangarr=[]
			for(var i=0;i<$scope.chaoxiang.length;i++){
				$scope.chaoxiangarr.push($scope.chaoxiang[i].text)
			}	
			$.scrEvent({
				  data: $scope.chaoxiangarr, 
				  evEle: '.zf-chaoxiang',          
				  title: '选择朝向',           
				  defValue: '东',           
				afterAction: function (data) {
					$(".zf-chaoxiang").val(data);
					$scope.addRentSubData.Orientation=data;
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
				  evEle: '.zf-zhuangxiu',  
				  title: '选择装修',          
				  defValue: '毛坯',      
				  afterAction: function (data) { 
					$(".zf-zhuangxiu").val(data);
					$scope.addRentSubData.Fitment=data;
				  }
			});
			var zhuangxiu=resData.data.HouseStatus.Fitment;
			var zhuangxiuarr=[];
			for(var i=0;i<zhuangxiu.length;i++){
				zhuangxiuarr.push(zhuangxiu[i].text)
			}
			$.scrEvent({
				  data: zhuangxiuarr, 
				  evEle: '.zf-zhuangxiu',  
				  title: '选择装修',          
				  defValue: '毛坯',      
				  afterAction: function (data) { 
					$(".zf-zhuangxiu").val(data);
					$scope.addRentSubData.Fitment=data;
				  }
			});
			
			$scope.chuzujian=resData.data.RentRoom.Room;
			$scope.chuzujianarr=[];
			for(var i=0;i<$scope.chuzujian.length;i++){
				$scope.chuzujianarr.push($scope.chuzujian[i].text)
			}
			$.scrEvent({
				  data: $scope.chuzujianarr, 
				  evEle: '.zf-chuzujian',  
				  title: '选择出租间',          
				  defValue: '次卧',      
				  afterAction: function (data) { 
					$(".zf-chuzujian").val(data);
					$scope.addRentShowData.chuzujian=data;
					$scope.filterShowData($scope.chuzujian,data,function(value){
						$scope.addRentSubData.RentRoom=value;
					})
				  }
			});
			$scope.roomate=resData.data.RoomMate;
			$scope.roomatearr=[];
			for(var i=0;i<$scope.roomate.length;i++){
				$scope.roomatearr.push($scope.roomate[i].text)
			}
			$.scrEvent({
				  data: $scope.roomatearr, 
				  evEle: '.zf-roomate',  
				  title: '选择出租间要求',          
				  defValue: '男女不限',      
				  afterAction: function (data) { 
					$(".zf-roomate").val(data);
					$scope.addRentSubData.OwnerPsy=data;
				  }
			});
				
			if($stateParams.id>0){
				$http.get($Factory.NewHouseSource.detail.url,{params:{id:$stateParams.id}}).then(function(resData){
					
					// if($localStorage.addRentSubData&&$localStorage.addRentSubData.Id==resData.data.Id){
					if($addRentData.data && $addRentData.data.Id==resData.data.Id){
						// $scope.addRentShowData=$localStorage.addRentShowData;
						// $scope.addRentSubData=$localStorage.addRentSubData;
						$scope.addRentShowData = $addRentData.showData;
						$scope.addRentSubData = $addRentData.data;
						
					}else{
						$scope.addRentShowData={
							louCeng:resData.data.Floor+'/'+resData.data.TotalFloor,
							fangXing:resData.data.RoomType+'室'+resData.data.HallType+'厅'+resData.data.BathType+'卫',
							fukuanType:'',
							chuzujian:'',
						}
						$scope.filterChangeData($scope.fukuangtype,resData.data.PayYear,function(text){
							$scope.addRentShowData.fukuanType=text;
						})
						$scope.filterChangeData($scope.chuzujian,resData.data.RentRoom,function(text){
							$scope.addRentShowData.chuzujian=text;
						})
						$scope.addRentSubData=resData.data;
						$scope.addRentSubData.ExProp=JSON.parse($scope.addRentSubData.ExProp)
					}
				})
			}else{
				if($addRentData.data && !$addRentData.data.Id){
					$scope.addRentShowData = $addRentData.showData;
					$scope.addRentSubData = $addRentData.data;
				}else{
					$scope.addRentShowData={
						louCeng:'',
						fangXing:'',
						fukuanType:'',
						chuzujian:'',
					}
					$scope.addRentSubData={
						AccountId:0,
						Address:null,
						BathType:0,
						BuildType:null,
						City:appUtils.city.id,
						CommunityAddress:null,
						CommunityId:0,
						CommunityName:null,
						Commuport:null,
						Configure:null,
						CreateTime:null,
						Discription:null,
						ExProp:[
							{"text":"床","value":1,"isChecked":false},
							{"text":"电视","value":2,"isChecked":false},
							{"text":"空调","value":3,"isChecked":false},
							{"text":"冰箱","value":4,"isChecked":false},
							{"text":"洗衣机","value":5,"isChecked":false},
							{"text":"热水器","value":6,"isChecked":false},
							{"text":"宽带","value":7,"isChecked":false},
							{"text":"可做饭","value":8,"isChecked":false},
							{"text":"独立卫生间","value":9,"isChecked":false},
							{"text":"独立阳台","value":10,"isChecked":false},
							{"text":"衣柜","value":11,"isChecked":false},
							{"text":"沙发","value":12,"isChecked":false},
							{"text":"暖气","value":13,"isChecked":false}
						],
						Fitment:null,
						Floor:0,
						HallType:0,
						Id:0,
						IndoorImages:[],
						IndoorShowImages:[],
						IsShowPhone:false,
						Number:null,
						Orientation:null,
						OwnerPsy:null,
						PayType:1,
						Price:null,
						ProxyStatus:0,
						Recommend:false,
						RentRoom:0,
						RentType:null,
						RoomType:0,
						ServiceIntro:null,
						Space:null,
						Special:null,
						Tags:null,
						Title:null,
						TotalFloor:0,
						Type:2,
						UserType:0,
						Year:0,
					}
				}
			}
		}).catch(function(){
			enterViewLoad.customload('获取失败')
		})
	}


	
	//点击叉号去除
	$scope.remove=function(index){
		$scope.addRentSubData.IndoorImages.splice(index,1)
		$scope.addRentSubData.IndoorShowImages.splice(index,1);
	}
	

	// 图片图库获取
	$scope.photoChoose = function(){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
					path:'18/rentHouseSource',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addRentSubData.IndoorImages.push(resData.data.url)
					$scope.addRentSubData.IndoorShowImages.push(resData.data.view);
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
				path:'18/rentHouseSource',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addRentSubData.IndoorImages.push(resData.data.url)
					$scope.addRentSubData.IndoorShowImages.push(resData.data.view);
				}
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}


	// sort 图片
	Sortable.create(document.getElementById('addrent_sortindoor_img'), {
        group: {
            name:"rentwords",
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
				var waitImgItem=$scope.addRentSubData.IndoorImages[evt.oldIndex]
				var waitShowImgItem=$scope.addRentSubData.IndoorShowImages[evt.oldIndex]
				$scope.addRentSubData.IndoorImages.splice(evt.oldIndex,1)
				$scope.addRentSubData.IndoorShowImages.splice(evt.oldIndex,1);
				// 新增
				$scope.addRentSubData.IndoorImages.splice(evt.newIndex,0,waitImgItem)
				$scope.addRentSubData.IndoorShowImages.splice(evt.newIndex,0,waitShowImgItem);
			})
		}
    });
	
	
		
	$ionicModal.fromTemplateUrl('rentGoLogin-modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
		});
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
// 预览
	$ionicModal.fromTemplateUrl('add_rent_preview_modal', {
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
		if($scope.addRentSubData.IndoorImages.length<3){
			enterViewLoad.customload('至少三张室内图');	
			return
		}else if($scope.addRentSubData.IndoorImages.length>10){
			enterViewLoad.customload('最多十张室内图');	
			return
		}else{}
		if(!$scope.addRentSubData.Title){
			enterViewLoad.customload('请输入标题')	
			return
		}
		if(!$scope.addRentSubData.CommunityName){
			enterViewLoad.customload('请选择小区')	
			return
		}
		if(!$scope.addRentSubData.Space){
			enterViewLoad.customload('请输入面积')		
			return
		}
		if(!$scope.addRentSubData.Price){
			enterViewLoad.customload('请输入租金')		
			return
		}
		if(!$scope.addRentSubData.RoomType && !$scope.addRentSubData.HallType && !$scope.addRentSubData.BathType){
			enterViewLoad.customload('请选择户型')		
			return
		}
		
		if($scope.attach==4){
			$scope.addRentSubData.RentType="合租"
		}else if(!$scope.attach){
			$scope.addRentSubData.RentType="整租"
		}
		
		var realSubData= JSON.parse(JSON.stringify($scope.addRentSubData)) 
		realSubData.ExProp= JSON.stringify(realSubData.ExProp)
		
		$http.post($Factory.NewHouseSource.save.url,realSubData).then(function(resData){
				$scope.deleteSubData=true;
				$addRentData.scrollTo = 0;

				if($stateParams.id>0){
					enterViewLoad.customload('修改成功');
				}else{enterViewLoad.customload('新增成功');}
				$timeout(function(){
					$state.go('myHouses',{type:2})
				},1500)
		}).catch(function(res){
			// $scope.addRentSubData.ExProp=JSON.parse($scope.addRentSubData.ExProp);
			if(res.status==400){
				$scope.modalType='realname';
				$scope.modal.show();
			}
			else if(res.status==401){
				$scope.modalType='login';
				$scope.modal.show();
			}
			else if(res.status==500){
				enterViewLoad.customload('服务器错误');
			}
		})
		
	}
		
	$scope.$on('$ionicView.beforeLeave',function(event,data){
		if(!$scope.deleteSubData){
			// $localStorage.addRentSubData=$scope.addRentSubData;
			// $localStorage.addRentShowData=$scope.addRentShowData;		
			$addRentData.data = $scope.addRentSubData;
			$addRentData.showData = $scope.addRentShowData;		
		}else{
			// delete $localStorage.addRentSubData;
			// delete $localStorage.addRentShowData;
			$addRentData.data = null;
			$addRentData.showData = null
		}

	})  				
})
.factory('$addRentData', [function () {
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
