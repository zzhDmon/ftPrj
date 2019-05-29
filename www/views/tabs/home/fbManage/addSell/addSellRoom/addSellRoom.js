
angular.module('App').controller('addSellRoomCtl',function($addSellData,appUtils,$localStorage,$rootScope,$scope,$stateParams,$ionicPopover,$timeout,$ionicHistory){
	$scope.back=function(){
		appUtils.back();	
	}
	$scope.name = $stateParams.name;
	

	$scope.$on('$ionicView.beforeEnter',function(event,data){
		$timeout(function(){
			$scope.addSellSubData=$addSellData.data;
			$scope.addSellShowData=$addSellData.data;

			$scope.dataOne=''
			$scope.dataTwo=''
			$.scrEvent4({
				data: [0,1,2,3,4,5,6,7,8,9],
				data2: [0,1,2,3,4,5,6,7,8,9],
				data3: [0,1,2,3,4,5,6,7,8,9],
				data4: ['栋','弄','座','号','号楼','胡同'],
				evEle: '.choose-unit',
				title: '选择楼号',
				defValue: 1,
				defValue2: 1,
				defValue3: 1,
				defValue4: '栋',
				eleName: '',
				eleName2: '',
				eleName3: '',
				eleName4: '',
				afterAction: function (data1, data2,data3,data4){
					$('.choose-unit').val(data1+data2+data3+data4);
					$scope.dataOne=data1+data2+data3+data4
					$scope.addSellSubData.ExProp.HouseNum1=data1+data2+data3;
					switch(data4){
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit1=1;
							break;
						case '弄':
							$scope.addSellSubData.ExProp.HouseUnit1=2;
							break;
						case '座':
							$scope.addSellSubData.ExProp.HouseUnit1=3;
							break;
						case '号':
							$scope.addSellSubData.ExProp.HouseUnit1=4;
							break;
						case '号楼':
							$scope.addSellSubData.ExProp.HouseUnit1=5;
							break;
						case '胡同':
							$scope.addSellSubData.ExProp.HouseUnit1=6;
							break;
						default:
							$scope.addSellSubData.ExProp.HouseUnit1=null;
							break;
					}
				}
			});
			$.scrEvent4({
				data: [0,1,2,3,4,5,6,7,8,9],
				data2: [0,1,2,3,4,5,6,7,8,9],
				data3: [0,1,2,3,4,5,6,7,8,9],
				data4: ['栋','幢','号','号楼','单元'],
				evEle: '.choose-room',
				title: '选择单元',
				defValue: 1,
				defValue2: 1,
				defValue3: 1,
				defValue4: '号楼',
				eleName: '',
				eleName2: '',
				eleName3: '',
				eleName4: '',
				afterAction: function (data1, data2,data3,data4){
					$('.choose-room').val(data1+ data2 +data3+data4);
					$scope.dataTwo=data1+ data2 +data3+data4;
					$scope.addSellSubData.ExProp.HouseNum2=data1+data2+data3;
					switch(data4){
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit2=1;
							break;
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit2=2;
							break;
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit2=3;
							break;
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit2=4;
							break;
						case '栋':
							$scope.addSellSubData.ExProp.HouseUnit2=5;
							break;
						default:
							$scope.addSellSubData.ExProp.HouseUnit2=null;
							break;
					}
				}
			});
			
			
			
			
			$scope.save=function(){
				if($scope.addSellSubData.ExProp.HouseNum3){
					$scope.dataThree=$scope.addSellSubData.ExProp.HouseNum3+'室'
				}
				$scope.addSellShowData.huShiHao=$scope.dataOne+$scope.dataTwo+$scope.dataThree
				
				$addSellData.data=$scope.addSellSubData
				$addSellData.showData=$scope.addSellShowData;

				$scope.back();	
			}
		})

		
	})
})
