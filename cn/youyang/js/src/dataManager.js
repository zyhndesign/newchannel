/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 数据记录和获取模块
 */
var ZY=ZY||{};
ZY.dataManager = {
    topPostId:0, //记录下封面故事的文章id，用来判断不显示相同的背景视频
    lastPeopleDate:"",
    lastArtifactDate:"",
    lastCommunityDate:"",
    lastLandscapeDate:"",
    currentPostId:0, //点击文章聚合后显示的文章的id
    landscapeLoaded:false, //记录下是否加载，主要是用作滚动时加载的标志
    artifactLoaded:false,
    communityLoaded:false,
    peopleLoaded:false,
    resizeTimer:null,

    /**
     * 获取音乐
     */
    getMusic:function(){
        $.ajax({
            url:ZY.config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_music",
                programId:ZY.config.categoryIds.programId
            },
            success:function(response){
                if(response.success){
                    if(response.data.length!=0){
                        var musics=response.data;
                        ZY.music.setMusicList(musics);
                    }else{
                        $("#zy_music_title").text(ZY.config.errorCode.hasNoMusic);
                    }
                }else{
                    ZY.uiManager.showPopOut(ZY.config.errorCode.musicError,false);
                }
            },
            error: function(){
                ZY.uiManager.showPopOut(ZY.config.errorCode.connectionError,false);
            }
        });
    },

    /**
     * 获取顶部4篇文章
     */
    getTopPosts:function(){
        $.ajax({
            url:ZY.config.ajaxurl,
            type:"post",
            data:{
                action:"zy_get_top_posts",
                programId:ZY.config.categoryIds.programId
            },
            success:function(response){
                if(response.success){
                    if(response.data.length!=0){
                        var posts=response.data;
                        var length=posts.length;
                        var i=0;
                        //this.topPostId=posts[0]["post_id"];
                        //ZY.uiManager.showTopPost(posts);
                        //posts=ZY.controllerManager.transformDatas(posts);

                        //更新背景
                        for(;i<length;i++){
                            if(posts[i]["background"]!==null){
                                ZY.uiManager.updateSectionBg(posts[0],$("#zy_top_post_poster"));
                                break;
                            }
                        }

                        ZY.uiManager.showFeaturePosts(posts);
                    }
                }else{
                    //提示
                    ZY.uiManager.showPopOut(ZY.config.errorCode.postsError,false)
                }
            },
            error:function(){
                ZY.uiManager.showPopOut(ZY.config.errorCode.connectionError,false)
            }
        });
    },

    /**
     * 获取分类文章
     * @param {Object} args 参数数组
     * @param {Object} args.targetContain 包括上一页和下一页按钮的容器元素jquery对象
     * @param {String} args.lastdate   已经请求了的最后一篇文章的时间
     * @param {Number} args.categoryId 分类id
     * @param {Number} args.width 每个li的宽度
     * @param {Boolean} args.isFirst   是否第一次请求
     */
    getCategoryPosts:function(args){
        var limit=ZY.controllerManager.setLoadLimit({
            targetContain:args.targetContain,
            width:args.width,
            categoryId:args.categoryId,
            isFirst:args.isFirst
        });

        //请求数据ajax
        $.ajax({
            url:ZY.config.ajaxurl,//ajaxurl为页面刷出来的全局变量
            type:"post",
            data:{
                limit:limit,
                lastDate:args.lastDate,
                categoryId:args.categoryId,
                action:"zy_get_posts"
            },
            success:function(response){

                //要保存数据，并且添加数据到html
                if(response.success){

                    //如果返回有数据
                    var posts=response.data;

                    //返回数据后的处理函数
                    ZY.controllerManager.doResponse({
                        targetContain:args["targetContain"],
                        posts:posts,
                        isFirst:args["isFirst"],
                        categoryId:args["categoryId"],
                        limit:limit
                    });

                }else{
                    //提示网络异常的错误
                    ZY.uiManager.showPopOut(ZY.config.errorCode.postsError,false)
                }

                ZY.uiManager.hideLoadingSpinner($(args.targetContain));

            },
            error:function(){
                //提示网络异常的错误
                ZY.uiManager.hideLoadingSpinner(args.targetContain);
                ZY.uiManager.showPopOut(ZY.config.errorCode.connectionError,false)
            }
        });
    },

    /**
     * 获取单篇文章详细信息
     * @param {Number} post_id 文章id
     */
    getPostDetail:function(post_id){
        $.ajax({
            url:ZY.config.ajaxurl,
            type:"post",
            data:{
                post_id:post_id,
                action:"zy_get_post_detail"
            },
            success:function(response){
                if(response.success){
                    ZY.uiManager.showArticleDetail(response.data);
                }else{

                    //提示报错
                    ZY.uiManager.showPopOut(ZY.config.errorCode.articleError,false)
                }
            },
            error:function(){
                ZY.uiManager.showPopOut(ZY.config.errorCode.connectionError,false)
            }
        });
    }
};