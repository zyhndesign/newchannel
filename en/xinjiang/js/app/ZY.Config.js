var ZY=ZY||{};

ZY.Config=function(){
	return {		  
        ajaxurl:"http://www.comdesignlab.com/travel/wp-admin/admin-ajax.php",
        siteurl:"http://www.comdesignlab.com/travel",
        categoryIds:{
            programId:38,  //每个分类的id
            sectionOneId:32, //风景
            sectionTwoId:31,  //人文
            sectionThreeId:30, //物语
            sectionFourId:29 //社区
        },
        articleWidths:{
            sectionOneWidth:240,//每个分类的li的宽度
            sectionTwoWidth:340,
            sectionThreeWidth:400,
            sectionFourWidth:340
        },
        errorCode:{
            connectionError:"NetWork Error!", //错误提示信息
            musicError:"Get Music Data Error!",
            hasNoMusic:"No Music!",
            postsError:"Get Post Data Error!",
            articleError:"Get Post Detail Error!。"
        },
        deviceCode:{
            iOS : navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false
        }
    }
}();