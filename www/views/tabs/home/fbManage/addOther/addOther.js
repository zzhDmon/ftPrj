
angular.module('App').controller('addOtherCtl',function(enterViewLoad,$addOtherData,appUtils,$ionicScrollDelegate,$localStorage,$ionicModal,$ionicHistory,$timeout,$http,$Factory,$scope,$rootScope,$state,$stateParams,$ionicPopover){
	
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.headtitle = '新增';
	if($stateParams.id>0){
		$scope.headtitle = '修改';		
	}
	$scope.pageType=$stateParams.type;
	$scope.behaviour=$stateParams.behaviour;
	
	// 软键盘弹出 页面滚动
	$scope.scrollTo=function(to){
		$ionicScrollDelegate.scrollTo(0, to || 0, false)
	}
	$scope.addOtherScrollListing=function(){
		$scope.currentTop = $ionicScrollDelegate.getScrollPosition().top;
		$addOtherData.scrollTo = $scope.currentTop;
	}
	window.addEventListener('native.keyboardshow',function(e){
		$scope.scrollTo($scope.currentTop)
	})

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
		$scope.scrollTo($addOtherData.scrollTo)
	})
	$scope.initData = function(){
		$http.get('jsonData/addOther/subOfficeData.json').then(function(resData){		
			// 楼层类型
			$scope.loucengtype=resData.data.Floor;
			$scope.loucengtypearr=[]
			for(var i=0;i<$scope.loucengtype.length;i++){
				$scope.loucengtypearr.push($scope.loucengtype[i].text)
			}	
			$.scrEvent({
				  data: $scope.loucengtypearr,  
				  evEle: '.other-loucengtype',       
				  title: '请选择楼层类型',         
				  defValue: '低层',          
				afterAction: function (data) { 
					$(".other-loucengtype").val(data);
					$scope.addOtherShowData.loucengType=data;
					$scope.filterShowData($scope.loucengtype,data,function(value){
						$scope.addOtherSubData.FloorType=value;
					})
				}
			});
	
			$.scrEvent({
				data: ['不代理','可被代理','可探讨代理'],  
				evEle: '.other-proxtype',       
				title: '选择代理状态',         
				defValue: '不代理',          
			  afterAction: function (data) { 
				  $(".other-proxtype").val(data);
				  $scope.addOtherShowData.proxType=data;
				  switch(data){
					  case '不代理':
						  $scope.addOtherSubData.ProxType=0;
						  break;	
					  case '可被代理':
						  $scope.addOtherSubData.ProxType=1;
						  break;	
					  case '可探讨代理':
						  $scope.addOtherSubData.ProxType=2;
						  break;
					  default:
						  $scope.addOtherSubData.ProxType=0;
						  break;	
					}
				}
			});
	
			$.scrEvent({
				data: ['个人房源','房东委托'],   
				evEle: '.other-usertype',         
				title: '房源类型',         
				defValue: '个人房源',             
				  afterAction: function (data) {  
					$(".other-usertype").val(data);
					$scope.addOtherShowData.userType=data;
					switch(data){
						case '个人房源':
							$scope.addOtherSubData.UserType=2;
							break;
						case '房东委托':
							$scope.addOtherSubData.UserType=3;
							break;
						default:
							$scope.addOtherShowData.UserType=null;
							break;
					  }
				  }
			  });
			
			  
			
			// 页面显示
			if($stateParams.id>0){
				$http.get($Factory.SimpleHouse.getdetail.url,({params:{id:$stateParams.id,isShop:false}})).then(function(resData){
					if($addOtherData.data && $addOtherData.data.Id==resData.data.Id){
						$scope.addOtherSubData = $addOtherData.data;
						$scope.addOtherShowData = $addOtherData.showData;
					}else{
						$scope.addOtherShowData={
							loucengType:'',
							proxType:'',
						}
						switch(resData.data.ProxyStatus){
							case 0:
								$scope.addOtherShowData.proxType='不代理'
								break;
							case 1:
								$scope.addOtherShowData.proxType='可被代理'
								break;
							case 2:
								$scope.addOtherShowData.proxType='可探讨代理'
								break;
							default:
								break;
						}
						if(resData.data.Exprop){
							$scope.filterChangeData($scope.loucengtype,resData.data.Exprop.RightType,function(text){
								$scope.addOtherShowData.loucengType=text;
							})
						}
						$scope.addOtherSubData=resData.data;
					}
				})
			}else{
				if($addOtherData.data && !$addOtherData.data.Id){
					$scope.addOtherSubData = $addOtherData.data;
					$scope.addOtherShowData = $addOtherData.showData;
				}else{
					$scope.addOtherShowData={
						userType:'',
						loucengType:'',
						proxType:'',
					}
					$scope.addOtherSubData={
						AccountId:0,
						Address:null,
						AuthStatus:0,
						Behaviour:1,
						City:appUtils.city.id,
						CommunityId:null,
						CommunityName:null,
						Discription:null,
						District:null,
						FloorType:0,
						HouseRate:0,
						HouseType:2,
						Id:0,
						IndoorImages:[],
						IndoorShowImages:[],
						Price:null,
						Space:null,
						Street:null,
						Tags:[],
						Title:null,
						UserType:2
					}
				}	
				$scope.addOtherSubData.HouseType = $scope.pageType
			}
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
			$http.post( $Factory.Account.upload.url,{
					path:'18/otherHouseSource',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addOtherSubData.IndoorImages.push(resData.data.url)
					$scope.addOtherSubData.IndoorShowImages.push(resData.data.view);
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
					$scope.addOtherSubData.IndoorImages.push(resData.data.url)
					$scope.addOtherSubData.IndoorShowImages.push(resData.data.view);
				}
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}

	//点击叉号去除
	$scope.remove=function(index){
		$scope.addOtherSubData.IndoorImages.splice(index,1)
		$scope.addOtherSubData.IndoorShowImages.splice(index,1);
	}
	// sort 图片
	Sortable.create(document.getElementById('addOther_sortindoor_img'), {
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
				var waitImgItem=$scope.addOtherSubData.IndoorImages[evt.oldIndex]
				var waitShowImgItem=$scope.addOtherSubData.IndoorShowImages[evt.oldIndex]
				$scope.addOtherSubData.IndoorImages.splice(evt.oldIndex,1)
				$scope.addOtherSubData.IndoorShowImages.splice(evt.oldIndex,1);
				// 新增
				$scope.addOtherSubData.IndoorImages.splice(evt.newIndex,0,waitImgItem)
				$scope.addOtherSubData.IndoorShowImages.splice(evt.newIndex,0,waitShowImgItem);
			})
		}
    });
		
    
	$ionicModal.fromTemplateUrl('other_GoLogin-modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
		});
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
// 预览
	$ionicModal.fromTemplateUrl('add_other_preview_modal', {
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
		if(!$scope.addOtherSubData.Title){
			enterViewLoad.customload('请输入标题')	
			return
		}
		if(!$scope.addOtherSubData.Space){
			enterViewLoad.customload('请输入面积')	
			return
		}
		if(!$scope.addOtherSubData.Price){
			enterViewLoad.customload('请输入价格')	
			return
		}

		if($scope.addOtherSubData.IndoorImages.length<3){
			enterViewLoad.customload('至少三张室内图');	
			return
		}else if($scope.addOtherSubData.IndoorImages.length>10){
			enterViewLoad.customload('最多十张室内图');	
			return
		}else{}

		var realSubData = JSON.parse(JSON.stringify($scope.addOtherSubData))
		realSubData.Behaviour=$scope.behaviour;
		realSubData.HouseType=$scope.pageType;
		
		$http.post($Factory.SimpleHouse.save.url,realSubData).then(function(resData){
				$scope.deleteSubData=true;
				$addOtherData.scrollTo = 0;

				if($stateParams.id>0){
					enterViewLoad.customload('修改成功');
				}else{enterViewLoad.customload('新增成功');}
				
				$timeout(function(){
					$state.go('myHouses',{type:4})
				},1500)
		}).catch(function(res){
			if(res.status==400){
				$scope.modalType='realname';
				$scope.modal.show();
			}else if(res.status==401){
				$scope.modalType='login';
				$scope.modal.show();
			}else{
				enterViewLoad.customload('发布房源失败');
			}
		})								
	}	
  	   
	$scope.$on('$ionicView.beforeLeave',function(event,data){
		if(!$scope.deleteSubData){
			if($scope.addOtherSubData){		
				$addOtherData.data = $scope.addOtherSubData;		
				$addOtherData.showData = $scope.addOtherShowData;		
			}
		}else{
			$addOtherData.data = null
			$addOtherData.showData = null
		}
	})    	   
})
.factory('$addOtherData', [function () {
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
