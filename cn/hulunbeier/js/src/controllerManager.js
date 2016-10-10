/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 逻辑处理曾，包括事件逻辑和应用逻辑
 */
var ZY=ZY||{};
ZY.controllerManager=(function(){

    var landScapeBG=$("#zy_landscape_bg .zy_theme_bg_content");
    var peopleBG=$("#zy_people_bg .zy_theme_bg_content");
    var artifactBG=$("#zy_artifact_bg .zy_theme_bg_content");
    var communityBG=$("#zy_community_bg .zy_theme_bg_content");


    var landScapeY=$("#zy_landscape").offset().top;
    var peopleY=$("#zy_people").offset().top;
    var artifactY=$("#zy_artifact").offset().top;
    var communityY=$("#zy_community").offset().top;
    var footerY=$(".zy_footer").offset().top;


    return {
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

        }
    }
})();
