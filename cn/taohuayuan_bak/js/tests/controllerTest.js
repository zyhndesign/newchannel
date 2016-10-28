/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-28
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */
(function(){
    module("controller",{
        setup:function(){
           this.posts=[
               {
                   post_date:"2013-08-23",
                   background:null,
                   post_title:"ssss",
                   post_excerpt:"dddd",
                   post_mime_type:"zyslide",
                   post_id:1,
                   thumb:"http://localhot/dddd.jpg"
               },
               {
                   post_date:"2012-03-23",
                   background:null,
                   post_title:"ssss",
                   post_excerpt:"dddd",
                   post_mime_type:"zyslide",
                   post_id:2,
                   thumb:"http://localhot/dddd.jpg"
               },
               {
                   post_date:"2012-03-23",
                   background:null,
                   post_title:"ssss",
                   post_excerpt:"dddd",
                   post_mime_type:"zyslide",
                   post_id:2,
                   thumb:"http://localhot/dddd.jpg"
               }
           ];

        },
        teardown:function(){

        }
    });

    test("splitPostDate",function(){
        var date="2013-08-12";
        var array=ZY.controllerManager.splitPostDate(date);

        equal(array.length,2,"return a array of 2 elements");
        equal(array[0],"12/08","test first elements is 12/08");
        equal(array[1],"2013","test second elements is 2013");
    });

    test("transformDatas",function(){
        var array=ZY.controllerManager.transformDatas(this.posts);
        equal(array[0]["post_month"],"23/08","test month");
        equal(array[0]["post_year"],"2013","test year");
    });

    test("setLoadLimit",function(){
        var limit=ZY.controllerManager.setLoadLimit({
            targetContain:$(".zy_contain"),
            isFirst:true,
            width:240,
            categoryId:2
        });

        equal(limit,15,"fullscreen limit is 15");
        equal($(".zy_list_container").width(),1200,"test set width 1200");
        equal($(".zy_contain_next").hasClass("zy_disable"),true,"zy_disable class is added");
    });

    test("doResponse",function(){

        //有多个分类，写一个函数进行测试
        function testEveryCategory(args){
            var contain=$(".zy_contain");
            var list=$(".zy_contain_list");
            var type=args.type;

            if(type=="people"){
                list.attr("id","zy_people_list");
            }else if(type=="landscape"){
                list.attr("id","zy_landscape_list");
            }else if(type=="artifact"){
                list.attr("id","zy_artifact_list");
            }else if(type=="community"){
                list.attr("id","zy_community_list");
            }


            args.targetContain=contain;
            args.limit= ZY.controllerManager.setLoadLimit(args);
            ZY.controllerManager.doResponse(args);

            var next=contain.find(".zy_contain_next");
            equal(next.hasClass("zy_no_more"),true,type+" zy_no_more class is added");
            equal(next.hasClass("zy_disable"),true,type+" zy_disable class is not removed");

            if(type=="people"){
                equal(list.find("li.zy_people_article").length,3,type+" right count li");
            }else if(type=="landscape"){
                equal(list.find("li.zy_landscape_article").length,2,type+" right count li");
            }else if(type=="artifact"){
                equal(list.find("li.zy_artifact_article").length,2,type+" right count li");
            }else if(type=="community"){
                equal(list.find("li.zy_community_article").length,3,type+" right count li");
            }


            QUnit.reset();
        }

        testEveryCategory({
            type:"people",
            isFirst:true,
            width:240,
            categoryId:2,
            posts:this.posts
        });

        testEveryCategory({
            type:"landscape",
            isFirst:true,
            width:320,
            categoryId:3,
            posts:this.posts
        });

        testEveryCategory({
            type:"artifact",
            isFirst:true,
            width:200,
            categoryId:5,
            posts:this.posts
        });

        testEveryCategory({
            type:"community",
            isFirst:true,
            width:240,
            categoryId:4,
            posts:this.posts
        });

    });

    test("handlerLandscapePosts",function(){
        var array=ZY.controllerManager.handlerLandscapePosts(this.posts,3);
        var first=array[0];
        equal(array.length,2,"return array of 2 elements");
        equal(first.hasOwnProperty("top"),true,"first element has top property");
        equal(first.hasOwnProperty("bottom"),true,"first element has bottom property");
    });

    test("handlerArtifactPosts",function(){
        function testArtifact(obj){
            var array=ZY.controllerManager.handlerArtifactPosts(obj.posts,obj.length,obj.isFirst);
            var first=array[0];
            var second=array[1];
            equal(array.length,2,"return array of 2 elements");
            if(obj.isFirst){
                equal(first.hasOwnProperty("top"),false,"first element has no top property");
                equal(first.hasOwnProperty("bottom"),false,"first element has no bottom property");
            }else{
                equal(first.hasOwnProperty("top"),true,"first element has  top property");
                equal(first.hasOwnProperty("bottom"),true,"first element has  bottom property");
            }

            equal(second.hasOwnProperty("top"),true,"first element has  top property");
            equal(second.hasOwnProperty("bottom"),true,"first element has  bottom property");
        }

        testArtifact({
            posts:this.posts,
            length:3,
            isFirst:true
        });

        testArtifact({
            posts:this.posts,
            length:3,
            isFirst:false
        });

    });

    test("prevPage",function(){
         function testPrev(params){
             var list=$(".zy_contain_list");
             var limit=parseInt($("body").width()/params.width);
             var prev=$(".zy_contain_prev");
             var next=$(".zy_contain_next");

             for(var i=0;i<params.liNumber;i++){
                $("<li></li>").appendTo(list);
             }

             list.css("left",-params.left);


             ZY.controllerManager.prevPage(params.contain,params.width,params.categoryId);

             //由于使用animate这里需要使用等待测试
             stop();

             setTimeout(function(){
                 if(params.left<=limit*params.width){
                     equal(list.css("left"),"0px","left is 0");
                     equal(prev.hasClass("zy_disable"),true,"prev has zy_disable class");
                     if(params.liNumber==limit){
                         equal(next.hasClass("zy_disable"),true,"next has zy_disable class");
                     }
                 }else{
                     equal(next.hasClass("zy_disable"),false,"next has no zy_disable class");
                 }


                 start();

             },1000);
         }

        var contain=$(".zy_contain");
        testPrev({
            width:340,
            categoryId:2,
            liNumber:6,
            contain:contain,
            left:300
        });

        testPrev({
            width:340,
            categoryId:2,
            liNumber:3,
            contain:contain,
            left:300

        });

        testPrev({
            width:340,
            categoryId:2,
            liNumber:3,
            contain:contain,
            left:1000

        });
    });

})();