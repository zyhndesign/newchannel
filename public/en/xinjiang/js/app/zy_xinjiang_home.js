$(document).ready(function(){var t=0;!function(){$.ajax({url:ZY.Config.ajaxurl,type:"post",data:{action:"zy_get_top_posts",programId:ZY.Config.categoryIds.programId},success:function(t){if(t.success){if(0!=t.data.length){var a=t.data;ZY.DataManager.top_post_id=a[0].post_id;var e=$("#zy_top_post_tpl").html(),n=juicer(e,{top_posts:a});$("#zy_top_post_heading").html(n),ZY.UIManager.updateSectionBG(a[0],$("#zy_top_post_poster"));var i=$("#zy_featured_articles_tpl").html(),o=juicer(i,{top_posts:a});$("#zy_featured_articles").html(o)}}else ZY.UIManager.popOutMsg(ZY.Config.errorCode.postsError)},error:function(){ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)}})}(),function(){$.ajax({url:ZY.Config.ajaxurl,type:"post",data:{action:"zy_get_music",programId:1},success:function(t){if(t.success)if(0!=t.data.length){var a=t.data,e=$("#zy_music_tpl").html(),n=juicer(e,{musics:a});$("#zy_music_list").html(n),$("#zy_music_audio").attr("src",a[0].music_path),$("#zy_music_author").html("Directed by "+a[0].music_author),$("#zy_music_title").html(a[0].music_title),ZY.UIManager.musicLiLength=a.length}else $("#zy_music_title").text(ZY.Config.errorCode.hasNoMusic);else ZY.UIManager.popOutMsg(ZY.Config.errorCode.musicError)},error:function(){ZY.UIManager.popOutMsg(ZY.Config.errorCode.connectionError)}})}(),$("#zy_top_nav a,#zy_nav a").click(function(){var t=$(this).attr("href");return ZY.UIManager.scrollToTarget(t),!1}),$("#zy_logo a").click(function(){return ZY.UIManager.scrollToTarget("#zy_top_post"),!1}),ZY.UIManager.bindHScrollOnWheel($("#zy_article_content")[0]),ZY.Config.deviceCode.iOS&&($(".zy_article_content").addClass("zy_touch_hscroll"),$("#zy_landscape_list_container").addClass("zy_touch_hscroll"),$("#zy_people_list_container").addClass("zy_touch_hscroll"),$("#zy_artifact_list_container").addClass("zy_touch_hscroll"),$("#zy_community_list_container").addClass("zy_touch_hscroll")),$(document).on("click","#zy_top_post_title",function(){t=$(this).data("zy-post-id");var a=$(this).data("zy-post-type");ZY.UIManager.showArticle(t,a)}),ZY.UIManager.initMusicPlayer(),ZY.DataManager.add_hover_event($("#zy_landscape_contain"),$("#zy_landscape_list"),$("#zy_landscape_prev"),$("#zy_landscape_next")),ZY.DataManager.add_hover_event($("#zy_people_contain"),$("#zy_people_list"),$("#zy_people_prev"),$("#zy_people_next")),ZY.DataManager.add_hover_event($("#zy_artifact_contain"),$("#zy_artifact_list"),$("#zy_artifact_prev"),$("#zy_artifact_next")),ZY.DataManager.add_hover_event($("#zy_community_contain"),$("#zy_community_list"),$("#zy_community_prev"),$("#zy_community_next")),$("#zy_landscape_next").click(function(){ZY.DataManager.show_next_animate($("#zy_landscape_contain"),ZY.Config.articleWidths.sectionOneWidth,ZY.Config.categoryIds.sectionOneId,ZY.DataManager.lastLandscapeDate)}),$("#zy_landscape_prev").click(function(){ZY.DataManager.show_prev_animate($("#zy_landscape_contain"),ZY.Config.articleWidths.sectionOneWidth,ZY.Config.categoryIds.sectionOneId)}),$("#zy_people_next").click(function(){ZY.DataManager.show_next_animate($("#zy_people_contain"),ZY.Config.articleWidths.sectionTwoWidth,ZY.Config.categoryIds.sectionTwoId,ZY.DataManager.lastPeopleDate)}),$("#zy_people_prev").click(function(){ZY.DataManager.show_prev_animate($("#zy_people_contain"),ZY.Config.articleWidths.sectionTwoWidth,ZY.Config.categoryIds.sectionTwoId)}),$("#zy_artifact_next").click(function(){ZY.DataManager.show_next_animate($("#zy_artifact_contain"),ZY.Config.articleWidths.sectionThreeWidth,ZY.Config.categoryIds.sectionThreeId,ZY.DataManager.lastArtifactDate)}),$("#zy_artifact_prev").click(function(){ZY.DataManager.show_prev_animate($("#zy_artifact_contain"),ZY.Config.articleWidths.sectionThreeWidth,ZY.Config.categoryIds.sectionThreeId)}),$("#zy_community_next").click(function(){ZY.DataManager.show_next_animate($("#zy_community_contain"),ZY.Config.articleWidths.sectionFourWidth,ZY.Config.categoryIds.sectionFourId,ZY.DataManager.lastCommunityDate)}),$("#zy_community_prev").click(function(){ZY.DataManager.show_prev_animate($("#zy_community_contain"),ZY.Config.articleWidths.sectionFourWidth,ZY.Config.categoryIds.sectionFourId)}),$("#zy_show_close").click(function(){ZY.UIManager.hideDetail()}),ZY.UIManager.popOutInit(),$(document).on("click","li[data-zy-post-type^=zy]",function(){t=$(this).data("zy-post-id");var a=$(this).data("zy-post-type");ZY.UIManager.showArticle(t,a)}),$("#zy_article_content_close").click(function(){ZY.UIManager.hideArticle()}),$(document).on("click","#zy_article_content a",function(){var a,e=$(this);return e.hasClass("videoslide")?(a=ZY.Config.siteurl+"/show_media/"+t+"/"+e.find("img").data("zy-media-id"),ZY.UIManager.showVideoDetail(a),!1):e.find("img")?(a=e.attr("href"),ZY.UIManager.showImageDetail(a),!1):void window.open(e.attr("href"))}),$(window).on("scroll",function(){ZY.UIManager.scrollingHandler()}),$(window).trigger("scroll");var a=null;$(window).resize(function(){a&&clearTimeout(a),a=setTimeout(function(){ZY.UIManager.doResizeOfCategory($("#zy_people_contain"),ZY.Config.articleWidths.sectionTwoWidth,ZY.DataManager.peopleLoaded),ZY.UIManager.doResizeOfCategory($("#zy_landscape_contain"),ZY.Config.articleWidths.sectionOneWidth,ZY.DataManager.landscapeLoaded),ZY.UIManager.doResizeOfCategory($("#zy_community_contain"),ZY.Config.articleWidths.sectionFourWidth,ZY.DataManager.communityLoaded),ZY.UIManager.doResizeOfCategory($("#zy_artifact_contain"),ZY.Config.articleWidths.sectionThreeWidth,ZY.DataManager.artifactLoaded)},200)})});