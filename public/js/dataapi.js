var data_Pchild = $('.p-child li'),
	in_describe = $('.in-describe'),
	str = "<div class='menu-in pa'><p>新增应用</p><p>重命名</p><p>删除项目</p></div>",
	defaultList = '<div class="api-box pr"><div class="in-list"><input class="in-name" type="text" placeholder="接口名字"/></div><div class="in-list"><input class="in-url" type="text" placeholder="接口地址"/><select class="in-method ml20"><option value="post">POST</option><option value="get">GET</option></select></div><div class="in-list"><textarea class="in-describe" placeholder="接口描述"></textarea></div>',
	defaultTag = '<div class="in-tags pl30"><div class="tags-list"><input class="tag-name mr5" type="text" placeholder="字段名" /><input class="tag-remark" type="text" placeholder="备注"/><div style="clear:right" class="tag-play mr100 fr"><button class="btn f12 tag-add" onclick="tagDelete(this)">删除</button><button class="btn f12 tag-add" onclick="tagAdd(this)">新增</button></div></div></div>',
	defaultSubmit = '<div class="api-push mt50 bc"><button class="btn in-push">提交</button></div><div class="api-delete-box tc pa unselectable"><em class="api-delete f20" onclick="apiDelete(this)">X</em></div></div>';

// 第一次刷新时数据
getNewData();

showMenu();

// 新增项目
$('#add').on('click',function (){
	$.msgBox('请输入项目名',function (){
		$.post('/project/add_p',{ 'p_name':_msgTxt },function (e){
			if(e){
				var _node = "<div class='p-parent mb20'><p class='p-title unselectable t-el'>"+ _msgTxt +"</p><ul class='p-child'></ul></div>";
				$('.project-list').append(_node);
				showMenu();
				location.href="/";
			}
		});
	});
});

// 右键菜单
function showMenu(){

	// 取消鼠标右键默认事件
	$('.p-title').on('contextmenu',function (){
		return false;
	});

	// 创建新的鼠标右键事件
	$('.p-title').on('mousedown',function (e){
		var _this = $(this);

		// 判断是否为鼠标右键
		if(e.which == 3){
			$('body').append(str);
			var x = e.clientX,
				y = e.clientY+$(window).scrollTop(),
				menu = $('.menu-in'),
				list = menu.find('p'),
				_add = list.eq(0),
				_rename = list.eq(1),
				_delete = list.eq(2);

			menu.css({
				left: x,
				top: y
			});

			// 新增应用
			_add.on('click',function (){
				var _pid = _this.attr('data-pId');
				$.msgBox('请输入应用名',function (){
					$.post('/project/add_y',{'y_name':_msgTxt,'propid':_pid},function (e){
						if(e){
							var _node = "<li class='unselectable'><a href='#'"+ _msgTxt +"</a></li>";
							_this.next().append(_node);
						}
						location.href="/";
					});
				});
			});

			// 删除项目
			_delete.on('click',function (){
				var _pid = _this.attr('data-pId');
				$.post('/project/delete',{'_pid': _pid},function (){
					if(e){
						_this.parent().remove();
						$.msgBox.mini('项目删除成功',800);
					}
				});
			});

			// 重命名项目
			_rename.on('click',function (){
				var _pid = _this.attr('data-pId');
				$.msgBox('请输入项目名',function (){
					$.post('/project/rename',{'propid':_pid,'p_name':_msgTxt},function (e){
						// do something
						_this.text(e);
						$.msgBox.mini('重命名成功',800);
					});
				});
			});
		}
	});
	
	// 点击项目名, 显示 / 隐藏应用
	$('.p-title').on('click',function(){
		var _next = $(this).next();
		if(_next.css('display') == 'block'){
			_next.hide();
		}else {
			_next.show();
		}
	});

	// 点击应用名, 加载应用数据并显示
	$('.a-title').on('click',function (){
		var _this = $(this),
			_aId = _this.attr('data-aid'),
			_pId = _this.parents('.p-parent').find('.p-title').attr('data-pid');
			projectName = _this.parent().parent().find('p').text();
			appName = _this.text(),
			in_nameList = $('.in-name');

		$('.in-add-box').siblings('div').remove();
		getData(projectName,appName,_aId,_pId);

	});
}

// 增加字段
function tagAdd(obj){
	var _this = $(obj);
	$(defaultTag).insertAfter(_this.parent().parent().parent());
}

$(document).on('click',function (){
	$('.menu-in').hide().remove();
});

// 新增接口
$('.in-add').on('click',function (){
	var newNode=defaultList+defaultTag+defaultSubmit;
	$('.api-wrap').append(newNode);
	inPush();
});

