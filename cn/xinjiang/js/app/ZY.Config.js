var ZY=ZY||{};

ZY.Config=function(){
	return {		  
			ajaxurl:"http://www.comdesignlab.com/travel/wp-admin/admin-ajax.php",
			siteurl:"http://www.comdesignlab.com/travel",
			errorCode:{
				connectionError:"无法连接到服务器。",
				musicError:"无法从服务器获取音乐。",
                hasNoMusic:"没有上传音乐",
				postsError:"无法从服务器获取文章摘要。",
				articleError:"无法从服务器获取文章详情。"
            },
			deviceCode:{
				iOS : navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false
            }
    }
}();