var ZY=ZY||{};ZY.uiManager=function(){return{scrollToTarget:function(n){var e=n.offset().top;void 0!=e&&(TweenLite.killTweensOf(window),TweenLite.to(window,1,{scrollTo:{y:e+1,x:0}}))},showFeaturePosts:function(n){var e=$("#zy_featured_articles_tpl").html(),o=juicer(e,{top_posts:n});$("#zy_featured_articles").html(o)},updateSectionBg:function(n,e){null!==n.background&&("mp4"!=n.background.type?e.append($("<img class='zy_theme_bg_content' src='"+n.background.filepath+"' onload='ZY.uiManager.fadingIn(this)' />")):ZY.config.deviceCode.iOS||e.append($("<video class='zy_theme_bg_content' autoplay loop muted oncanplay='ZY.uiManager.fadingIn(this)'><source src='"+n.background.filepath+"' type='video/mp4' /></video>")))},fadingIn:function(n){$(n).css("opacity",1)},showLoadingSpinner:function(n){var e=$("#zy_spinner_tpl").html();n.find(".zy_loading_spinner").length<=0&&n.append($(e))},hideLoadingSpinner:function(n){n.find(".zy_loading_spinner").remove()},showArticle:function(n){var e=this;$("#zy_article_content").find("article").remove(),e.showBlackout(ZY.config.defaultWrapZindex),$("body").addClass("zy_noscroll"),$("#zy_article_container").animate({left:"0%"},300,function(){e.showLoadingSpinner($("#zy_article_content")),ZY.dataManager.getPostDetail(n)})},hideArticle:function(){var n=this;n.hideLoadingSpinner($("#zy_article_content")),$("body").removeClass("zy_noscroll"),$("#zy_article_container").animate({left:"100%"},300,function(){n.hideBlackout()})},showBlackout:function(n){var e=$("#zy_wrap");e.css("z-index",n),e.hasClass("zy_hidden")&&e.removeClass("zy_hidden")},hideBlackout:function(){var n=$("#zy_wrap");n.hasClass("zy_hidden")||(n.addClass("zy_hidden"),n.css("z-index",ZY.config.defaultWrapZindex))},showArticleDetail:function(n){var e=$("#zy_show_detail_tpl").html(),o=juicer(e,n),i=$("#zy_article_content");i.append(o),ZY.uiManager.hideLoadingSpinner(i)},showVideoDetail:function(n){var e=this,o=$("#zy_show_load_container");o.html(""),e.showBlackout(9998),$("#zy_show_section").removeClass("zy_hidden"),o.load(n,function(n,o,i){e.hideLoadingSpinner($("#zy_article_content")),"error"==o&&e.showPopOut(ZY.config.errorCode.connectionError+i.status+" "+i.statusText,!1)})},showImageDetail:function(n){this.showBlackout(9998),$("#zy_show_section").removeClass("zy_hidden"),$("#zy_show_load_container").html("<img src='"+n+"'>")},hideDetail:function(){this.showBlackout(ZY.config.defaultWrapZindex),$("#zy_show_section").addClass("zy_hidden"),$("#zy_show_load_container").html("")},showPopOut:function(n,e){var o=$("#zy_popout_win");o.removeClass("zy_hidden").find(".zy_popout_title").html(n),e&&this.showBlackout(9999)},hidePopOut:function(){$("#zy_popout_win").addClass("zy_hidden")}}}();