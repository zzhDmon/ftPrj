(function($){
    //如果有元素移除
    $('.sel-boxs').remove();
    $('body').append('<style>'+
                '.sel-boxs{display:none;}'+
                '.sel-boxs .bg{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:998;}'+
                '.sel-box{position:fixed;bottom:0;left:0;right:0;z-index:999;}'+
                '.sel-box .btn{background:white;overflow:hidden;}'+
                '.sel-box .btn1{overflow:hidden;width:70px;height:50px;float:left;padding:11px 12px;text-align:center;}'+
                '.sel-box .btn1 img{float:left;width:100%;height:100%;}'+
                '.sel-box .ok{float:right;color:rgb(255,210,2);}'+
                '.sel-box .cancel{color:gray;}'+
                '.sel-box .name{color:rgb(0,0,0);text-align:center;line-height:22px;font-size:18px;padding:11px 0;}'+
                '.sel-con{background:white;}'+
                '.sel-con .border{height:34px;border:solid 1px gainsboro;border-width:1px 0;position:fixed;bottom:72px;left:0;right:0;pointer-events:none;}'+
                '.sel-con .table{display:table;width:100%;table-layout:fixed;}'+
                '.sel-con .cell{display:table-cell;vertical-align:middle;text-align:center;overflow:hidden;}'+
                '.sel-con .scroll{-webkit-overflow-scrolling:touch;height:180px;overflow:auto;box-sizing:border-box;padding:72px 0;width:200%;padding-right:100%;}'+
                '.sel-con .ele{font-size:16px;color:#b2b2b2;height:36px;line-height:36px;}'+
                '@-webkit-keyframes fadeInUp {from {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);}to {opacity: 1;-webkit-transform: none;transform: none;}}'+
                '@keyframes fadeInUp {from {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);} to {opacity: 1;-webkit-transform: none;transform: none;}}'+
                '.fadeInUp {-webkit-animation-name: fadeInUp;animation-name: fadeInUp;}'+
                '@-webkit-keyframes fadeInDown {from {opacity: 1;-webkit-transform: none;transform: none;}to {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);}}'+
                '@keyframes fadeInDown {from {opacity: 1;-webkit-transform: none;transform: none;}to {opacity: 0;-webkit-transform: translate3d(0, 100%, 0);transform: translate3d(0, 100%, 0);}}'+
                '.fadeInDown {-webkit-animation-name: fadeInDown;animation-name: fadeInDown;}'+
                '.animated {-webkit-animation-duration: .4s;animation-duration: .4s;-webkit-animation-fill-mode: both;animation-fill-mode: both;}'+
                '</style>'+
                '<div class="sel-boxs">'+
                '   <div class="bg"></div>'+
                '   <div class="sel-box animated fadeInUp">'+
                '       <div class="btn">'+
                '           <div class="btn1 ok">确定</div>'+
                '           <div class="btn1 cancel">取消</div>'+
                '           <div class="name">加载中...</div>'+
                '       </div>'+
                '       <div class="sel-con">'+
                '           <div class="border"></div>'+
                '           <div class="table"></div>'+
                '       </div>'+
                '   </div>'+
                '</div>');

    // 取消选择
    $('.sel-box .cancel,.sel-boxs .bg').click(function(){
    
        $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
        $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
        $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
        setTimeout(function(){
          $('.sel-boxs').hide();
        },300);
    });

    //取消ios在zepto下的穿透事件
    $(".sel-con").on("touchend", function (event) {
        event.preventDefault();
    });

    //取消默认行为   灰层底部不能滑动
    var preDef = function(e){
        e.preventDefault();
        return false;
    };

    function dataFrame(ele){
        // ele数组转换成相应结构
        var eleText = '';
        for(var i=0;i<ele.length;i++){
            eleText += '<div class="ele">'+ele[i]+'</div>';
        };
        return '<div class="cell elem"><div class="scroll">'+eleText+'</div></div>';
    };
    // 封装说明：
    // 基于jQuery
    // 适合场景，只适用于单个值的选取模式
    $.scrEvent = function(params){
        var dataArr = params.data || [];
        var evEle = params.evEle;
        var title = params.title || '';
        var defValue = params.defValue || dataArr[0]; //首次默认值
        var type = params.type || 'click'; //事件类型
        var beforeAction = params.beforeAction || function(){};//执行前的动作  无参数 
        var afterAction = params.afterAction || function (data){};//执行后的动作   参数：选择的文字

        $(evEle).attr('readonly','readonly');
        // 点击对应input执行事件
        $(evEle).on(type, function (){

            //由于IOS点击(tap)其他区域 input也不失去焦点的特性
            $('input, textarea').each(function(){
                this.blur();
            });
           
            $('.sel-boxs .bg')[0].addEventListener('touchmove', preDef, false);
            $('.sel-boxs .btn')[0].addEventListener('touchmove', preDef, false);

            beforeAction();
            $('.sel-con .table').html(dataFrame(dataArr));
            $('.sel-box .name').text(title);
            $('.sel-boxs').show().find('.sel-box').removeClass('fadeInDown').addClass('fadeInUp');
            // 默认值
            $(evEle).val() == "" ? defValue = defValue : defValue = $(evEle).attr('data-sel01');

            $('.sel-con').find('.elem').eq(0).find('.ele').each(function(){
                if($(this).text() == defValue){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 选择器滚动获取值和确认赋值
            var scText = defValue; // 默认值为默认值
            $('.sel-con .scroll').scroll(function(){
                var that = $(this);
                // 数值显示
                var scTop = $(this)[0].scrollTop+18;
                var scNum = Math.floor(scTop/36);
				scText = $(this).find('.ele').eq(scNum).text();
				//选到字体变大
				$(this).find('.ele').eq(scNum).css({
					'color':'rgb(51,51,51)',
					'font-size':18
				})
				$(this).find('.ele').eq(scNum).siblings().css({
					'color':'rgb(102,102,102)',
					'font-size':16
				})
                // 停止锁定
                clearTimeout($(this).attr('timer'));
                $(this).attr('timer',setTimeout(function(){
                    that[0].scrollTop = scNum*36;
                },100));
            });

            //移除之前的绑定事件
            $(".sel-box .ok").off();
            // 确认选择
            $('.sel-box .ok').click(function(){
                $(evEle).attr('data-sel01', scText);
                afterAction(scText);
                $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
                setTimeout(function(){
                  $('.sel-boxs').hide();
                },300);
                
                $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
                $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
            });
        });
    };


    // 封装说明：
    // 基于jQuery
    // 适合场景，只适用于两个值的选取模式
    $.scrEvent2 = function(params){
        var ele = params.data || [];        //数据
        var ele2 = params.data2 || [];      //数据
        var evEle = params.evEle;           //触发选择器
        var selName = params.title || '';   //标题
        var defValue = params.defValue || ele[0]; //首次默认值
        var defValue2 = params.defValue2 || ele2[0];//首次默认值
        var type = params.type || 'click'; //事件类型
        var eleName = params.eleName || '';  //第一个值的单位
        var eleName2 = params.eleName2 || '';  //第二个值的单位
        var beforeAction = params.beforeAction || function(){}; //执行前的动作  无参数
        var afterAction = params.afterAction || function (){data, data2};//执行后的动作   参数1：选择的文字1； 参数2 选择的文字2 

        $(evEle).attr('readonly','readonly');
        eleName!=''?eleName = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName+'</div>':eleName = '';
        eleName2!=''?eleName2 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName2+'</div>':eleName2 = '';
        
        $(evEle).on(type, function (){
            //由于IOS点击(tap)其他区域 input也不失去焦点的特性
            $('input, textarea').each(function(){
                this.blur();
            });

            $('.sel-boxs .bg')[0].addEventListener('touchmove', preDef, false);
            $('.sel-boxs .btn')[0].addEventListener('touchmove', preDef, false);
            beforeAction();
            $('.sel-con .table').html(dataFrame(ele)+eleName+dataFrame(ele2)+eleName2);
            $('.sel-box .name').text(selName);
            $('.sel-boxs').show().find('.sel-box').removeClass('fadeInDown').addClass('fadeInUp');

            // 第一个值默认值
            $(evEle).val()==""?defValue = defValue:defValue= $(evEle).attr('data-sel01');
            // 第二个值默认值
            $(evEle).val()==""?defValue2 = defValue2:defValue2=$(evEle).attr('data-sel02');

            $('.sel-con').find('.elem').eq(0).find('.ele').each(function(){
                if($(this).text()==defValue){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第二个值默认值
            $('.sel-con').find('.elem').eq(1).find('.ele').each(function(){
                if($(this).text()==defValue2){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 选择器滚动获取值和确认赋值
            var scText = ele[0]; // 默认值为数组第一个值
            var scText2 = ele2[0]; // 默认值为数组第二个值
           
            $('.sel-con .scroll').scroll(function(){
                var that = $(this);
                // 数值显示
                var scTop = $(this)[0].scrollTop+18;
                var scNum = Math.floor(scTop/36);
                if($(this).parents('.elem').index()==0){
                    scText = $(this).find('.ele').eq(scNum).text();
					// 选到字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
					})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
					})
                }else{
                    scText2 = $(this).find('.ele').eq(scNum).text();
					// 选到字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
					})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
					})
				};
				
                // 停止锁定
                clearTimeout($(this).attr('timer'));
                $(this).attr('timer',setTimeout(function(){
                    that[0].scrollTop = scNum*36;
                },100));
            });

            //移除之前的绑定事件
            $(".sel-box .ok").off();
            // 确认选择
            $('.sel-box .ok').click(function(){
                $(evEle).attr('data-sel01', scText);
                $(evEle).attr('data-sel02', scText2);             
                afterAction(scText, scText2);

                $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
                setTimeout(function(){
                  $('.sel-boxs').hide();
                },300);
                
                $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
                $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
            });   
        });
    };
       // 封装说明：
    // 基于jQuery
    // 适合场景，只适用于两个值的选取模式（前后都可有单位）
    $.scrEventCus2 = function(params){
        var ele = params.data || [];        //数据
        var ele2 = params.data2 || [];      //数据
        var evEle = params.evEle;           //触发选择器
        var selName = params.title || '';   //标题
        var defValue = params.defValue || ele[0]; //首次默认值
        var defValue2 = params.defValue2 || ele2[0];//首次默认值
        var type = params.type || 'click'; //事件类型
        var eleName = params.eleName || '';  //第一个值的单位
        var eleName2 = params.eleName2 || '';  //第二个值的单位
        var eleNo = params.eleNo || '';  //第
        var eleTotal = params.eleTotal || '';  //共
        var beforeAction = params.beforeAction || function(){}; //执行前的动作  无参数
        var afterAction = params.afterAction || function (){data, data2};//执行后的动作   参数1：选择的文字1； 参数2 选择的文字2 

        $(evEle).attr('readonly','readonly');
        eleNo!=''?eleNo = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleNo+'</div>':eleNo = '';
        eleName!=''?eleName = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName+'</div>':eleName = '';
        eleTotal!=''?eleTotal = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleTotal+'</div>':eleTotal = '';
        eleName2!=''?eleName2 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName2+'</div>':eleName2 = '';
        
        $(evEle).on(type, function (){
            //由于IOS点击(tap)其他区域 input也不失去焦点的特性
            $('input, textarea').each(function(){
                this.blur();
            });

            $('.sel-boxs .bg')[0].addEventListener('touchmove', preDef, false);
            $('.sel-boxs .btn')[0].addEventListener('touchmove', preDef, false);
            beforeAction();
            $('.sel-con .table').html(eleNo+dataFrame(ele)+eleName+eleTotal+dataFrame(ele2)+eleName2);
            $('.sel-box .name').text(selName);
            $('.sel-boxs').show().find('.sel-box').removeClass('fadeInDown').addClass('fadeInUp');

            // 第一个值默认值
            $(evEle).val()==""?defValue = defValue:defValue= $(evEle).attr('data-sel01');
            // 第二个值默认值
            $(evEle).val()==""?defValue2 = defValue2:defValue2=$(evEle).attr('data-sel02');

            $('.sel-con').find('.elem').eq(0).find('.ele').each(function(){
                if($(this).text()==defValue){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第二个值默认值
            $('.sel-con').find('.elem').eq(1).find('.ele').each(function(){
                if($(this).text()==defValue2){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 选择器滚动获取值和确认赋值
            var scText1 = ele[0]; // 默认值为数组第一个值
            var scText2 = ele2[0]; // 默认值为数组第二个值
           
            $('.sel-con .scroll').scroll(function(){
                var that = $(this);
                // 数值显示
                var scTop = $(this)[0].scrollTop+18;
                var scNum = Math.floor(scTop/36);
                if($(this).parents('.elem').index()==1){
                    scText1 = $(this).find('.ele').eq(scNum).text();
					// 选到字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
					})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
					})
                }else{
                    scText2 = $(this).find('.ele').eq(scNum).text();
					// 选到字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
					})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
					})
				};
				
                // 停止锁定
                clearTimeout($(this).attr('timer'));
                $(this).attr('timer',setTimeout(function(){
                    that[0].scrollTop = scNum*36;
                },100));
            });
            // console.log(scText1)
            // console.log(scText2)
            //移除之前的绑定事件
            $(".sel-box .ok").off();
            // 确认选择
            $('.sel-box .ok').click(function(){
                $(evEle).attr('data-sel01', scText1);
                $(evEle).attr('data-sel02', scText2);   
                console.log(scText1, scText2)           
                afterAction(scText1, scText2);

                $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
                setTimeout(function(){
                    $('.sel-boxs').hide();
                },300);
                
                $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
                $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
            });   
        });
    };
    // 封装说明：
    // 基于jQuery
    // 适合场景，只适用于三个值的选取模式
    $.scrEvent3 = function(params){
        var ele = params.data || [];        //数据
        var ele2 = params.data2 || [];      //数据
        var ele3 = params.data3 || [];      //数据
        var evEle = params.evEle;           //触发选择器
        var selName = params.title || '';   //标题
        var defValue = params.defValue || ele[0]; //首次默认值
        var defValue2 = params.defValue2 || ele2[0];//首次默认值
        var defValue3 = params.defValue3 || ele3[0];//首次默认值
        var type = params.type || 'click'; //事件类型
        var eleName = params.eleName || '';  //第一个值的单位
        var eleName2 = params.eleName2 || '';  //第二个值的单位
        var eleName3 = params.eleName3 || '';  //第三个值的单位
        var beforeAction = params.beforeAction || function(){}; //执行前的动作  无参数
        var afterAction = params.afterAction || function (){data1,data2,data3};//执行后的动作   参数1：选择的文字1； 参数2 选择的文字2 

        $(evEle).attr('readonly','readonly');
        eleName!=''?eleName = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName+'</div>':eleName = '';
        eleName2!=''?eleName2 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName2+'</div>':eleName2 = '';
        eleName3!=''?eleName3 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName3+'</div>':eleName3 = '';
        
        $(evEle).on(type, function (){
            //由于IOS点击(tap)其他区域 input也不失去焦点的特性
            $('input, textarea').each(function(){
                this.blur();
            });

            $('.sel-boxs .bg')[0].addEventListener('touchmove', preDef, false);
            $('.sel-boxs .btn')[0].addEventListener('touchmove', preDef, false);
            beforeAction();
            $('.sel-con .table').html(dataFrame(ele)+eleName+dataFrame(ele2)+eleName2+dataFrame(ele3)+eleName3);
            $('.sel-box .name').text(selName);
            $('.sel-boxs').show().find('.sel-box').removeClass('fadeInDown').addClass('fadeInUp');

            // 第一个值默认值
            $(evEle).val()==""?defValue = defValue:defValue= $(evEle).attr('data-sel01');
            // 第二个值默认值
            $(evEle).val()==""?defValue2 = defValue2:defValue2=$(evEle).attr('data-sel02');
            // 第二个值默认值
            $(evEle).val()==""?defValue3 = defValue3:defValue3=$(evEle).attr('data-sel03');

            $('.sel-con').find('.elem').eq(0).find('.ele').each(function(){
                if($(this).text()==defValue){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第二个值默认值
            $('.sel-con').find('.elem').eq(1).find('.ele').each(function(){
                if($(this).text()==defValue2){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第三个值默认值
            $('.sel-con').find('.elem').eq(2).find('.ele').each(function(){
                if($(this).text()==defValue3){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 选择器滚动获取值和确认赋值
            var scText = ele[0]; // 默认值为数组第一个值
            var scText2 = ele2[0]; // 默认值为数组第二个值
            var scText3 = ele3[0]; // 默认值为数组第三个值
            $('.sel-con .scroll').scroll(function(){
                var that = $(this);
                // 数值显示
                var scTop = $(this)[0].scrollTop+18;
                var scNum = Math.floor(scTop/36);
                if($(this).parents('.elem').index()==0){
					scText = $(this).find('.ele').eq(scNum).text();
					// 字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
                }else if($(this).parents('.elem').index()==2){
					scText2 = $(this).find('.ele').eq(scNum).text();
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
                }else{
					scText3 = $(this).find('.ele').eq(scNum).text();
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
				};
				
                // 停止锁定
                clearTimeout($(this).attr('timer'));
                $(this).attr('timer',setTimeout(function(){
                    that[0].scrollTop = scNum*36;
                },100));
            });

            //移除之前的绑定事件
            $(".sel-box .ok").off();
            // 确认选择
            $('.sel-box .ok').click(function(){
                $(evEle).attr('data-sel01', scText);
                $(evEle).attr('data-sel02', scText2);
                $(evEle).attr('data-sel03', scText3);
                afterAction(scText, scText2,scText3);

                $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
                setTimeout(function(){
                  $('.sel-boxs').hide();
                },300);
                
                $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
                $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
            });   
        });
    };

    $.scrEvent4 = function(params){

        var ele = params.data || [];        //数据
        var ele2 = params.data2 || [];      //数据
        var ele3 = params.data3 || [];      //数据
        var ele4 = params.data4 || [];      //数据
        var evEle = params.evEle;           //触发选择器
        var selName = params.title || '';   //标题
        var defValue = params.defValue || ele[0]; //首次默认值
        var defValue2 = params.defValue2 || ele2[0];//首次默认值
        var defValue3 = params.defValue3 || ele3[0];//首次默认值
        var defValue4 = params.defValue4 || ele4[0];//首次默认值
        var type = params.type || 'click'; //事件类型
        var eleName = params.eleName || '';  //第一个值的单位
        var eleName2 = params.eleName2 || '';  //第二个值的单位
        var eleName3 = params.eleName3 || '';  //第三个值的单位
        var eleName4 = params.eleName4 || '';  //第4个值的单位
        var beforeAction = params.beforeAction || function(){}; //执行前的动作  无参数
        var afterAction = params.afterAction || function (){data1,data2,data3};//执行后的动作   参数1：选择的文字1； 参数2 选择的文字2 

        $(evEle).attr('readonly','readonly');
        eleName!=''?eleName = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName+'</div>':eleName = '';
        eleName2!=''?eleName2 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName2+'</div>':eleName2 = '';
        eleName3!=''?eleName3 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName3+'</div>':eleName3 = '';
        eleName4!=''?eleName4 = '<div class="cell" style="font-size:14px;color:#b2b2b2;">'+eleName4+'</div>':eleName4 = '';
        
        $(evEle).on(type, function (){

            //由于IOS点击(tap)其他区域 input也不失去焦点的特性
            $('input, textarea').each(function(){
                this.blur();
            });

            $('.sel-boxs .bg')[0].addEventListener('touchmove', preDef, false);
            $('.sel-boxs .btn')[0].addEventListener('touchmove', preDef, false);
            beforeAction();
            $('.sel-con .table').html(dataFrame(ele)+eleName+dataFrame(ele2)+eleName2+dataFrame(ele3)+eleName3+dataFrame(ele4)+eleName4);
            $('.sel-box .name').text(selName);
            $('.sel-boxs').show().find('.sel-box').removeClass('fadeInDown').addClass('fadeInUp');

            // 第一个值默认值
            $(evEle).val()==""?defValue = defValue:defValue= $(evEle).attr('data-sel01');
            // 第二个值默认值
            $(evEle).val()==""?defValue2 = defValue2:defValue2=$(evEle).attr('data-sel02');
            // 第三个值默认值
            $(evEle).val()==""?defValue3 = defValue3:defValue3=$(evEle).attr('data-sel03');
            // 第四个值默认值
            $(evEle).val()==""?defValue4 = defValue4:defValue4=$(evEle).attr('data-sel04');

            $('.sel-con').find('.elem').eq(0).find('.ele').each(function(){
                if($(this).text()==defValue){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第二个值默认值
            $('.sel-con').find('.elem').eq(1).find('.ele').each(function(){
                if($(this).text()==defValue2){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第三个值默认值
            $('.sel-con').find('.elem').eq(2).find('.ele').each(function(){
                if($(this).text()==defValue3){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 第四个值默认值
            $('.sel-con').find('.elem').eq(3).find('.ele').each(function(){
                if($(this).text()==defValue4){
                    $(this).parents('.scroll')[0].scrollTop = $(this).index()*36;
                }
            });
            // 选择器滚动获取值和确认赋值
            var scText = ele[0]; // 默认值为数组第一个值
            var scText2 = ele2[0]; // 默认值为数组第二个值
            var scText3 = ele3[0]; // 默认值为数组第三个值
            var scText4 = ele4[0]; // 默认值为数组第三个值
       
            $('.sel-con .scroll').scroll(function(){
                var that = $(this);
                // 数值显示
                var scTop = $(this)[0].scrollTop+18;
                var scNum = Math.floor(scTop/36);
                if($(this).parents('.elem').index()==0){
                    scText = $(this).find('.ele').eq(scNum).text();
					// 字体变大
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
                }else if($(this).parents('.elem').index()==1){
                    scText2 = $(this).find('.ele').eq(scNum).text();
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
                }else if($(this).parents('.elem').index()==2){
                    scText3 = $(this).find('.ele').eq(scNum).text();
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
				}else{
                    scText4 = $(this).find('.ele').eq(scNum).text();
					$(this).find('.ele').eq(scNum).css({
						'color':'rgb(51,51,51)',
						'font-size':18
						})
					$(this).find('.ele').eq(scNum).siblings().css({
						'color':'rgb(102,102,102)',
						'font-size':16
						})
                };
				
                // 停止锁定
                clearTimeout($(this).attr('timer'));
                $(this).attr('timer',setTimeout(function(){
                    that[0].scrollTop = scNum*36;
                },100));
            });

            //移除之前的绑定事件
            $(".sel-box .ok").off();
            // 确认选择
            $('.sel-box .ok').click(function(){
                $(evEle).attr('data-sel01', scText);
                $(evEle).attr('data-sel02', scText2);
                $(evEle).attr('data-sel03', scText3);
                $(evEle).attr('data-sel04', scText4);
                console.log(scText, scText2,scText3,scText4)
                afterAction(scText, scText2,scText3,scText4);

                $('.sel-boxs').find('.sel-box').removeClass('fadeInUp').addClass('fadeInDown');
                setTimeout(function(){
                  $('.sel-boxs').hide();
                },300);
                
                $('.sel-boxs .bg')[0].removeEventListener('touchmove', preDef, false);
                $('.sel-boxs .btn')[0].removeEventListener('touchmove', preDef, false);
            });   
        });
    };
    
})($);