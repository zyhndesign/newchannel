/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:59
 * config file,contains some static data,these data ara not change by procedure code but artificial change
 * */
var ZY=ZY||{};

ZY.config={
    ajaxurl:"http://www.comdesignlab.com/travel/wp-admin/admin-ajax.php",
    siteurl:"http://www.comdesignlab.com/travel",
    categoryIds:{
        tdId:37,  //每个分类的id
        sectionOneId:23, //风景
        sectionTwoId:24,  //人文
        sectionThreeId:25, //物语
        sectionFourId:28 //社区
    },
    articleWidths:{
        sectionOneWidth:320,//每个分类的li的宽度
        sectionTwoWidth:240,
        sectionThreeWidth:205,
        sectionFourWidth:240
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
	},
    defaultWrapZindex:9996 //遮挡层的默认z-index
};
Object.freeze(ZY.config);

