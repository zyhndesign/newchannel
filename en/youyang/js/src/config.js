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
        programId:39,  //每个分类的id
        peopleId:35,
        landscapeId:36,
        communityId:34,
        artifactId:33
    },
    articleWidths:{
        peopleWidth:240, //每个分类的li的宽度
        landscapeWidth:320,
        communityWidth:240,
        artifactWidth:320
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

