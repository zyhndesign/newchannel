var ZY=ZY||{};

ZY.DataManager={
    top_post_id:0,
    landscapeLoaded:false,
    peopleLoaded:false,
    artifactLoaded:false,
    communityLoaded:false,
    lastPeopleDate:"",
    lastLandscapeDate:"",
    lastCommunityDate:"",
    lastArtifactDate:"",
    zy_insert_people:function(data){

        /*
         * 插入人文聚合文章categoryId 2
         * */

         //用模板输出html
        var tpl= $("#zy_people_articles_tpl").html();
        var html = juicer(tpl,{posts:data});
        $("#zy_people_list").append($(html));
		
    },

    zy_insert_landscape:function(data){

        /*
         * 插入风景聚合文章categoryId 3
         * */

         //用模板输出html
        var tpl= $("#zy_landscape_articles_tpl").html();
        var html = juicer(tpl,{posts:data});
        $("#zy_landscape_list").append($(html));
    },

    zy_insert_community:function(data){

        /*
         * 插入社区聚合文章categoryId 4
         * */

         //用模板输出html
        var tpl= $("#zy_community_articles_tpl").html();
        var html = juicer(tpl,{posts:data});
        $("#zy_community_list").append($(html));
    },

    zy_insert_artifact:function(data){

        /*
         * 插入物语聚合文章categoryId 5
         * */

         //用模板输出html
        var tpl= $("#zy_artifact_articles_tpl").html();
        var html = juicer(tpl,{posts:data});
        $("#zy_artifact_list").append($(html));
    },

    zy_set_limit:function(targetContain,width,categoryId,isFirst){

        /*
         * 请求数据的时候设置个数和容器宽度
         * */

         //能够容纳的个数
        var limit=parseInt($("body").width()/width);

        //每次请求，都需要设置外围的宽度
        targetContain.find(".zy_list_container").width(limit*width);
        ZY.UIManager.callLoadingSpinner($(targetContain));

        //设置请求个数
        if(isFirst){

            //第一次请求要请求3页的数据

            if(categoryId==3){

                //风景有一个大图，这个位置要计算出来
                if($("body").width()>=720){
                    //当页面大于等于720的时候，会显示一个大图
                    limit=parseInt(($("body").width()-720)/width)+limit*2+1;
                }
            }else{
                limit=limit*3;//加载三页的数据，防止用户突然拉大屏幕，导致下一页数据不足=limit*3;//加载三页的数据，防止用户突然拉大屏幕，导致下一页数据不足
            }
        }else{

            //如果不是第一次请求,最少加载两页数据，有可能用户突然拉大屏幕，导致下一页数据不足
            limit=limit*2;
        }

        return limit;
    },

    zy_do_response:function(targetContain,data,isFirst,categoryId,limit){

        /*
         * 请求文章的ajax返回后的处理函数
         * */

        var length=data.length;
		var nextBtn=targetContain.find(".zy_contain_next")

        //根据categoryId设置背景
        if(isFirst&&length!=0&&data[0]["post_id"]!=this.top_post_id){
            //ZY.UIManager.updateSectionBG(data[0],targetContain.parent().find(".zy_section_bg img"));
			if(categoryId==2){
				ZY.UIManager.updateSectionBG(data[0],$("#zy_people_theme"))
			}else if(categoryId==3){
				ZY.UIManager.updateSectionBG(data[0],$("#zy_landscape_theme"))
			}else if(categoryId==4){
				ZY.UIManager.updateSectionBG(data[0],$("#zy_comunity_theme"))
			}else if(categoryId==5){
				ZY.UIManager.updateSectionBG(data[0],$("#zy_artifact_theme"))
			}
        }

        
		//判断是否显示下一页按钮
        /*if(!isFirst){
            targetContain.find(".zy_contain_next").removeClass("zy_disable");
        }*/

        //记录下最后一个的发布时间,插入数据
        if(length<=limit){

            //在数据不为0的情况下，记录下最有一个的时间
            if(length!=0){
                if(categoryId==2){
                    this.lastPeopleDate=data[length-1]["post_full_date"];
                    this.zy_insert_people(data);
                }else if(categoryId==3){
                    this.lastLandscapeDate=data[length-1]["post_full_date"];
                    this.zy_insert_landscape(data);
                }else if(categoryId==4){
                    this.lastCommunityDate=data[length-1]["post_full_date"];
                    this.zy_insert_community(data);
                }else{
                    this.lastArtifactDate=data[length-1]["post_full_date"];
                    this.zy_insert_artifact(data);
                }
            }
			
			//加载完成后默认显示下一页按钮
			nextBtn.removeClass("zy_disable")
			
            //但如果是第一次加载，并且数量小于一页的数量，要设置不可点击
            if(categoryId==3){
                if(!(isFirst&&length<=(limit+2)/3-2)){
                   nextBtn.removeClass("zy_disable");
                }
            }else{
                if(!(isFirst&&length<=limit/3)){
                   nextBtn.removeClass("zy_disable");
                }
            }
			
			
			
            if(length<limit){

                //如果返回的个数小于请求的个数，则要设置不能再加载的标志
               	nextBtn.addClass("zy_no_more");
            }

        }
    },

    zy_get_posts:function(targetContain,width,categoryId,lastDate,isFirst){

        /*
         * 请求分类文章函数
         * params:width每个容器的宽度，categoryId分类的id，lastId已经请求了的最后一个id
         * isFirst是否为第一次请求
         * */

        var limit=this.zy_set_limit(targetContain,width,categoryId,isFirst);
		
		//首先隐藏下一页按钮，获取到数据后再显示
		$(targetContain).find(".zy_contain_next").addClass("zy_disable")

        //请求数据ajax
        $.ajax({
            url:ZY.Config.ajaxurl,//ajaxurl为页面刷出来的全局变量
            type:"post",
            data:{
                limit:limit,
                lastDate:lastDate,
                categoryId:categoryId,
                action:"zy_get_posts"
            },
            success:function(response){

                //要保存数据，并且添加数据到html
                if(response.success){

                    //如果返回有数据
                    var data=response.data;

                    //返回数据后的处理函数
                    ZY.DataManager.zy_do_response(targetContain,data,isFirst,categoryId,limit);

                }else{
                    //提示网络异常的错误
                    ZY.UIManager.popOutMsg(ZY.Config.errorCode.postsError)
                }

                ZY.UIManager.hideLoadingSpinner($(targetContain));

            },
            error:function(){
                //提示网络异常的错误
                ZY.UIManager.hideLoadingSpinner($(targetContain));
                ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)
            }
        });
    },
    get_posts_detail:function(post_id,post_type){
        $.ajax({
                url:ZY.Config.ajaxurl,
                type:"post",
                data:{
                    post_id:post_id,
                    action:"zy_get_post_detail"
                },
                success:function(response){
                    if(response.success){
                        var tpl=$("#zy_show_detail_tpl").html();
                        var data=response.data;

                        var html=juicer(tpl,data);
                        $("#zy_article_content").append(html);

                        ZY.UIManager.hideLoadingSpinner($("#zy_article_content"));
                    }else{

                        //提示报错
                        ZY.UIManager.popOutMsg(ZY.Config.errorCode.articleError)
                    }
                },
                error:function(){
                    ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)
                }
            })
        },
    add_hover_event:function(targetContain,targetList,targetPrev,targetNext){

        /*
         * 显示左右按钮函数
         * */
		var container=$(targetContain).find(".zy_list_container")
		var list=$(targetContain).find(".zy_list_container>ul")
		var nextBtn=$(targetContain).find(".zy_contain_next")
		var prevBtn=$(targetContain).find(".zy_contain_prev")
		
        targetContain.hover(
            function(){
				prevBtn.css("opacity",1);
				nextBtn.css("opacity",1);
                if(parseInt(targetList.css("left"))>=0){
                    prevBtn.addClass("zy_disable");					
                }
            },
            function(){
				prevBtn.css("opacity",0);
				nextBtn.css("opacity",0);
            }
        );
    },

    show_next_animate:function(targetContain,width,categoryId,lastDate){

        /*
         * 右滑动画函数
         * params  target 点击的按钮本身；targetList li外围的容器；targetContainer ul外围的容器
         * targetPrev 前一页按钮 ；width每个内容的宽度；categoryId 请求的类型的id；lastId最后一个已请求内容的id
         * */

        var limit=parseInt($("body").width()/width);
        var nextBtn=$(targetContain).find("a.zy_contain_next");
        var prevBtn=$(targetContain).find("a.zy_contain_prev");
        var container=$(targetContain).find(".zy_list_container");
        var list=$(targetContain).find(".zy_list_container ul");
        

        container.width(limit*width);//设置list的外围容器宽度

        if(nextBtn.hasClass("zy_no_more")){
            //如果数据都已经加载完成
            //动画
            list.animate({"left":parseInt(list.css("left"))-limit*width},500,function(){
                //显示前面一个按钮
                prevBtn.removeClass("zy_disable");

                if(categoryId==3){

                    //风景有个大图，是其他的三倍
                    if(parseInt(list.css("left"))<=-(list.find("li").length-limit+2)*width){
                        //如果left的值已经到了总数的前一页，那么就让这个按钮disable。
                        nextBtn.addClass("zy_disable");
                    }
                }else{
                    if(parseInt(list.css("left"))<=-(list.find("li").length-limit)*width){
                        //如果left的值已经到了总数的前一页，那么就让这个按钮disable。
                        nextBtn.addClass("zy_disable");
                    }
                }

            });
        }else{
            //加载数据，加载后再执行动画
            this.zy_get_posts(targetContain,width,categoryId,lastDate,false);
            list.animate({"left":parseInt(list.css("left"))-limit*width},500,function(){
                //去掉前面按钮的无加载标志
                prevBtn.removeClass("zy_disable");
            });
        }
    },

    show_prev_animate:function(targetContain,width,categoryId){

        /*
         * 左滑动函数
         * params  target 点击的按钮本身；targetList li外围的容器；targetContainer ul外围的容器
         * targetNext 后一页按钮 ；width每个内容的宽度
         * */

        var limit=parseInt($("body").width()/width);
        var nextBtn=$(targetContain).find("a.zy_contain_next");
        var prevBtn=$(targetContain).find("a.zy_contain_prev");
        var container=$(targetContain).find(".zy_list_container");
        var list=$(targetContain).find(".zy_list_container ul");

        
        container.width(limit*width);//设置list的外围容器宽度

        //执行动画
        if(parseInt(list.css("left"))+limit*width>0){
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
            if(categoryId==3){
                //如果是风景
                if(parseInt(list.css("left"))+limit*width>-720&&parseInt(list.css("left"))+limit*width<0&&$("body").width()>720){
                    //如果有大图(屏幕宽度大于720），并且快要被截断的情况下
                    list.animate({"left":-720},500,function(){
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

                //如果移动完后，恰好left为0，那么前一页按钮要禁用
                if(parseInt(list.css("left"))==0){
                    prevBtn.addClass("zy_disable");
                }
            });

        }
    }
};