// 提交接口
function inPush(){
	$('.in-push').on('click',function (){
		var _this = $(this),
			a_id = $('.api-wrap').attr('data-aid'),
			_id = _this.parents('.api-box').attr('data-id'),
			Pbox = _this.parents('.api-box'),
			apiName = Pbox.find('.in-name').val(),
			apiUrl = Pbox.find('.in-url').val(),
			apiMethod = Pbox.find('.in-method').val(),
			apiDescribe = Pbox.find('.in-describe').val(),
			tagName = [],
			tagRemark = [],
			tagList = Pbox.find('.tags-list');
		
		for(var i=0;i<tagList.length;i++){
			tagName.push(tagList.eq(i).find('.tag-name').val());
			tagRemark.push(tagList.eq(i).find('.tag-remark').val());
		}

		$.post('/project/in_push',{
			'in_name': apiName,
			'in_url': apiUrl,
			'in_method': apiMethod,
			'in_describe': apiDescribe,
			'tag_name': JSON.stringify(tagName),
			'a_id': a_id,
			'i_id': _id,
			'tag_remark': JSON.stringify(tagRemark)
		},function (e){
			if(e){
				$.msgBox.mini('提交成功',800);
			}
		});
	});
}

// 删除接口
function apiDelete(obj){
	var _this = $(obj),
		_Id = _this.parents('.api-box').attr('data-id');
	$.post('/project/apidelete',{ 'id': _Id },function (e){
		if(e){
			$.msgBox.mini('接口删除成功',800);
			_this.parents('.api-box').remove();
		}
	});
}

// 删除字段
function tagDelete(obj){
	$(obj).parents('.tags-list').remove();
}

// 删除应用
function appDelete(){
	$('.y-delete-box').on('click',function (){
		var _aId = $('.y-delete-box').parents('.y-title').find('.a-title').attr('data-aId');
		$.post('/project/delete_y',{ '_aId': _aId },function (e){
			if(e){
				$.msgBox.mini('应用删除成功',800,function (){
					location.href = "/";
				});
			}
		});
	});
}

// 获取数据
function getData(projectName,appName,aid,pid){
	var titleStr = ' <div class="y-title-wrap clearfix"><h2 class="y-title pb15 tc pr"><p data-pId="' + pid + '" class="unselectable pa f14">' + projectName + '</p><p data-aId="' + aid + '" class="a-title">' + appName + '</p><div class="y-delete-box hide pa mr10 unselectable"><em class="y-delete f20 tc fn">X</em></div></h2></div><div class="api-wrap" data-aId="' + aid + '"> ',
		mainStr = '',
		listStr = '',
		tagsNameList,
		tagremarkList;

	$.post('/getApplication-info',{ '_aId': aid },function(e){
		if(e){
			for(var i=0,len=e.length;i<len;i++){
				var _post = [],
					_get = [];

				if(e[i].method == 'post'){
					_post[i] = 'selected';
				}else {
					_post[i] = '';
				}
				if(e[i].method == 'get'){
					_get[i] = 'selected';
				}else {
					_get[i] = '';
				}
				listStr += "<div class='api-box pr' data-id='" + e[i].id + "'><div class='in-list'><input class='in-name' type='text' value='" + e[i].name + "' /></div><div class='in-list'><input class='in-url' type='text' value='" + e[i].url + "' placeholder='接口地址' /><select class='in-method ml20'><option " + _post[i] + " value='post'>POST</option><option " + _get[i] + " value='get'>GET</option></select></div><div class='in-list'><textarea class='in-describe' placeholder='接口描述'>" + e[i].miaoshu + "</textarea></div>";
				if(e[i].tagname && e[i].tagremark){
					tagsNameList = e[i].tagname.split(',');
					tagremarkList = e[i].tagremark.split(',');
					for(var j=0,jlen=tagsNameList.length;j<jlen;j++){
						listStr += '<div class="in-tags pl30"><div class="tags-list"><input class="tag-name mr5" type="text" placeholder="字段名" value="' + tagsNameList[j] + '"/><input class="tag-remark" type="text" placeholder="备注" value="' + tagremarkList[j] + '"/><div style="clear:right" class="tag-play mr100 fr"><button class="btn f12 tag-add" onclick="tagDelete(this)">删除</button><button class="btn f12 tag-add" onclick="tagAdd(this)">新增</button></div></div></div>';
					}
				}else{
					listStr += defaultTag;
				}
				listStr += defaultSubmit;
			}
		}else{
			listSrc = '无数据';
		}
		mainStr = titleStr+listStr;
		$(mainStr).insertBefore('.in-add-box');
		inPush();
		appDelete();
	});
}

// 刷新页面加载数据
function getNewData(){
	$.post('/project/getNew',{},function (e){
		if(e){
			var newProjectName = e.projectName,
				newAppName = e.appName,
				newAid = e.aid,
				newPid = e.pid;
			
			getData(newProjectName, newAppName, newAid, newPid);
		}
	});
}
