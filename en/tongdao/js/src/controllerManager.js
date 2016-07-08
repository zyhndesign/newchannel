/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 逻辑处理曾，包括事件逻辑和应用逻辑
 */
var ZY=ZY||{};
ZY.controllerManager=(function(){

    var rect="";//clip的rect值
    var topH=$("#zy_top_post").height();
    var sectionOneBG=$("#zy_section_one_bg .zy_theme_bg_content");
    var sectionTwoBG=$("#zy_section_two_bg .zy_theme_bg_content");
    var sectionThreeBG=$("#zy_section_three_bg .zy_theme_bg_content");
    var sectionFourBG=$("#zy_section_four_bg .zy_theme_bg_content");


    var menu=$("#zy_nav");

    //进入页面时nav为非fixed状态，滚动到下面后变成fiexd，不占高度，所以要减去
    var sectionOneY=$("#zy_section_one").offset().top-80;
    var sectionTwoY=$("#zy_section_two").offset().top-80;
    var sectionThreeY=$("#zy_section_three").offset().top-80;
    var sectionFourY=$("#zy_section_four").offset().top-80;
    var footerY=$(".zy_footer").offset().top-80;

    /**
     * 设置页面的最大个数
     * @param categoryId
     * @param limit
     * @returns {*}
     */
    function setMaxLimit(categoryId,limit){
        if(categoryId==ZY.config.categoryIds.sectionOneId){
            if(limit>3){
                limit=3;
            }
        }else{
            if(limit>4){
                limit=4;
            }
        }

        return limit;
    }

    return {

        /**
         * 判断是否显示播放器,主要是判断鼠标所在对象是否在某一个对象内
         * @param {String} parent 容器对象元素id或者class
         * @param {Object} target 鼠标所在对象元素jquery对象
         */
        judgeShowOrNot:function(parent,target){
            if(target.parents(parent).length==0){
                ZY.uiManager.hideMusicPlayer();
            }
        },

        /**
         * 分解日期
         * @param {String} date 需要分解的日期字符串
         * @return {*} 返回数组代表解析成功或者是false代表解析错误
         */
        splitPostDate:function(date){
            if(typeof date=="string"){
                var dateArray=date.split("-");
                var newArray=[];
                newArray[0]=dateArray[2]+"/"+dateArray[1];
                newArray[1]=dateArray[0];
                return newArray;
            }
            return [];
        },

        /**
         * 重新组装文章数组,主要更改日期
         * @param {Array} datas 文章数组
         * @return {*}  返回重新组装后的文章数组
         */
        transformDatas:function(datas){
            var me=this;
            var array=[];
            $.each(datas,function(index,d){
                array=me.splitPostDate(d["post_date"]);
                d["post_month"]=array[0];
                d["post_year"]=array[1];
            });

            return datas;
        },

        /**
         * 计算每次需要请求的个数，根据页面能放置的个数
         * @param {Object} args 参数数组
         * @param {Object} args.targetContain 包括上一页和下一页按钮的容器元素jquery对象
         * @param {Number} args.width  没一个li的宽度
         * @param {Number} args.categoryId 分类id
         * @param {Boolean} args.isFirst   是否第一次请求
         * @return {Number}  limit 需要请求的个数
         */
        setLoadLimit:function(args){

            //能够容纳的个数
            var limit=parseInt($("body").width()/args.width);

            limit=setMaxLimit(args.categoryId,limit);

            //每次请求，都需要设置外围的宽度
            args.targetContain.find(".zy_post_list_container").width(limit*args.width);

            //首先隐藏下一页按钮，获取到数据后再显示
            args.targetContain.find(".zy_page_next").addClass("zy_disable");
            ZY.uiManager.showLoadingSpinner($(args.targetContain));

            //设置请求个数
            if(args.isFirst){

                //第一次请求要请求3页的数据
                if(args.categoryId==ZY.config.categoryIds.sectionThreeId){

                    //物语有一个大图，这个位置要计算出来
                    if($("body").width()>=ZY.config.articleWidths.sectionThreeWidth*2){

                        //当页面大于等于400的时候，会显示一个大图,每一个li一个两个小图
                        limit=parseInt(($("body").width()-ZY.config.articleWidths.sectionThreeWidth*2)/args.width)*2+limit*2*2+1;
                    }
                }else if(args.categoryId==ZY.config.categoryIds.sectionOneId){

                    //加载三页的数据，防止用户突然拉大屏幕，导致下一页数据不足=limit*3;
                    limit=limit*3*2;
                }else{
                    limit=limit*3;
                }
            }else{

                //如果不是第一次请求,最少加载两页数据，有可能用户突然拉大屏幕，导致下一页数据不足
                if(args.categoryId==ZY.config.categoryIds.sectionOneId||args.categoryId==ZY.config.categoryIds.sectionThreeId){

                    //每一个li里面两个小图
                    limit=limit*2*2;
                }else{
                    limit=limit*2;
                }
            }

            return limit;
        },

        /**
         * 请求完成后的处理事件
         * @param {Object} args 参数数组
         * @param {Object} args.targetContain 包括上一页和下一页按钮的容器元素jquery对象
         * @param {Array} args.posts   返回的文章对象数组
         * @param {Number} args.categoryId 分类id
         * @param {Boolean} args.isFirst   是否第一次请求
         * @param {Number} args.limit   请求的个数
         */
        doResponse:function(args){
            var length=args.posts.length;
            var nextBtn=args.targetContain.find(".zy_page_next");

            //设置背景
            /*if(length!=0){
             this.setBackGround(args.isFirst,args["posts"][0],args.categoryId);
             }*/


            //记录下最后一个的发布时间,插入数据
            if(length<=args.limit){

                //在数据不为0的情况下，记录下最有一个的时间
                if(length!=0){
                    this.handlerPosts(args.categoryId,args.posts,length,args.isFirst);
                }

                //加载完成后默认显示下一页按钮
                nextBtn.removeClass("zy_disable");

                //但如果是第一次加载，并且数量小于一页的数量，要设置按钮不可见
                if(args.categoryId==ZY.config.categoryIds.sectionThreeId){
                    if(args.isFirst&&(length<=(args.limit+1)/3-1)){
                        nextBtn.addClass("zy_disable");
                    }
                }else{
                    if(args.isFirst&&(length<=args.limit/3)){
                        nextBtn.addClass("zy_disable");
                    }
                }

                if(length<args.limit){

                    //如果返回的个数小于请求的个数，则要设置不能再加载的标志
                    nextBtn.addClass("zy_no_more");
                }

            }
        },

        /**
         * 根据分类设置背景，只有第一次请求才做此操作
         * @param {Boolean} isFirst 是否第一次请求
         * @param {Object} firstPost 第一篇文章对象
         * @param {Number} categoryId  分类id
         */
        setBackGround:function(isFirst,firstPost,categoryId){
            if(isFirst&&firstPost["post_id"]!=ZY.dataManager.topPostId){
                if(categoryId==ZY.config.categoryIds.sectionTwoId){
                    ZY.uiManager.updateSectionBg(firstPost,$("#zy_section_two_theme"));
                    sectionTwoBG=$("#zy_section_two_bg .zy_theme_bg_content");
                }else if(categoryId==ZY.config.categoryIds.sectionOneId){
                    ZY.uiManager.updateSectionBg(firstPost,$("#zy_section_one_theme"));
                    sectionOneBG=$("#zy_section_one_bg .zy_theme_bg_content");
                }else if(categoryId==ZY.config.categoryIds.sectionFourId){
                    ZY.uiManager.updateSectionBg(firstPost,$("#zy_section_four_theme"));
                    sectionFourBG=$("#zy_section_four_bg .zy_theme_bg_content");
                }else if(categoryId==ZY.config.categoryIds.sectionThreeId){
                    ZY.uiManager.updateSectionBg(firstPost,$("#zy_section_three_theme"));
                    sectionThreeBG=$("#zy_section_three_bg .zy_theme_bg_content");
                }
            }
        },

        /**
         * 按照分类处理显示，并且记录下最有一片文章的时间
         * @param {Number} categoryId 分类id
         * @param {Array} posts 文章对象数组
         * @param {Number} length 返回的数组的长度
         * @param {Boolean} isFirst 是否第一次请求
         */
        handlerPosts:function(categoryId,posts,length,isFirst){
            if(categoryId==ZY.config.categoryIds.sectionTwoId){
                ZY.dataManager.lastSectionTwoDate=posts[length-1]["post_full_date"];
                ZY.uiManager.showSectionTwoPosts(posts);
            }else if(categoryId==ZY.config.categoryIds.sectionOneId){
                ZY.dataManager.lastSectionOneDate=posts[length-1]["post_full_date"];
                ZY.uiManager.showSectionOnePosts(this.handlerSectionOnePosts(posts,length));
            }else if(categoryId==ZY.config.categoryIds.sectionFourId){
                ZY.dataManager.lastSectionFourDate=posts[length-1]["post_full_date"];
                ZY.uiManager.showSectionFourPosts(posts);
            }else if(categoryId==ZY.config.categoryIds.sectionThreeId){
                ZY.dataManager.lastSectionThreeDate=posts[length-1]["post_full_date"];
                ZY.uiManager.showSectionThreePosts(this.handlerSectionThreePosts(posts,length,isFirst),isFirst);
            }
        },

        /**
         * 对风景数据再加工，符合每个li显示两篇文章
         * @param {Array} posts 文章对象数组
         * @param {Number} length 返回的数组的长度
         */
        handlerSectionOnePosts:function(posts,length){
            var array=[];
            for(var i=0;i<length;i++){
                var post={};
                post.top=posts[i];

                var next=++i;
                post.bottom=posts[next];
                array.push(post);
            }

            return array;
        },

        /**
         * 对物语数据再加工，符合每个li显示两篇文章，并且第一个只有一个
         * @param {Array} posts 文章对象数组
         * @param {Number} length 返回的数组的长度
         * @param {Boolean} isFirst 是否第一次请求
         */
        handlerSectionThreePosts:function(posts,length,isFirst){
            var array=[];
            for(var i=0;i<length;i++){
                var post={};
                if(i==0&&isFirst){
                    post=posts[i];
                }else{
                    post.top=posts[i];

                    var next=++i;
                    post.bottom=posts[next];
                }
                array.push(post);
            }

            return array;

        },

        /**
         * 每个分类大section的hover事件，主要控制上一页，下一页按钮的显示
         * @param {Object} targetContain 容器元素的jquery对象
         */
        addHoverEvent:function(targetContain){
            var nextBtn=targetContain.find(".zy_page_next");
            var prevBtn=targetContain.find(".zy_page_prev");

            targetContain.hover(function(){
                prevBtn.css("opacity",1);
                nextBtn.css("opacity",1);
            },function(){
                prevBtn.css("opacity",0);
                nextBtn.css("opacity",0);
            });
        },

        /**
         * 下一页按钮事件,其中可能去加载数据（ajax）
         * @param {Object} targetContain 容器元素jquery对象
         * @param {Number} width 每个li的宽度
         * @param {Number} categoryId 分类id
         * @param {String} lastDate 已经请求了的最后一篇的时间
         */
        nextPage:function(targetContain,width,categoryId,lastDate){
            var limit=parseInt($("body").width()/width);
            limit=setMaxLimit(categoryId,limit);
            var nextBtn=targetContain.find("a.zy_page_next");
            var prevBtn=targetContain.find("a.zy_page_prev");
            var container=targetContain.find(".zy_post_list_container");
            var list=targetContain.find(".zy_post_list_container ul");


            container.width(limit*width);//设置list的外围容器宽度

            //分为数据加载完成或未完成
            if(nextBtn.hasClass("zy_no_more")){
                list.animate({"left":parseInt(list.css("left"))-limit*width},500,function(){

                    //显示前面一个按钮
                    prevBtn.removeClass("zy_disable");

                    if(categoryId==ZY.config.categoryIds.sectionThreeId){

                        //物语有一个大图是其他的两倍
                        if(parseInt(list.css("left"))<=-(list.find("li").length-limit+1)*width){

                            //如果left的值已经到了总数的前一页，说明当前显示的就是最后一页那么就让这个按钮disable。
                            nextBtn.addClass("zy_disable");
                        }
                    }else{
                        if(parseInt(list.css("left"))<=-(list.find("li").length-limit)*width){

                            //如果left的值已经到了总数的前一页，说明当前显示的就是最后一页那么就让这个按钮disable。
                            nextBtn.addClass("zy_disable");
                        }
                    }

                });
            }else{

                //加载数据，加载后再执行动画
                ZY.dataManager.getCategoryPosts({
                    targetContain:targetContain,
                    width:width,
                    categoryId:categoryId,
                    lastDate:lastDate,
                    isFirst:false
                });
                list.animate({"left":parseInt(list.css("left"))-limit*width},500,function(){

                    //去掉前面按钮的禁用标志
                    prevBtn.removeClass("zy_disable");
                });
            }
        },

        /**
         * 上一页按钮事件
         * @param {Object} targetContain 容器元素jquery对象
         * @param {Number} width 每个li的宽度
         * @param {Number} categoryId 分类id
         */
        prevPage:function(targetContain,width,categoryId){
            var limit=parseInt($("body").width()/width);
            limit=setMaxLimit(categoryId,limit);
            var nextBtn=targetContain.find("a.zy_page_next");
            var prevBtn=targetContain.find("a.zy_page_prev");
            var container=targetContain.find(".zy_post_list_container");
            var list=targetContain.find(".zy_post_list_container ul");


            container.width(limit*width); //设置list的外围容器宽度

            //如果在往前一页left大于0或者是等于0，都需要禁用前一页按钮
            if(parseInt(list.css("left"))+limit*width>=0){
                list.animate({"left":0},500,function(){

                    /*
                     还要判断是否是最后一页，有可能是窗口变小导致原来的一页变成两页，然后点击了下一页，此后变大窗口
                     这个时候如果数据只有恰好放大后的一页，那么这页是第一页也是最后一页（缩小情况下是两页），需要判断是否为最后一页来判断是否移除类
                     */
                    if(parseInt(list.css("left"))>-(list.find("li").length-limit)*width){

                        //去掉后面按钮的无加载标志
                        nextBtn.removeClass("zy_disable");
                    }
                    prevBtn.addClass("zy_disable");
                });
            }else{
                if(categoryId==ZY.config.categoryIds.sectionThreeId){

                    //如果是物语
                    if(parseInt(list.css("left"))+limit*width>-400){

                        //如果有大图(屏幕宽度大于400），并且快要被截断的情况下
                        list.animate({"left":-400},500,function(){
                            //去掉后面按钮的无加载标志
                            nextBtn.removeClass("zy_disable");

                        });

                        //将控制权交给页面
                        return;
                    }
                }

                //执行动画
                list.animate({"left":parseInt(list.css("left"))+limit*width},500,function(){

                    //去掉后面按钮的无加载标志
                    nextBtn.removeClass("zy_disable");

                    /*//如果移动完后，恰好left为0，那么前一页按钮要禁用,其实已经包含在前面的条件中
                     if(parseInt(list.css("left"))==0){
                     prevBtn.addClass("zy_disable");
                     }*/
                });

            }
        },

        /**
         * 横向滚轮事件
         * @param {Object} target 需要添加此事件的元素jquery对象
         */
        bindHScroll:function(target){
            var mousewheelEvt= document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
            var mousewheelHandler=function (evt) {
                var left=0;
                evt = window.event || evt;
                if(evt.wheelDelta <0 || evt.detail>0){
                    left=target.scrollLeft+500;
                }else{
                    left=target.scrollLeft-500;
                }
                TweenLite.to(target, 0.5, {scrollTo:{x:left}});

                //兼容ie
                if(evt.preventDefault){
                    evt.preventDefault();
                    evt.stopPropagation(); //如果调用了setWheelScrollSpeed，需要阻止冒泡到window
                }else{
                    evt.returnValue=false;
                    evt.cancelBubble = false;
                }
            };
            target.addEventListener(mousewheelEvt, mousewheelHandler);
        },


        /**
         * 设置window滚动速度为每次滚动100
         */
        setWheelScrollSpeed:function(){
            var mousewheelEvt= document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
            var mousewheelHandler=function (evt) {
                var top=$(window).scrollTop();
                evt = window.event || evt;
                if(evt.wheelDelta <0 || evt.detail>0){
                    $(window).scrollTop(top+100);
                }else{
                    $(window).scrollTop(top-100);
                }
                //TweenLite.killTweensOf(window);
                //TweenLite.to(window, 0.5, {scrollTo:{y:top}});

                //兼容ie
                if(evt.preventDefault){
                    evt.preventDefault();
                }else{
                    evt.returnValue=false;
                }
                //evt.preventDefault();
            };
            window.addEventListener(mousewheelEvt, mousewheelHandler);
        },

        /**
         * 页面上下滚动事件,主要是设置背景显示，菜单的高亮,请求数据
         */
        scrollingHandler:function(){
            var sy=window.pageYOffset;
            var winH=$(window).height();
            var winW=$(window).width();

            //console.log(sy+":"+sectionOneY+":"+winH);

            //菜单操作
            if(sy>=topH){
                if(!menu.hasClass("zy_nav_active")){
                    menu.addClass("zy_nav_active");
                }
            }else{
                if(menu.hasClass("zy_nav_active")){
                    menu.removeClass("zy_nav_active");
                }
            }

            //设置顶部菜单状态, 首先重置所有菜单,计算时要减去nav的80高
            $("#zy_nav ul li a").removeClass("active");
            if(sy<=sectionOneY){

            }else if(sy<=sectionTwoY){
                $("#zy_nav ul li:nth-child(1) a").addClass("active");
            }else if(sy<=sectionThreeY){
                $("#zy_nav ul li:nth-child(2) a").addClass("active");
            }else if(sy<=sectionFourY){
                $("#zy_nav ul li:nth-child(4) a").addClass("active");
            }else if(sy<=footerY){
                $("#zy_nav ul li:nth-child(5) a").addClass("active");
            }

            //设置背景状态
            /*
             * 背景动画说明:采用了img的clip属性，
             *在需要显示背景的区域往下滚动的时候让显示区域不断的变小
             * 在向上滚动的时候，让显示区域不断的变大
             * 变化以背景图片高度为基准，以滚动的top与模块的top差值为变量
             * 720-（sy-sectionOney)+100   720是背景图片高度，sy是滚动了的高度，sectionOneY是模块的top值,
             * 100是突然增大显示区域导致白色闪屏的处理，多100，那么增加时的闪动会在另外一层的下面，这样就不影响视觉
             * 那么向下滚动时sy不断增大，整体值是不断减小的，向上滚动时，sy不断减小，整体值不断增大
             * 在非改变区域的时候，去掉clip属性
             *注意：背景图的高度是根据宽度变化的，可能会大于720，最大为一屏幕高，
             *720-（sy-sectionOney)+100 可能大于一屏幕高，并不影响显示，因为当clip的显示高度大于实际高度时，只会显示成实际高度
             */
            if(sy>sectionOneY-winH && sy<=sectionOneY+720){
                if(!ZY.config.deviceCode.iOS){
                    sectionOneBG.addClass("zy_bg_fixed");

                    //滚动的时候使用clip
                    rect="rect(0px "+winW+"px "+(800-(sy-sectionOneY)+100)+"px 0px)";
                    sectionOneBG.css("clip",rect);
                }

                if(!ZY.dataManager.sectionOneLoaded){

                    //获取第1个分类(风景）文章
                    ZY.dataManager.getCategoryPosts({
                        width:ZY.config.articleWidths.sectionOneWidth,
                        categoryId:ZY.config.categoryIds.sectionOneId,
                        isFirst:true,
                        lastDate:ZY.dataManager.lastSectionOneDate,
                        targetContain:$("#zy_section_one_contain")
                    });
                    ZY.dataManager.sectionOneLoaded=true;
                }



            }else{
                if(!ZY.config.deviceCode.iOS){
                    sectionOneBG.removeClass("zy_bg_fixed");
                    sectionOneBG.css("clip","");
                }
            }

            if(sy>sectionTwoY-winH && sy<=sectionTwoY+720){
                if(!ZY.config.deviceCode.iOS){
                    sectionTwoBG.addClass("zy_bg_fixed");

                    //滚动的时候使用clip
                    rect="rect(0px "+winW+"px "+(800-(sy-sectionTwoY)+100)+"px 0px)";
                    sectionTwoBG.css("clip",rect);
                }

                if(!ZY.dataManager.sectionTwoLoaded){

                    //获取第2个分类（人文）文章
                    ZY.dataManager.getCategoryPosts({
                        width:ZY.config.articleWidths.sectionTwoWidth,
                        categoryId:ZY.config.categoryIds.sectionTwoId,
                        isFirst:true,
                        lastDate:ZY.dataManager.lastSectionTwoDate,
                        targetContain:$("#zy_section_two_contain")
                    });
                    ZY.dataManager.sectionTwoLoaded=true;
                }
            }else{
                if(!ZY.config.deviceCode.iOS){
                    sectionTwoBG.removeClass("zy_bg_fixed");
                    sectionTwoBG.css("clip","");
                }
            }

            if(sy>sectionThreeY-winH && sy<=sectionThreeY+720){
                if(!ZY.config.deviceCode.iOS){
                    sectionThreeBG.addClass("zy_bg_fixed");

                    //向下滚动的时候使用clip
                    rect="rect(0px "+winW+"px "+(840-(sy-sectionThreeY)+100)+"px 0px)";
                    sectionThreeBG.css("clip",rect);
                }
                if(!ZY.dataManager.sectionThreeLoaded){

                    //获取第3个分类(物语）文章
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_section_three_contain"),
                        lastDate:ZY.dataManager.lastSectionThreeDate,
                        categoryId:ZY.config.categoryIds.sectionThreeId,
                        width:ZY.config.articleWidths.sectionThreeWidth,
                        isFirst:true
                    });

                    ZY.dataManager.sectionThreeLoaded=true;
                }
            }else{

                if(!ZY.config.deviceCode.iOS){
                    sectionThreeBG.removeClass("zy_bg_fixed");
                    sectionThreeBG.css("clip","");
                }

            }
            if(sy>sectionFourY-winH && sy<=sectionFourY+720){
                 if(!ZY.config.deviceCode.iOS){
                     sectionFourBG.addClass("zy_bg_fixed");

                     //滚动的时候使用clip
                     rect="rect(0px "+winW+"px "+(840-(sy-sectionFourY)+100)+"px 0px)";
                     sectionFourBG.css("clip",rect);
                 }

             if(!ZY.dataManager.sectionFourLoaded){

                 //获取第4个分类(社区）文章
                 ZY.dataManager.getCategoryPosts({
                 width:ZY.config.articleWidths.sectionFourWidth,
                 categoryId:ZY.config.categoryIds.sectionFourId,
                 isFirst:true,
                 lastDate:ZY.dataManager.lastSectionFourDate,
                 targetContain:$("#zy_section_four_contain")
                 });
                 ZY.dataManager.sectionFourLoaded=true;
             }
             }else{
                 if(!ZY.config.deviceCode.iOS){
                     sectionFourBG.removeClass("zy_bg_fixed");
                     sectionFourBG.css("clip","");
                 }
             }
        },

        /**
         * 函数说明：针对窗口放大缩小，每个分类展示的响应事件
         * 主要是设置ul外围容器container的宽度和显示影藏下一页按钮
         * 由于当窗口缩小时显示的个数少了，原来显示的最后一页当前可能已经不是最后一页，此时需要判断移除zy_disable类
         * 由于当窗口放大时显示的个数多了，原来显示的不是最后一页当前可能已经是最后一页，此时需要判断添加zy_disable类
         * @param {Object} targetContain     最外围的容器section
         * @param {Number} width    每个li的宽度
         * @param {Number} categoryId
         * @param {Boolean} loaded  是否已经加载过数据
         */
        doResizeOfCategory:function(targetContain,categoryId,width,loaded){
            var limit=parseInt($("body").width()/width);
            limit=setMaxLimit(categoryId,limit);
            var nextBtn=targetContain.find("a.zy_page_next");
            var list=targetContain.find("ul");
            var targetContainer=targetContain.find(".zy_post_list_container");

            //设置容器的宽度
            targetContainer.width(limit*width);

            //判断下一页按钮是否能够显示,针对缩小主要是移除zy_disable类，针对放大主要是加上zy_disable类
            if(parseInt(list.css("left"))>-(list.find("li").length-limit)*width&&loaded){

                //如果left的值没有到总数的前一页，那么就还没有到最后一页，需要取出zy_disable类。
                nextBtn.removeClass("zy_disable");
            }else{

                //需要数据加载后才做次操作
                if(loaded){
                    nextBtn.addClass("zy_disable");
                }
            }
        },

        /**
         * window的resize事件响应
         */
        windowResizeHandler:function(){
            var me=this;
            if(ZY.dataManager.resizeTimer){
                clearTimeout(ZY.dataManager.resizeTimer);
            }

            ZY.dataManager.resizeTimer=setTimeout(function(){
                me.doResizeOfCategory($("#zy_section_two_contain"),ZY.config.categoryIds.sectionTwoId,
                    ZY.config.articleWidths.sectionTwoWidth,ZY.dataManager.sectionTwoLoaded);
                me.doResizeOfCategory($("#zy_section_one_contain"),ZY.config.categoryIds.sectionOneId,
                    ZY.config.articleWidths.sectionOneWidth,ZY.dataManager.sectionOneLoaded);
                me.doResizeOfCategory($("#zy_section_four_contain"),ZY.config.categoryIds.sectionFourId,
                 ZY.config.articleWidths.sectionFourWidth,ZY.dataManager.sectionFourLoaded);
                me.doResizeOfCategory($("#zy_section_three_contain"),ZY.config.categoryIds.sectionThreeId,
                    ZY.config.articleWidths.sectionThreeWidth,ZY.dataManager.sectionThreeLoaded);
            },200);
        }
    }
})();
