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
        programId:6,  //每个分类的id
        peopleId:7,
        landscapeId:10,
        communityId:9,
        artifactId:8
    },
    articleWidths:{
        peopleWidth:240, //每个分类的li的宽度
        landscapeWidth:320,
        communityWidth:240,
        artifactWidth:320
    },
    errorCode:{
        connectionError:"无法连接到服务器。", //错误提示信息
        musicError:"无法从服务器获取音乐。",
        hasNoMusic:"没有上传音乐",
        postsError:"无法从服务器获取文章摘要。",
        articleError:"无法从服务器获取文章详情。"
    },
	deviceCode:{
		iOS : navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false
	},
    defaultWrapZindex:9996 //遮挡层的默认z-index
};
Object.freeze(ZY.config);

