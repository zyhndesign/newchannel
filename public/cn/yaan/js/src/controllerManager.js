/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 逻辑处理曾，包括事件逻辑和应用逻辑
 */
var ZY=ZY||{};
ZY.controllerManager=(function(){

    var topH=$("#zy_top_post").height();
    var sectionOneBG=$("#zy_section_one_bg .zy_theme_bg_content");
    var sectionTwoBG=$("#zy_section_two_bg .zy_theme_bg_content");
    var sectionThreeBG=$("#zy_section_three_bg .zy_theme_bg_content");
    var sectionFourBG=$("#zy_section_four_bg .zy_theme_bg_content");


    var menu=$("#zy_nav");

    //进入页面时nav为非fixed状态，滚动到下面后变成fiexd，不占高度，所以要减去
    var sectionOneY=$("#zy_section_one").offset().top;
    var sectionTwoY=$("#zy_section_two").offset().top;
    var sectionThreeY=$("#zy_section_three").offset().top;
    var sectionFourY=$("#zy_section_four").offset().top;
    var footerY=$(".zy_footer").offset().top;

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
            if(sy>sectionOneY-winH && sy<=sectionOneY+800){
                if(!ZY.config.deviceCode.iOS){
                    sectionOneBG.addClass("zy_bg_fixed");

                }

                if(!ZY.dataManager.landscapeLoaded&&!ZY.dataManager.swiper1){
                    //list模块初始化
                    ZY.dataManager.swiper1 = new Swiper('.swiper1', {
                        pagination: '.swiper-pagination1',
                        paginationClickable: true,
                        /*nextButton: '.swiper-button-next1',
                         prevButton: '.swiper-button-prev1',*/
                        simulateTouch:true,
                        direction: 'horizontal',
                        slidesPerView: 3,
                        spaceBetween: 20,
                        breakpoints: {
                            960: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            640:{
                                slidesPerView: 1,
                                spaceBetween: 10
                            }
                        },
                        onReachEnd:function(swiper){
                            if(swiper.lastDate!=-1){
                                var limit=swiper.lastDate?3:6;
                                ZY.dataManager.getCategoryPosts({
                                    limit:limit,
                                    lastDate:swiper.lastDate?swiper.lastDate:"",
                                    categoryId:ZY.config.categoryIds.sectionOneId,
                                    callback:function(list){

                                        var tpl= $("#zy_section_one_articles_tpl").html();
                                        var html = juicer(tpl,{posts:list});
                                        swiper.appendSlide(html);
                                        swiper.update();

                                        if(list.length<limit){
                                            swiper.lastDate=-1;
                                        }else{
                                            swiper.lastDate=list[list.length-1]["post_full_date"];
                                        }

                                        ZY.dataManager.landscapeLoaded=true;
                                    }
                                });
                            }
                        }
                    });
                }


            }else{
                if(!ZY.config.deviceCode.iOS){
                    sectionOneBG.removeClass("zy_bg_fixed");
                }
            }

            if(sy>sectionTwoY-winH && sy<=sectionTwoY+800){
                if(!ZY.config.deviceCode.iOS){
                    sectionTwoBG.addClass("zy_bg_fixed");
                }

                if(!ZY.dataManager.peopleLoaded&&!ZY.dataManager.swiper2){

                    //获取第2个分类（人文）文章
                    ZY.dataManager.swiper2 = new Swiper('.swiper2', {
                        pagination: '.swiper-pagination2',
                        paginationClickable: true,
                        /*nextButton: '.swiper-button-next2',
                         prevButton: '.swiper-button-prev2',*/
                        simulateTouch:true,
                        direction: 'horizontal',
                        slidesPerView: 4,
                        spaceBetween: 20,
                        breakpoints: {
                            960: {
                                slidesPerView: 3,
                                spaceBetween: 20
                            },
                            640:{
                                slidesPerView: 1,
                                spaceBetween: 10
                            }
                        },
                        onReachEnd:function(swiper){
                            if(swiper.lastDate!=-1){
                                var limit=swiper.lastDate?4:8;
                                ZY.dataManager.getCategoryPosts({
                                    limit:limit,
                                    lastDate:swiper.lastDate?swiper.lastDate:"",
                                    categoryId:ZY.config.categoryIds.sectionTwoId,
                                    callback:function(list){

                                        var tpl= $("#zy_section_two_articles_tpl").html();
                                        var html = juicer(tpl,{posts:list});
                                        swiper.appendSlide(html);
                                        swiper.update();

                                        if(list.length<limit){
                                            swiper.lastDate=-1;
                                        }else{
                                            swiper.lastDate=list[list.length-1]["post_full_date"];
                                        }

                                        ZY.dataManager.peopleLoaded=true;
                                    }
                                });
                            }
                        }
                    });
                }
            }else{
                if(!ZY.config.deviceCode.iOS){
                    sectionTwoBG.removeClass("zy_bg_fixed");
                }
            }

            if(sy>sectionThreeY-winH && sy<=sectionThreeY+840){
                if(!ZY.config.deviceCode.iOS){
                    sectionThreeBG.addClass("zy_bg_fixed");
                }
                if(!ZY.dataManager.artifactLoaded&&!ZY.dataManager.swiper3){

                    //获取第3个分类(物语）文章
                    ZY.dataManager.swiper3 = new Swiper('.swiper3', {
                        pagination: '.swiper-pagination3',
                        paginationClickable: true,
                        /*nextButton: '.swiper-button-next3',
                         prevButton: '.swiper-button-prev3',*/
                        simulateTouch:true,
                        direction: 'horizontal',
                        slidesPerView: 3,
                        spaceBetween: 20,
                        breakpoints: {
                            960: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            640:{
                                slidesPerView: 1,
                                spaceBetween: 10
                            }
                        },
                        onReachEnd:function(swiper){
                            if(swiper.lastDate!=-1){
                                var limit=swiper.lastDate?3:6;
                                ZY.dataManager.getCategoryPosts({
                                    limit:limit,
                                    lastDate:swiper.lastDate?swiper.lastDate:"",
                                    categoryId:ZY.config.categoryIds.sectionThreeId,
                                    callback:function(list){

                                        var tpl= $("#zy_section_three_articles_tpl").html();
                                        var html = juicer(tpl,{posts:list});
                                        swiper.appendSlide(html);
                                        swiper.update();

                                        if(list.length<limit){
                                            swiper.lastDate=-1;
                                        }else{
                                            swiper.lastDate=list[list.length-1]["post_full_date"];
                                        }

                                        ZY.dataManager.artifactLoaded=true;
                                    }
                                });
                            }
                        }
                    });
                }
            }else{

                if(!ZY.config.deviceCode.iOS){
                    sectionThreeBG.removeClass("zy_bg_fixed");
                }

            }
            if(sy>sectionFourY-winH && sy<=sectionFourY+840){
                 if(!ZY.config.deviceCode.iOS){
                     sectionFourBG.addClass("zy_bg_fixed");
                 }

                if(!ZY.dataManager.communityLoaded&&!ZY.dataManager.swiper4){

                    //获取第4个分类(社区）文章
                    ZY.dataManager.swiper4 = new Swiper('.swiper4', {
                        pagination: '.swiper-pagination4',
                        /*nextButton: '.swiper-button-next4',
                         prevButton: '.swiper-button-prev4',*/
                        paginationClickable: true,
                        simulateTouch:true,
                        direction: 'horizontal',
                        slidesPerView: 4,
                        spaceBetween: 20,
                        breakpoints: {
                            960: {
                                slidesPerView: 3,
                                spaceBetween: 20
                            },
                            640:{
                                slidesPerView: 1,
                                spaceBetween: 10
                            }
                        },
                        onReachEnd:function(swiper){
                            if(swiper.lastDate!=-1){
                                var limit=swiper.lastDate?4:8;
                                ZY.dataManager.getCategoryPosts({
                                    limit:limit,
                                    lastDate:swiper.lastDate?swiper.lastDate:"",
                                    categoryId:ZY.config.categoryIds.sectionFourId,
                                    callback:function(list){

                                        var tpl= $("#zy_section_four_articles_tpl").html();
                                        var html = juicer(tpl,{posts:list});
                                        swiper.appendSlide(html);
                                        swiper.update();

                                        if(list.length<limit){
                                            swiper.lastDate=-1;
                                        }else{
                                            swiper.lastDate=list[list.length-1]["post_full_date"];
                                        }

                                        ZY.dataManager.communityLoaded=true;
                                    }
                                });
                            }
                        }
                    });

                }
             }else{
                 if(!ZY.config.deviceCode.iOS){
                     sectionFourBG.removeClass("zy_bg_fixed");
                 }
             }
        }
    }
})();
