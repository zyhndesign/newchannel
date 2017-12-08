/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 逻辑处理曾，包括事件逻辑和应用逻辑
 */
var ZY=ZY||{};
ZY.controllerManager=(function(){

    var oldScrollTop=0;
    var featuredMovement=-350;
    var landscapeMovement=0;
    /*var peopleTop=-180;*/
    var peopleMovement=0;
    var artifactMovement=0;
    var communityBottomBottom=-200;
    var landScapeBG=$("#zy_landscape_bg .zy_theme_bg_content");
    var peopleBG=$("#zy_people_bg .zy_theme_bg_content");
    var artifactBG=$("#zy_artifact_bg .zy_theme_bg_content");
    var communityBG=$("#zy_community_bg .zy_theme_bg_content");


    var featuredY=$(".zy_featured").offset().top;
    var landScapeY=$("#zy_landscape").offset().top;
    var peopleY=$("#zy_people").offset().top;
    var artifactY=$("#zy_artifact").offset().top;
    var communityY=$("#zy_community").offset().top;
    var footerY=$(".zy_footer").offset().top;


    var featuredLeftEl=$("#zy_featured_left");
    var featuredRightEl=$("#zy_featured_right");
    var landscapeLeftEl=$("#zy_landscape_left");
    var landscapeRightEl=$("#zy_landscape_right");
    var peopleLeftEl=$("#zy_people_left");
    var peopleTopEl=$("#zy_people_top");
    var peopleRightEl=$("#zy_people_right");
    var artifactLeftEl=$("#zy_artifact_left");
    var artifactBottomEl=$("#zy_artifact_bottom");
    var communityBottomEl=$("#zy_community_bottom");

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
                    evt.stopPropagation(); //由于window也绑定有此事件，阻止冒泡到window
                }else{
                    evt.returnValue=false;
                    evt.cancelBubble = false;
                }
                //evt.preventDefault();

            };
            target.addEventListener(mousewheelEvt, mousewheelHandler);
        },

        /**
         * 设置window滚动速度,因为火狐滚动响应过快
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

            //窗口可能放大缩小，每次都需要获取
            var winH=$(window).height();
            var winW=$(window).width();

            //设置顶部菜单状态, 首先重置所有菜单,计算时要减去nav的80高
            $("#zy_nav ul li a").removeClass("active");
            if(sy<=landScapeY){

            }else if(sy<=peopleY){
                $("#zy_nav ul li:nth-child(1) a").addClass("active");
            }else if(sy<=artifactY){
                $("#zy_nav ul li:nth-child(2) a").addClass("active");
            }else if(sy<=communityY){
                $("#zy_nav ul li:nth-child(3) a").addClass("active");
            }else if(sy<=footerY){
                $("#zy_nav ul li:nth-child(4) a").addClass("active");
            }

            //设置背景状态
            /*
             * 背景动画说明:采用了img的clip属性，
             *在需要显示背景的区域往下滚动的时候让显示区域不断的变小
             * 在向上滚动的时候，让显示区域不断的变大
             * 变化以背景图片高度为基准，以滚动的top与模块的top差值为变量
             * 720-（sy-landScapey)+100   720是背景图片高度，sy是滚动了的高度，landScapeY是模块的top值,
             * 100是突然增大显示区域导致白色闪屏的处理，多100，那么增加时的闪动会在另外一层的下面，这样就不影响视觉
             * 那么向下滚动时sy不断增大，整体值是不断减小的，向上滚动时，sy不断减小，整体值不断增大
             * 在非改变区域的时候，去掉clip属性
             *注意：背景图的高度是根据宽度变化的，可能会大于720，最大为一屏幕高，
             *720-（sy-landScapey)+100 可能大于一屏幕高，并不影响显示，因为当clip的显示高度大于实际高度时，只会显示成实际高度
             */
            if(sy>landScapeY-winH && sy<=landScapeY+720){
                if(!ZY.config.deviceCode.iOS){
                    landScapeBG.addClass("zy_bg_fixed");
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
                                    categoryId:ZY.config.categoryIds.landscapeId,
                                    callback:function(list){

                                        var tpl= $("#zy_landscape_articles_tpl").html();
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
                    landScapeBG.removeClass("zy_bg_fixed");
                }
            }

            if(sy>peopleY-winH && sy<=peopleY+720){
                if(!ZY.config.deviceCode.iOS){
                    peopleBG.addClass("zy_bg_fixed");
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
                                    categoryId:ZY.config.categoryIds.peopleId,
                                    callback:function(list){

                                        var tpl= $("#zy_people_articles_tpl").html();
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
                    peopleBG.removeClass("zy_bg_fixed");
                }
            }

            if(sy>artifactY-winH && sy<=artifactY+720){
                if(!ZY.config.deviceCode.iOS){
                    artifactBG.addClass("zy_bg_fixed");
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
                                    categoryId:ZY.config.categoryIds.artifactId,
                                    callback:function(list){

                                        var tpl= $("#zy_artifact_articles_tpl").html();
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
                    artifactBG.removeClass("zy_bg_fixed");
                }
            }

            if(sy>communityY-winH && sy<=communityY+720){
                if(!ZY.config.deviceCode.iOS){
                    communityBG.addClass("zy_bg_fixed");

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
                                    categoryId:ZY.config.categoryIds.communityId,
                                    callback:function(list){

                                        var tpl= $("#zy_community_articles_tpl").html();
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
                    communityBG.removeClass("zy_bg_fixed");
                }
            }


            //控制每一层的动画,需要根据滚动方向来设置
            if(!ZY.config.deviceCode.iOS){
                if(sy>oldScrollTop){

                    //向下滚动推荐层的人物变动
                    if(sy>360){
                            featuredLeftEl.css("left","+=2");
                            featuredRightEl.css("right","+=2");
                            featuredMovement+=2;
                        }

                    //向下滚动风景动画
                    if(sy>landScapeY+360){
                        landscapeLeftEl.css("left","+=2");
                        landscapeRightEl.css("right","+=2");
                    }

                    //向下滚动人文动画
                    if(sy>peopleY){
                        /*if(peopleTop-10>=-280){
                            peopleTopEl.css("top",peopleTop-10);
                            peopleTop-=10;
                        }*/

                        peopleLeftEl.css("left","+=2");
                        peopleRightEl.css("right","+=2");

                    }

                    //向下滚动物语变化
                    if(sy>artifactY+400){
                        /*artifactLeftEl.css("left","+=2");*/
                        artifactBottomEl.css("bottom","+=1");
                    }

                    //向下滚动社区动画
                    if(sy>communityY+800){
                        communityBottomEl.css("bottom","+=2");
                    }
                }else{

                    //向上滚动推荐层的视差滚动
                    if(sy>=featuredY-360){
                        featuredLeftEl.css("left","-=2");
                        featuredRightEl.css("right","-=2");
                    }

                    //向上滚动风景动画
                    if(sy<peopleY){
                        landscapeLeftEl.css("left","-=2");
                        landscapeRightEl.css("right","-=2");
                    }

                    //向上人文动画
                    if(sy<peopleY+1520){
                        peopleLeftEl.css("left","-=2");
                        peopleRightEl.css("right","-=2");


                    }

                    //向上物语动画
                    if(sy<artifactY+1600){
                        /*artifactLeftEl.css("left","-=2");*/
                        artifactBottomEl.css("bottom","-=1");

                    }

                    //向上滚动社区动画
                    if(sy<footerY){
                        communityBottomEl.css("bottom","-=2");
                    }
                }
            }

            //重新赋值
            oldScrollTop=sy;
        }
    }
})();
