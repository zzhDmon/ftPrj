
angular.module('App').controller('mySafeCtl',function(appUtils,$rootScope,$ionicModal,$ionicLoading,$ionicHistory,$timeout,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
	}

    $scope.data={
        topicContentList:[1,22,34]
    }
    $timeout(function(){
        $scope.data.topicContentList.push(333)
    },3000)

    Sortable.create(document.getElementById('items'), {
        group: {
            name:"words",
            pull: 'clone',
            put: true 
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
            console.log('onEnd.foo:',evt.oldIndex,evt.newIndex, [evt.item, evt.from]); 
        }
    });
  

    // $scope.chooseImage=function(){
    //     window.imagePicker.getPictures(
    //         function(results) {
    //             alert('urlArr'+JSON.stringify(results))
    //             upImgBase.changeBase(results[0],function(base){
    //                 alert('base'+base)
    //                 var req={
    //                     method: 'POST',
    //                     url: $Factory.Account.upload.url,
    //                     headers: {
    //                       'Content-Type': 'application/json'					
    //                     },
    //                    data:{path:'18/realHouse',file:base}				
    //                 }
    //                 $http(req).then(function(resData){
    //                     alert('上传成功'+JSON.stringify(resData))
    //                 })
    //             })
    //             for (var i = 0; i < results.length; i++){
    //                 console.log('Image URI: ' + results[i]);
    //             }
    //         }, function (error) {
    //             console.log('Error: ' + error);
    //         }
    //     );
    // }
	

   
  
  
})






