var ZY=ZY||{};ZY.music={musicPlaying:!1,musicLiLength:0,setMusicList:function(i){var s=$("#zy_music_tpl").html(),t=juicer(s,{musics:i});$("#zy_music_list").html(t),$("#zy_music_audio").attr("src",i[0].music_path),$("#zy_music_title").html(i[0].music_title),this.musicLiLength=i.length},musicControlHandler:function(){if(0!=this.musicLiLength){var i=$("#zy_music_control");i.hasClass("zy_music_play")?this.musicPlay():i.hasClass("zy_music_pause")&&this.musicPause()}},musicEdgePlay:function(){AdobeEdge.getComposition("EDGE-4537676").getStage().getSymbol("music_ant").play("start"),AdobeEdge.getComposition("EDGE-4537676").getStage().$("music_horizon2").fadeOut(.5),AdobeEdge.getComposition("EDGE-4537676").getStage().$("music_horizon1").fadeOut(.5)},musicEdgeStop:function(){AdobeEdge.getComposition("EDGE-4537676").getStage().getSymbol("music_ant").playReverse("end"),AdobeEdge.getComposition("EDGE-4537676").getStage().$("music_horizon2").fadeIn(.5),AdobeEdge.getComposition("EDGE-4537676").getStage().$("music_horizon1").fadeIn(.5)},musicPlay:function(){var i=$("#zy_music_audio");i[0].play(),$("#zy_music_show").addClass("zy_music_show_play"),$("#zy_music_control").addClass("zy_music_pause").removeClass("zy_music_play"),i.attr("autoplay","autoplay"),this.musicPlaying=!0,this.musicEdgePlay()},musicPause:function(){var i=$("#zy_music_audio");i[0].pause(),$("#zy_music_show").removeClass("zy_music_show_play"),$("#zy_music_control").removeClass("zy_music_pause").addClass("zy_music_play"),i.attr("autoplay",!1),this.musicPlaying=!1,this.musicEdgeStop()},musicPrev:function(){if(0!=this.musicLiLength){$("#zy_music_timeline").stop().width("0%");var i=$(".active_music"),s=$("#zy_music_audio"),t=0!=i.prev().length?i.prev():$("#zy_music_list li:last");i.removeClass("active_music"),s.attr("src",t.html()),$("#zy_music_author").html(t.data("music-author")),$("#zy_music_title").html(t.data("music-title")),t.addClass("active_music")}},musicNext:function(){if(0!=this.musicLiLength){$("#zy_music_timeline").stop().width("0%");var i=$(".active_music"),s=$("#zy_music_audio"),t=0!=i.next().length?i.next():$("#zy_music_list li:first");i.removeClass("active_music"),s.attr("src",t.html()),$("#zy_music_author").html(t.data("music-author")),$("#zy_music_title").html(t.data("music-title")),t.addClass("active_music")}},musicEndHandler:function(){var i=this;$("#zy_music_audio")[0].addEventListener("ended",function(){i.musicNext()})},musicTimeLine:function(){$("#zy_music_audio")[0].addEventListener("timeupdate",function(){var i=$(this)[0],s=i.duration,t=i.currentTime;$("#zy_music_timeline").css("width",t/s*100+"%")})}};