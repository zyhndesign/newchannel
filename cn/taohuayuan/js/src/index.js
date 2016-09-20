/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){

    //菜单点击事件
    $("#zy_menu a").click(function(){
        $("#zy_menu a").removeClass("active");
        $(this).addClass("active");
        var target=$(this).attr("href");
        ZY.uiManager.scrollToTarget($(target));
        return false;
    });

    //获取封面故事和推荐文章
    ZY.dataManager.getTopPosts();
    

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

    //window滚动事件,加载数据在这里面实现
    $(window).scroll(function(){
        ZY.controllerManager.scrollingHandler();
    });

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
    $(window).trigger("scroll");

    //window 设置滚动速度
    ZY.controllerManager.setWheelScrollSpeed();

});