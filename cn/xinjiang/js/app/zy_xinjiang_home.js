/*
* categoryId 2:人文 3：风景 4：社区 5：物语
* */

$(document).ready(function() {
    var	post_id=0; //当前展示文章的id
	
    /*
    * 请求顶部4篇文章
    * */
    (function(){
        $.ajax({
            url:ZY.Config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_top_posts",
                programId:1
            },
            success:function(response){
                if(response.success){
                    if(response.data.length!=0){
                        var posts=response.data;
						ZY.DataManager.top_post_id=posts[0]["post_id"];
                        //用模板输出html(顶部)
                        var tpl_top = $("#zy_top_post_tpl").html();
                        var html_top = juicer(tpl_top,{top_posts:posts});
                        $("#zy_top_post_heading").html(html_top);
						ZY.UIManager.updateSectionBG(posts[0],$("#zy_top_post_poster"))

                        //用模板输出html(推荐)
                        var tpl_featured = $("#zy_featured_articles_tpl").html();
                        var html_featured = juicer(tpl_featured,{top_posts:posts});
                        $("#zy_featured_articles").html(html_featured);

                    }
                }else{
                    //提示
					ZY.UIManager.popOutMsg(ZY.Config.errorCode.postsError)
                }
            },
			error:function(){
				ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)
				}
        });
    })();

    /*
    *请求音乐文件
    * */
    (function(){
        $.ajax({
            url:ZY.Config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_music",
                programId:1
            },
            success:function(response){
                if(response.success){
                    //console.log(response);
                    if(response.data.length!=0){
                        var musics=response.data;

                        //用模板输出html
                        var tpl = $("#zy_music_tpl").html();
                        var html = juicer(tpl,{musics:musics});
                        $("#zy_music_list").html(html);

                        //设置第一首音乐信息
                        $("#zy_music_audio").attr("src",musics[0].music_path);//设置音乐路径
                        $("#zy_music_author").html("Directed by "+musics[0].music_author);
                        $("#zy_music_title").html(musics[0].music_title);

                        ZY.UIManager.musicLiLength=musics.length;
                    }else{
                        $("#zy_music_title").text(ZY.Config.errorCode.hasNoMusic);
                    }
                }else{
                    ZY.UIManager.popOutMsg(ZY.Config.errorCode.musicError);
                }
            },
			error: function(){
					ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError);
				}
        });
    })();
    

    /*========================页面逻辑代码=========================================*/
	
    //菜单点击事件
    $("#zy_top_nav a,#zy_nav a").click(function(){
		var target=$(this).attr("href");
		ZY.UIManager.scrollToTarget(target);
		return false;
    });
	//logo点击事件
	$("#zy_logo a").click(function(){
		ZY.UIManager.scrollToTarget("#zy_top_post");
		return false;
    });

    /*=====展示单篇文章页面，相应鼠标横向滚动事件=================*/
	ZY.UIManager.bindHScrollOnWheel($("#zy_article_content")[0]);
		
    /*=====iOS触屏滚动支持=================*/
	if(ZY.Config.deviceCode.iOS){
		$(".zy_article_content").addClass("zy_touch_hscroll");
		$("#zy_landscape_list_container").addClass("zy_touch_hscroll");
		$("#zy_people_list_container").addClass("zy_touch_hscroll");
		$("#zy_artifact_list_container").addClass("zy_touch_hscroll");
		$("#zy_community_list_container").addClass("zy_touch_hscroll");		
	}

    //最顶上一篇文章的点击load事件
    $(document).on("click","#zy_top_post_title",function(){
		var url="";
        post_id=$(this).data("zy-post-id");
        var post_type=$(this).data("zy-post-type");

        ZY.UIManager.showArticle(post_id,post_type);
    });

	//音乐控制
	//初始化音乐播放器，绑定相关事件
    ZY.UIManager.initMusicPlayer();


   /*====获取第一个分类（人文）文章,左边有一个大的===*/
   // ZY.DataManager.zy_get_posts($("#zy_people_contain"),340,2,ZY.Config.lastPeopleDate,true);

    /*====获取第二个分类(风景）文章，等宽340===*/
   // ZY.DataManager.zy_get_posts($("#zy_landscape_contain"),240,3,ZY.Config.lastLandscapeDate,true);

    /*====获取第三个分类(社区）文章，等宽400===*/
    // ZY.DataManager.zy_get_posts($("#zy_community_contain"),340,4,ZY.Config.lastCommunityDate,true);

    /*====获取第4个分类(物语）文章，等宽400===*/
    //ZY.DataManager.zy_get_posts($("#zy_artifact_contain"),400,5,ZY.Config.lastArtifactDate,true);

    //风景显示左右按钮
    ZY.DataManager.add_hover_event($("#zy_landscape_contain"),$("#zy_landscape_list"),$("#zy_landscape_prev"),
        $("#zy_landscape_next"));

    //人文部分显示左右按钮
    ZY.DataManager.add_hover_event($("#zy_people_contain"),$("#zy_people_list"),$("#zy_people_prev"),
        $("#zy_people_next"));

    //物语部分显示左右按钮
    ZY.DataManager.add_hover_event($("#zy_artifact_contain"),$("#zy_artifact_list"),$("#zy_artifact_prev"),
        $("#zy_artifact_next"));


    //社区部分显示左右按钮
    ZY.DataManager.add_hover_event($("#zy_community_contain"),$("#zy_community_list"),$("#zy_community_prev"),
        $("#zy_community_next"));


    //风景向右点击
    $("#zy_landscape_next").click(function(){
        //调用函数
        ZY.DataManager.show_next_animate($("#zy_landscape_contain"),240,3,ZY.DataManager.lastLandscapeDate);

    });

    //风景向左点击
    //风景向左点击
    $("#zy_landscape_prev").click(function(){
        //调用函数
        ZY.DataManager.show_prev_animate($("#zy_landscape_contain"),240,3);

    });
	
    //人文向右点击
    $("#zy_people_next").click(function(){
        //调用函数
        ZY.DataManager.show_next_animate($("#zy_people_contain"),340,2,ZY.DataManager.lastPeopleDate);

    });

    //人文向左点击
    $("#zy_people_prev").click(function(){
        //调用函数
        ZY.DataManager.show_prev_animate($("#zy_people_contain"),340,2);

    });


    //物语向右点击
    $("#zy_artifact_next").click(function(){
        //调用函数
        ZY.DataManager.show_next_animate($("#zy_artifact_contain"),400,5,ZY.DataManager.lastArtifactDate);

    });
    //物语向左点击
    $("#zy_artifact_prev").click(function(){
        //调用函数
        ZY.DataManager.show_prev_animate($("#zy_artifact_contain"),400,5);

    });

    //社区向右点击
    $("#zy_community_next").click(function(){
        //调用函数
        ZY.DataManager.show_next_animate($("#zy_community_contain"),340,4,ZY.DataManager.lastCommunityDate);

    });

    //社区向左点击
    $("#zy_community_prev").click(function(){
        //调用函数
        ZY.DataManager.show_prev_animate($("#zy_community_contain"),340,4);
    });


    
    //关闭弹出层
    $("#zy_show_close").click(function(){
        ZY.UIManager.hideDetail()        
    });

	//绑定弹出窗口事件
	ZY.UIManager.popOutInit();
	
    //加载展开页面
    $(document).on("click","li[data-zy-post-type^=zy]",function(){
        post_id=$(this).data("zy-post-id");
        var post_type=$(this).data("zy-post-type");

        ZY.UIManager.showArticle(post_id,post_type);
    });
    //关闭加载的页面
    $("#zy_article_content_close").click(function(){		
        ZY.UIManager.hideArticle();
    });

    //显示大图
    $(document).on("click","#zy_article_content a",function(){
		var url;
		var elementA=$(this);
		if(elementA.hasClass("videoslide")){
			url=ZY.Config.siteurl+"/show_media/"+post_id+"/"+elementA.find("img").data("zy-media-id");
			ZY.UIManager.showVideoDetail(url);
			return false;
		}else if(elementA.find("img")){
			url=elementA.attr("href");
			ZY.UIManager.showImageDetail(url);
			return false;	
		}else{
			window.open(elementA.attr("href"))
        }
    });
	//window 的scroll事件
	$(window).on("scroll",function(evt){
		ZY.UIManager.scrollingHandler()
	});

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
	$(window).trigger("scroll");

	//启动页面滚轮模式
	//ZY.UIManager.setWheelScrollSpeed();
	
    //window的resize事件，在这个事件里面需要重新设置每个container的宽度
    var resizeTimer=null;
    $(window).resize(function(){
       if(resizeTimer){
           clearTimeout(resizeTimer);
       }
       resizeTimer=setTimeout(function(){
           ZY.UIManager.doResizeOfCategory($("#zy_people_contain"),340,
               ZY.DataManager.peopleLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_landscape_contain"),240,
               ZY.DataManager.landscapeLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_community_contain"),340,
               ZY.DataManager.communityLoaded);
           ZY.UIManager.doResizeOfCategory($("#zy_artifact_contain"),400,
               ZY.DataManager.artifactLoaded);
       },200);
    });
});
