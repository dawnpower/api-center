var express = require('express');
var router = express.Router();
var datamain = require('./modules/datamain'); 
var projectName,appName,aid;
var pros = [];
var recentappid = 1;
/* GET home page. */
router.get('/', function(req, res, next) {
	p(req.body);	
	var projects=[];
	prosqlquery = "select * from project";
	datamain.querySql(prosqlquery,function(data){
		//p("print projects!!!"+data[0].name);
		projects = data;
		p("print the projects.length:"+projects.length);
		var j=0;
		var projectsIndex = [];
		for(var k=0;k<projects.length;k++){
			projectsIndex[projects[k].id] =k;
			projects[k].flag = false;
			//projectsIndex[projects[k].id] = projects[k];
		}
		for(i=0;i<projects.length;i++){
                sqlquery2="select * from application where projectid='"+projects[i].id+"'";
                p(sqlquery2);
                datamain.querySql(sqlquery2,function(data){
			p(sqlquery2);
			if(data[0]!=undefined)
			{	
			p("applications:"+JSON.stringify(data));
			index = data[0].projectid;
			//projectsIndex[index].application = data;
			var temp= projectsIndex[index];
			projects[temp].application = data;
			//p("projects:!!!"+JSON.stringify(projects));	
			projects[temp].flag = true;
			}
			j++;
			if(j==projects.length){
				res.render('index',{projects:projects});
				pros = projects;
				p("projects"+JSON.stringify(projects));
				};
			
                	});
		};
	});
});

router.post('/project/add_y',function(req,res){
	p("print the app name:"+req.body.y_name);
	p("print the add app id:"+req.body.propid);
	var appname = req.body.y_name;
	var propid = req.body.propid;
	sqlquery = "insert into application (name,projectid) values ('"+appname+"','"+propid+"')";
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		p("print the data:"+data);
		res.send(true);
	});	
});

router.post('/project/add_p',function(req,res){
	p("print the project name:"+req.body.p_name);	
	var proname = req.body.p_name;
	sqlquery = "insert into project (name) values ('"+proname+"')";
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		p("print the data:"+data);
		res.send(true);
	});
});

router.post('/project/rename',function(req,res){
	p("print the project name:"+req.body.p_name);
	var proname = req.body.p_name;
	var propid = req.body.propid;
	sqlquery = "update project set name='"+proname+"' where id='"+propid+"'";
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		p("print the proname data:"+data);
		res.send(proname);
	});
})

router.post('/project/delete',function(req,res){
	sqlquery = "delete from project where id ="+req.body._pid;
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		res.send(true);
	})
})

router.post('/project/apidelete',function(req,res){
	sqlquery = "delete from interface where id ="+req.body.id;
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		res.send(true);
	})
})

router.post('/project/in_push',function(req,res){
	p("hello worldddddddd");
	var in_name=req.body.in_name;
	 var  in_url = req.body.in_url;
	 var    in_method = req.body.in_method;
	 var    in_desc = req.body.in_describe;
	 var    tag_name =JSON.parse(req.body.tag_name);
	 var tag_remark = JSON.parse(req.body.tag_remark);
	var APP_id = req.body.a_id;
	var api_id = req.body.i_id;
	recentappid = APP_id;
	updatequery = "update mark set record ='"+recentappid+"' where id='1'";
	datamain.querySql(updatequery,function(data){
		p("update mark record successful!");	
	});
	p("print the api_id:"+api_id);
	if(api_id != undefined)
	{
	sqlupdate = "update interface set name='"+in_name+"',url='"+in_url+"',method='"+in_method+"',miaoshu='"+in_desc+"',tagname='"+tag_name+"',tagremark='"+tag_remark+"' where id='"+api_id+"'";
	p(sqlupdate);
	datamain.querySql(sqlupdate,function(data){
		res.send(true);	
	});
	}else{
	sqlquery = "insert into interface (name,url,method,miaoshu,tagname,tagremark,appid) values ('"+in_name+"','"+in_url+"','"+in_method+"','"+in_desc+"','"+tag_name+"','"+tag_remark+"','"+APP_id+"')";
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		res.send(true);
	});
	}
	sqlquery1 = "insert into property (name,remark) values ('"+tag_name[0]+"','"+tag_remark[0]+"')";
	p(sqlquery1);
	datamain.querySql(sqlquery1,function(data){
		//res.send(true);
	});
})

router.post('/getApplication-info',function(req,res){
	var appid = req.body._aId;
	interfaces = [];
	sqlquery = "select * from interface where appid='"+appid+"'";
	p(sqlquery);
	datamain.querySql(sqlquery,function(data){
		interfaces = data;
		p("print the interfaces info:"+JSON.stringify(interfaces));
		p(interfaces.length);
		res.send(data);	
	});
})

router.post('/project/getNew',function(req,res){
	var postdata = {};
	var proid,proname,appname;
	p("print the getNew data:"+postdata);
	sqlquery0 = "select * from mark";
	datamain.querySql(sqlquery0,function(data){
		recentappid = data[0].record;
	sqlquery ="select * from application where id=('"+recentappid+"')";
	datamain.querySql(sqlquery,function(data){
		p(data);
		p(sqlquery);
		if(data[0]!=undefined){
		proid = data[0].projectid;
		appname = data[0].name;
		postdata.appName = appname;
		postdata.aid = recentappid;
		postdata.pid = proid;
		sqlquery1 = "select * from project where id=('"+proid+"')";
		datamain.querySql(sqlquery1,function(data){
			p(sqlquery1);
			p(data);
			proname = data[0].name;
			postdata.projectName = proname;
			p(postdata);
			res.send(postdata);
			p("print the getNew data over!!!");
		});
		}
		else{
			recentappid = 1;
			sqlquery0 = "select * from application";
			datamain.querySql(sqlquery0,function(data){
				recentappid = data[0].id;	
			sqlquery ="select * from application where id=('"+recentappid+"')";
			datamain.querySql(sqlquery,function(data){
			
		proid = data[0].projectid;
		appname = data[0].name;
		postdata.appName = appname;
		postdata.aid = recentappid;
		postdata.pid = proid;
		sqlquery1 = "select * from project where id=('"+proid+"')";
		datamain.querySql(sqlquery1,function(data){
			p(sqlquery1);
			p(data);
			proname = data[0].name;
			postdata.projectName = proname;
			p(postdata);
			res.send(postdata);
			p("print the getNew data over!!!");
				});
			})
			})
		}
	});
	//datas = "hello";
	});
})

router.post('/project/delete_y',function(req,res){
	var appid = req.body._aId
	sqlquery = "delete from application where id =('"+appid+"')";
	sqlquery1 = "delete from interface where appid =('"+appid+"')";
	datamain.querySql(sqlquery,function(data){
	//	res.send(true);
		datamain.querySql(sqlquery1,function(data){
		res.send(true);
			})
	});
})

function p(cont){
	console.log(cont);
}
module.exports = router;
