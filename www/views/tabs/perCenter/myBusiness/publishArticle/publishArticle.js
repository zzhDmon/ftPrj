
angular.module('App').controller('publishArticleCtl',function(appUtils,enterViewLoad,upImgBase,$ionicModal,$timeout,$rootScope,$scope,$stateParams,$http,$Factory){
	$scope.back=function(){
		appUtils.back();
    }
    
    var toolbarOptions = [
        [{ 'header':'1'}],
        [{ 'align':''},{ 'align':'center'},{ 'align':'right'}],
        ['bold','underline'],
        ['image']]
    $scope.editor = new Quill('#article_editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow'
    });
    // 列表显示信息
    $scope.showInList={
        title:'',
        imgs:[]
    }
  

    $scope.removeImg=function(index){
        $scope.showInList.imgs.splice(index,1)
    }
    $scope.addTitImg=function(){
        var args = {
            'selectMode': 100, //101=picker image and video , 100=image , 102=video
            'maxSelectCount': 3, //default 40 (Optional)
            'maxSelectSize': 188743680, //188743680=180M (Optional)
        };
        appUtils.photoLiberary(args,function(base,orientation){
            $http.post( $Factory.Account.upload.url,{
                path:'18/articles/titleimg',
                file:base,
                orientation:orientation
            }).then(function(resData){
                if(resData.data.error==0){
                    // 上传成功 添加
                    var imgData=resData.data.view
                    if($scope.showInList.imgs.length<3){
                        $scope.showInList.imgs.push(imgData)
                    }else{
                        $scope.showInList.imgs.splice(0,1);
                        $scope.showInList.imgs.push(imgData);
                    }
                }
            }).catch(function(){
                enterViewLoad.customload('图片上传失败')
            })
        },function(err){
            enterViewLoad.customload('选择图片失败')
        })
    }
    
    // 处理事件在初始化之后 进行添加图片上传
    var toolbar = $scope.editor.getModule('toolbar');
    toolbar.addHandler('image', function(val){
        $scope.insertImg()
    });
    $(".ql-toolbar , .ql-editor").addClass("no-fastclick");

	

   
    $scope.insertImg=function(){
        // 获取光标所在位置
        var cur_length = $scope.editor.getSelection().index;
       
        var args = {
            'selectMode': 100, //101=picker image and video , 100=image , 102=video
            'maxSelectCount': 1, //default 40 (Optional)
            'maxSelectSize': 188743680, //188743680=180M (Optional)
        };
        appUtils.photoLiberary(args,function(base,orientation){
            $http.post( $Factory.Account.upload.url,{
                path:'18/articles',
                file:base,
                orientation:orientation
            }).then(function(resData){
                if(resData.data.error==0){
                    // 上传成功 添加
                    var imgData=resData.data.view
                    // 插入图片 res.url为服务器返回的图片地址
                    $scope.editor.insertEmbed(cur_length, 'image', imgData);
                    // 调整光标到最后
                    $scope.editor.setSelection(cur_length + 1)
                }
            }).catch(function(){
                enterViewLoad.customload('图片上传失败')
            })
        },function(err){
            enterViewLoad.customload('选择图片失败')
        })
       
    }
    
    $scope.keyboardHeight=null
    window.addEventListener('native.keyboardshow',function(e){
        $timeout(function(){
            if(!$scope.keyboardHeight || ($scope.keyboardHeight!=e.keyboardHeight)){
                $scope.keyboardHeight=e.keyboardHeight
            } 
            var padBtn=$scope.keyboardHeight+10
            document.getElementsByClassName('ql-editor')[0].style.paddingBottom=padBtn + 'px'  
        })
    }) 
    window.addEventListener('native.keyboardhide',function(e){
        document.getElementsByClassName('ql-editor')[0].style.paddingBottom='10px'
    })

    $ionicModal.fromTemplateUrl('publish_article_title_modal', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.Modal = modal;
    });
    $scope.showModal=function(){
        if($scope.editor.container.firstChild.innerHTML.length<12){
            enterViewLoad.customload('请编写文章内容',2000);
            return
        }
        $scope.Modal.show();	
    }
    $scope.closeModal=function(){
        $scope.Modal.hide();
    }
    
    
	$scope.save=function(){  
        if(!$scope.showInList.title){
            enterViewLoad.customload('请输入文章标题')
            return
        }
        var realSubData={
			Content:$scope.editor.container.firstChild.innerHTML,
            ShowInList:JSON.stringify($scope.showInList),
            Type:40
		}
		$http.post($Factory.Zone.save.url,realSubData)
			.then(function(resData){
                enterViewLoad.customload('发布成功')
                $scope.closeModal()
                $scope.editor.container.firstChild.innerHTML='';
                $scope.showInList.title=''
                $scope.showInList.imgs=[]
                  
				$timeout(function(){
					$scope.back()
				},1500)
			}).catch(function(){
				enterViewLoad.customload('发布失败')
			})  
    }
})

