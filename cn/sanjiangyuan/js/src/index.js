/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){

    //音乐获取
    ZY.dataManager.getMusic();

    //音乐时间轴
    ZY.music.musicTimeLine();

    //音乐播放结束
    ZY.music.musicEndHandler();

    //音乐：上一首
    $("#zy_music_prev").click(function(){
        ZY.music.musicPrev();
    });

    //音乐：下一首
    $("#zy_music_next").click(function(){
        ZY.music.musicNext();
    });

    //音乐：暂停/播放
    $("#zy_music_control").click(function(){
        ZY.music.musicControlHandler();
    });

    //显示音乐播放器
    $("#zy_music_show").mouseenter(function(){
        ZY.uiManager.showMusicPlayer();
    });
    $("#zy_music_section").mouseleave(function(){
        ZY.uiManager.hideMusicPlayer();
    });

    //显示菜单
    $("#zy_show_menu").mouseenter(function(){
        ZY.uiManager.showMenu();
    });
    $("#zy_nav").mouseleave(function(){
        ZY.uiManager.hideMenu();
    });

    //菜单点击事件
    $("#zy_nav a").click(function(){
        var target=$(this).attr("href");
        ZY.uiManager.scrollToTarget($(target));
        return false;
    });

    //drop down click
    $(".zy_dropdown").click(function(){
       var target=$(this).data("target");
        ZY.uiManager.dropDown($(target));
    });


    //获取封面故事和推荐文章
    ZY.dataManager.getTopPosts();

    //风景显示左右按钮
    ZY.controllerManager.addHoverEvent($("#zy_landscape_contain"));

    //人文部分显示左右按钮
    ZY.controllerManager.addHoverEvent($("#zy_people_contain"));

    //物语部分显示左右按钮
    ZY.controllerManager.addHoverEvent($("#zy_artifact_contain"));


    //社区部分显示左右按钮
    ZY.controllerManager.addHoverEvent($("#zy_community_contain"));

    //风景向右点击
    $("#zy_landscape_next").click(function(){
        ZY.controllerManager.nextPage($("#zy_landscape_contain"),ZY.config.articleWidths.landscapeWidth,
            ZY.config.categoryIds.landscapeId,ZY.dataManager.lastLandscapeDate);

    });

    //风景向左点击
    $("#zy_landscape_prev").click(function(){
        ZY.controllerManager.prevPage($("#zy_landscape_contain"),
            ZY.config.articleWidths.landscapeWidth,ZY.config.categoryIds.landscapeId);

    });

    //人文向右点击
    $("#zy_people_next").click(function(){
        ZY.controllerManager.nextPage($("#zy_people_contain"),ZY.config.articleWidths.peopleWidth,
            ZY.config.categoryIds.peopleId,ZY.dataManager.lastPeopleDate);

    });

    //人文向左点击
    $("#zy_people_prev").click(function(){
        ZY.controllerManager.prevPage($("#zy_people_contain"),
            ZY.config.articleWidths.peopleWidth,ZY.config.categoryIds.peopleId);

    });

    //物语向右点击
    $("#zy_artifact_next").click(function(){
        ZY.controllerManager.nextPage($("#zy_artifact_contain"),ZY.config.articleWidths.artifactWidth,
            ZY.config.categoryIds.artifactId,ZY.dataManager.lastArtifactDate);

    });

    //物语向左点击
    $("#zy_artifact_prev").click(function(){
        ZY.controllerManager.prevPage($("#zy_artifact_contain"),
            ZY.config.articleWidths.artifactWidth,ZY.config.categoryIds.artifactId);

    });

    //社区向右点击
    $("#zy_community_next").click(function(){
        ZY.controllerManager.nextPage($("#zy_community_contain"),ZY.config.articleWidths.communityWidth,
            ZY.config.categoryIds.communityId,ZY.dataManager.lastCommunityDate);

    });

    //社区向左点击
    $("#zy_community_prev").click(function(){
        ZY.controllerManager.prevPage($("#zy_community_contain"),
            ZY.config.articleWidths.communityWidth,ZY.config.categoryIds.communityId);
    });

    //显示单篇文章
    $(document).on("click","li[data-zy-post-type^=zy],div[data-zy-post-type^=zy],h2[data-zy-post-type^=zy]",function(){
        ZY.dataManager.currentPostId=$(this).data("zy-post-id");
        ZY.uiManager.showArticle(ZY.dataManager.currentPostId);
    });

    //显示单篇文章时的横向滚动
    ZY.controllerManager.bindHScroll($("#zy_article_content")[0]);

    //收回单篇文章展示
    $("#zy_article_content_close").click(function(){
        ZY.uiManager.hideArticle();
    });

    //显示视频或者大图
    $(document).on("click","#zy_article_content a",function(){
        var url="";
        var elementA=$(this);
        if(elementA.hasClass("videoslide")){
            url=ZY.config.siteurl+"/show_media/"+ZY.dataManager.currentPostId+"/"+elementA.find("img").data("zy-media-id");
            ZY.uiManager.showVideoDetail(url);
            return false;
        }else if(elementA.find("img")){
            url=elementA.attr("href");
            ZY.uiManager.showImageDetail(url);
            return false;
        }else{
            window.open(elementA.attr("href"))
        }
    });

    //关闭显示视频或者大图
    $("#zy_show_close").click(function(){
        ZY.uiManager.hideDetail();
    });

    //提示窗口关闭按钮
    $("#zy_popout_close").click(function(){
        ZY.uiManager.hidePopOut();
    });


    //window 放大缩小事件
    $(window).resize(function(){
        ZY.controllerManager.windowResizeHandler();
    });

    //window滚动事件
    $(window).scroll(function(){
        ZY.controllerManager.scrollingHandler();
    });

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
    $(window).trigger("scroll");

    //window 设置滚动速度
    ZY.controllerManager.setWheelScrollSpeed();

	/*=====iOS触屏滚动支持=================*/
	if(ZY.config.deviceCode.iOS){
		$(".zy_article_content").addClass("zy_touch_hscroll");
		$("#zy_landscape_list_container").addClass("zy_touch_hscroll");
		$("#zy_people_list_container").addClass("zy_touch_hscroll");
		$("#zy_artifact_list_container").addClass("zy_touch_hscroll");
		$("#zy_community_list_container").addClass("zy_touch_hscroll");		
	}
});