var manager = {//公用
    model: {
        idNum:0,
        data:[]
    },
    Append: function (refreshObj, aims, hrefSwitch, refreshData) {
        //this.refreshObj = refreshObj;
        var selfThis = this;
        if (aims) {
            aims.append(refreshObj.previewDom);
        }

        refreshObj.setupModel();

        refreshData && (refreshObj.model = refreshData);
        refreshObj.notifyModelChanged();
        var index = $(".phone-mn>.shortcut").index(aims);
        var model = this.model.data;
        model.splice(index, 0, refreshObj.model);

        refreshObj.previewDom.unbind('click').click(function () {
            
            $(this).addClass('editing').parent().siblings().children(".app_field").removeClass('editing');//左边选中
            $('.rt_edit_sider').find('.rt_sider_inner').remove();
            var _self = $(this);
            refreshObj &&
			(function () {
			    $('.rt_edit_sider').append(refreshObj.editorDom);
			    refreshObj.notifyModelChanged();
			    var aTop = _self.offset().top;
			    $('.rt_edit_sider').css({ 'margin-top': aTop })
			    refreshObj.newEdit && refreshObj.newEdit(refreshObj.model, index);//编辑器函数
			    hrefSwitch && (links(refreshObj))//触发链接函数

			}())//判断对象是否销毁
        });

        refreshObj.previewDom.on("click", ".delete", function () {
            var index = $(".phone-mn>li").index(aims);
            model.splice(index, 1);
            aims.remove();
            refreshObj = null;
        })//删除预览区元素，销毁对象

        refreshObj.previewDom.click();
    },
    pageHref: function (refreshObj, index, hrefDom, type) {
        var _self = { editDom: refreshObj.editorDom }, data = this.data.pageData;//因方法this指向问题，定义_self代替this；
        //<ul class="module-nav modal-tab"><li class="active"><a href="#js-module-feature" data-type="feature" class="js-modal-tab">微页面</a> |</li><li><a href="#js-module-category" data-type="category" class="js-modal-tab">微页面分类</a> |</li><li class="link-group link-group-0" style="display:inline-block"><a href="/v2/showcase/feature#create" target="_blank" class="new_window">新建微页面</a></li><li class="link-group link-group-0" style="display:inline-block"><a href="/v2/showcase/feature#list&amp;is_display=0" target="_blank" class="new_window">草稿管理</a></li><li class="link-group link-group-1" style="display:none"><a href="/v2/showcase/category" target="_blank" class="new_window">分类管理</a></li></ul>
        _self.pageHrefDom = $('<div class="modal fade js-modal in" aria-hidden="false"><div class="modal-header"><a class="close js-news-modal-dismiss" data-dismiss="modal">×</a></div><div class="modal-body" style="min-height:400px"><div class="tab-content"><div id="js-module-feature" class="tab-pane module-feature active"><table class="table ui-table ui-table-list"><colgroup><col class="modal-col-title"><col class="modal-col-time" span="2"><col class="modal-col-action"></colgroup><thead id="theadHead"></thead><tbody id="pageList"></tbody></table></div></div></div><div class="modal-footer"><div style="display:none" class="js-confirm-choose pull-left"><input type="button" class="btn btn-primary" value="确定使用"></div><div class="pagenavi"><a>第一页</a><a>上一页</a><span class="total">共 2 条，每页 8 条</span><a>下一页</a><a>最后一页</a></div></div></div>');
        var that = this;
        switch (type) {
            case "feature"://微页面链接
                that.page(_self.pageHrefDom, data);
                break;
        }//调用不同内容
        $(".js-modal").remove();
        _self.pageHrefDom.on("click", ".js-news-modal-dismiss", function () {
            $(".js-modal").remove();
        })//弹出框关闭

        _self.pageHrefDom.on("click", ".js-choose", function () {
            refreshObj.model.property[index].hrefName = null;
            refreshObj.model.property[index].href = $(this).parents("tr").find(".new_window").attr("href");
            refreshObj.model.hrefDom = hrefDom;
            refreshObj.notifyModelChanged();
            $(".js-modal").remove();
        })//弹出框确认链接

        return _self.pageHrefDom;
    },//返回弹框给links函数
    page: function (domBox, data) {
        //<a class="js-update" href="javascript:void(0);">刷新</a>
        var headDom = '<tr><th class="title"><div class="td-cont"><span>标题</span></div></th><th class="time"><div class="td-cont"><span>创建时间</span></div></th><th class="opts"><div class="td-cont"><form class="form-search"><div class="input-append"><input class="input-small js-modal-search-input" type="text"><a href="javascript:void(0);" class="btn js-fetch-page js-modal-search" data-action-type="search">搜</a></div></form></div></th></tr>';
        domBox.find("#theadHead").append(headDom);
        var index = 1;
        var total = 0;
        var load = function() {
            $.get("/SiteSettingManage/WapPageSite/InitGrid", {
                sord: "desc",
                page: index,
                rows: 10,
                keyword: domBox.find(".js-modal-search-input").val()
            }, function(result) {
                domBox.find("#pageList tr").remove();
                total = result.total;
                domBox.find(".pagenavi .total").text(index + "/" + total + " 共 " + result.records + " 条");
                domBox.find(".pagenavi a").show();
                if (index === 1) {
                    domBox.find(".pagenavi a:eq(0)").hide();
                    domBox.find(".pagenavi a:eq(1)").hide();
                }
                if (index === total) {
                    domBox.find(".pagenavi a:eq(2)").hide();
                    domBox.find(".pagenavi a:eq(3)").hide();
                }
                for (var i in result.rows) {
                    var d = eval('new ' + result.rows[i].CreateTime.substr(1, result.rows[i].CreateTime.length - 2));
                    var data={
                        name: result.rows[i].PageName,
                        date: d.Format("yyyy-MM-dd hh:mm:ss"),
                        href: result.rows[i].Url
                    };
                    var dom = '<tr><td class="title"><div class="td-cont"><a target="_blank" class="new_window" href="' + data.href + '">' + data.name + '</a></div></td><td class="time"><div class="td-cont"><span>' + data.date + '</span></div></td><td class="opts"><div class="td-cont"><button class="btn js-choose" href="#" data-id="45592172" data-url="https://h5.koudaitong.com/v2/showcase/feature?alias=xga6w11a" data-page-type="feature" data-cover-attachment-id="" data-cover-attachment-url="" data-title="七夕情人节" data-alias="xga6w11a">选取</button></div></td></tr>';
                    domBox.find("#pageList").append(dom);
                }
            });
        };
        load();
        domBox.find(".pagenavi a:eq(0)").click(function () {
            index = 1;
            load();
        });
        domBox.find(".pagenavi a:eq(1)").click(function () {
            index--;
            load();
        });
        domBox.find(".pagenavi a:eq(2)").click(function () {
            index++;
            load();
        });
        domBox.find(".pagenavi a:eq(3)").click(function () {
            index = total;
            load();
        });
        domBox.find(".js-modal-search").click(function () {
            index = 1;
            load();
        });
    },//微页面函数
    customize: function (refreshObj, index, hrefDom, coordinate) {
        var _self = {};//用作this
        _self.popUpDom = '<div class="popover bottom" id="popover_popup" style="position:absolute;"><div class="arrow"></div><div class="popover-inner popover-link"><div class="popover-content"><div class="form-inline"><input type="text" class="link-placeholder" placeholder="链接地址：http://example.com"> <button type="button" class="btn btn-primary js-btn-confirm" data-loading-text="确定">确定</button> <button type="reset" class="btn js-btn-cancel">取消</button></div></div></div></div>'
        _self.editDom = refreshObj.editorDom;

        $(".popover").remove();
        $("body").append(_self.popUpDom);//添加弹出框

        var $popover = $(".popover");
        $popover.css({ "left": coordinate.left + 180, "top": coordinate.top + 23 });//弹出框位置

        $popover.find(".btn-primary").on("click", function () {
            var thisVal = $(this).siblings("input").val();
            refreshObj.model.property[index].hrefName = null;
            thisVal == '' || (refreshObj.model.property[index].href = thisVal);
            refreshObj.model.hrefDom = hrefDom;
            refreshObj.notifyModelChanged();
            $popover.remove();
        })//弹出框隐藏
        $popover.find(".js-btn-cancel").on("click", function () {
            $popover.remove();
        })//弹出框取消
    }//自定义弹框
};

function links(refreshObj) {
    var _self = this;
    _self.editDom = refreshObj.editorDom;
    this.hrefDom = '<input type="hidden" name="link_url"><div class="control-action clearfix"><div class="pull-left js-link-to link-to"><a href="javascript:;" target="_blank" class="new-window link-to-title"><span class="label label-success">外链 <em class="link-to-title-text"></em></span></a> <a href="javascript:;" class="js-delete-link link-to-title close-modal pull_left_close"  title="删除">×</a></div><div class="dropdown hover pull-right"><a class="dropdown-toggle" href="javascript:void(0);">修改 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links"  href="javascript:void(0);">自定义外链</a></li></ul></div></div>';
    this.thisIndex = null;

    this.editDom.unbind('mouseenter').on("mouseenter", ".dropdown ", function () {
        $(".popover").length != 0 || (_self.thisIndex = $(this).parents(".choice").index())
        $(this).children(".dropdown-menu").show();
    })//显示链接列表

    this.editDom.unbind('mouseleave').on("mouseleave", ".dropdown ", function () {
        $(this).children(".dropdown-menu").hide();
    })//隐藏链接列表

    this.editDom.on("click", ".js-delete-link", function () {
        refreshObj.model.property[$(this).parents(".choice").index()].href = null;
        refreshObj.notifyModelChanged();
    })//删除链接

    _self.editDom.on("click", ".dropdown-menu li", function () {
        if (!$(this).children("a").data("type")) {
            return;
        }
        var dom = manager.pageHref(refreshObj, _self.thisIndex, _self.hrefDom, $(this).children("a").data("type"));
        $("body").append(dom);
    })//弹出框链接（非自定义）

    _self.editDom.on("click", ".js-modal-links", function () {
        manager.customize(refreshObj, _self.thisIndex, _self.hrefDom, $(this).parents(".control-group").offset())
    })//显示自定义链接弹框

   

}

function initImg(refreshObj, item, callback, judgment) {
    $('.choice-image .add-image').off("change").on('change', function (e, item) {
        //图片大小限制
        var dom_btnFile = $(this);
        var base_dom = dom_btnFile.parent();
        var ImageHideFile = base_dom.find("input:hidden").eq(0); //图片隐藏域。
        var files = dom_btnFile.prop("files");
        if (!checkImgType(dom_btnFile.val())) {
            $.modalMsg("上传格式为gif、jpeg、jpg、png、bmp", "error");
            return false;
        }

        var flag = true;
        if (files != null) {
            uploadFilesCount = files.length;
            $(files).each(function (index, item) {
                if (item.size / 1024 > 2 * 1024) {
                    flag = false;
                    return;
                }
            });
        }
        if (!flag) {
            $.modalMsg("上传的图片不能超过" + 2 + "M", "error");
            return;
        }

        //开始模拟提交表当。
        dom_btnFile.parent("form").ajaxSubmit({
            success: function (data, status, xhr, $form) {
                if (data == "NoFile" || data == "Error" || data == "格式不正确！") {
                    $.modalMsg(data, "error");
                }
                    //var erro = $("img[src='" + data + "']").find("h2 i");
                else if ($("img[src='" + data + "']").find("h2 i").length > 0) {
                    $.modalMsg("上传的图片大小超过限制", "error");
                }
                else {
                    //文件上传成功，返回图片的路径。将路经赋给隐藏域
                    //ImageHideFile.val(data);
                    if (!judgment) {
                        var hmtls = '<img src="' + data + '" data-full-size="" width="120" height="80" class="thumb-image"><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>';
                        base_dom.parent().find("a").remove();
                        base_dom.parent().find("img").remove();
                        base_dom.parent().append(hmtls);
                    }

                    
                    if (callback != undefined && typeof (callback) == "function") {
                        callback(data, $form, refreshObj);
                    }
                   // previewDom
                    //if (opts.onload && typeof opts.onload === "function") {
                    //    opts.onload(data);
                    //}
                    //  $(target).find('.glyphicon-picture').addClass('active');
                }
                //  $(fu1).insertAfter($("span.glyphicon-picture", $(target)));


            }
        });

        // dom_btnFile.parent().submit();
        //document.getElementById('iframe').onload = function () {
        //    var str = (document.getElementById('iframe').contentWindow.document.body.innerHTML);
        //    $('#up_pic' + (i + 1)).html('<img src="' + str + '" width="99" height="99">');
        //    $('#test_file' + i).parent().parent().removeClass('glyphicon glyphicon-open').addClass('glyphicon glyphicon-remove').attr('data-del', '1');
        //    $('#up_pic' + (i + 1)).attr('data-url', str);
        //    $('#test_file' + i).hide();
        //    return;
        //};
        //document.getElementById('iframe').onreadystatechange = function () {
        //    if (this.readyState == "complete") {
        //        var str = (this.contentWindow.document.body.innerHTML);
        //        $('#up_pic' + (i + 1)).html('<img src="' + str + '" width="99" height="99">');
        //        $('#test_file' + i).parent().parent().removeClass('glyphicon glyphicon-open').addClass('glyphicon glyphicon-remove').attr('data-del', '1');
        //        $('#up_pic' + (i + 1)).attr('data-url', str);
        //        $('#test_file' + i).hide();
        //        this.onreadystatechange = null;
        //        return;
        //    }
        //};
    });
}

function checkImgType(filename) {
    var pos = filename.lastIndexOf(".");
    var str = filename.substring(pos, filename.length)
    var str1 = str.toLowerCase();
    if (!/\.(gif|jpg|jpeg|png|bmp)$/.test(str1)) {
        return false;
    }
    return true;
}

function productAdd(refreshObj) {
    var imgHtml = '<div class="choice-image"><form action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload"><input class="hiddenImgSrc" type="hidden" value=""><input class="add-image js-trigger-image" name="test_file" type="file" style="display:block;opacity:0;z-index:1;cursor:pointer;position:absolute"></form><a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i> 添加图片</a><div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div>';
    var productHtml = '<ul><li>商品名称：<input type="text" class="product_name"></li><li>商品价格：<input type="text" class="product_price"></li><li><span style="float:left">商品图片：</span>' + imgHtml + '</li></ul>';
    var popUpDom = $('<div class="modal fade js-modal in" aria-hidden="false"><div class="modal-header"><div class="model_headText">选择商品</div><a class="close js-news-modal-dismiss" data-dismiss="modal">×</a></div><div class="modal-body">' + productHtml + '</div><div class="modal-footer"><div class="js-confirm-choose pull-left"><input type="button" class="btn btn-primary btn_determine" value="确定使用"></div></div></div>');
    var img = "";
    popUpDom.find(".add-image").off("change").on('change', function (e, item) {
        //图片大小限制
        var dom_btnFile = $(this);
        var base_dom = dom_btnFile.parent();
        var ImageHideFile = base_dom.find("input:hidden").eq(0); //图片隐藏域。
        var files = dom_btnFile.prop("files");
        if (!checkImgType(dom_btnFile.val())) {
            $.modalMsg("上传格式为gif、jpeg、jpg、png、bmp", "error");
            return false;
        }

        var flag = true;
        if (files != null) {
            $(files).each(function (index, item) {
                if (item.size / 1024 > 2 * 1024) {
                    flag = false;
                    return;
                }
            });
        }
        if (!flag) {
            $.modalMsg("上传的图片不能超过" + 2 + "M", "error");
            return;
        }

        //开始模拟提交表当。
        dom_btnFile.parent().ajaxSubmit({
            success: function(data, status, xhr, $form) {
                if (data == "NoFile" || data == "Error" || data == "格式不正确！") {
                    $.modalMsg(data, "error");
                }
                //var erro = $("img[src='" + data + "']").find("h2 i");
                else if ($("img[src='" + data + "']").find("h2 i").length > 0) {
                    $.modalMsg("上传的图片大小超过限制", "error");
                } else {
                    img = data;
                    var hmtls = '<img src="' + data + '" data-full-size="" width="120" height="80" class="thumb-image"><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>';
                    base_dom.parent().find("a").remove();
                    base_dom.parent().find("img").remove();
                    base_dom.parent().append(hmtls);
                }
            }
        });
    });
    popUpDom.on("click", ".btn_determine", function () {
        refreshObj.model.product.push({
            id: -1,
            name: popUpDom.find(".product_name").val(),
            price: popUpDom.find(".product_price").val(),
            imgUrl: img
        });
        refreshObj.notifyModelChanged();
        $(".js-modal").remove();
    });
    popUpDom.find(".js-news-modal-dismiss").on("click", function () {
        $(".js-modal").remove();
    });
    return popUpDom;

    //
}//产品添加函数

//-----------------------------商品搜索------------------------------------------------------------
function searchType() {//搜索模块
    this.previewDom = $('<div class="app_field pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.bgColor = '';
        this.model.styleValue = '0';
        this.model.name = 'searchType';
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="search_list_out search_box_type search_type1">' +
						'<a href="' + "/m/Search/SearchKeyWold" + '"><div class="cus_search_in">' +
							'<input type="text" class="search_input" placeholder="输入商品名或关键字" disabled="">' +
							'<button type="button" class="search_button">搜索</button>' +
						'</div></a>' +
					'</div>';
        var jqDom = $(dom);
        jqDom.find('.search_type1').css({ background: item.bgColor });
        if (item.styleValue == '0') {
            jqDom.removeClass('search_type2');
        } else if (item.styleValue == '1') {
            jqDom.addClass('search_type2');
        }
        jqDom.css({ background: '#' + item.bgColor });
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="group_list clearfix">' +
						'<span class="list_nm">背景色：</span>' +
						'<div class="list_control">' +
							'<div class="pick_color">' +
								'<input type="text"  class="picker search_picker"></input>' +
							'</div>' +
							'<button class="reset_bg" type="button">重置</button>' +
						'</div>' +
					'</div>' +
					'<div class="group_list clearfix">' +
						'<span class="list_nm">样式：</span>' +
						'<div class="list_control">' +
							'<label class="radio">' +
				                '<input type="radio" name="search_type" value="0" checked="">样式一' +
				            '</label>' +
				            '<label class="radio">' +
				                '<input type="radio" name="search_type" value="1">样式二' +
				            '</label>' +
						'</div>' +
					'</div></div></div>';
        var jqDom = $(dom);
        var _self = this;
        jqDom.find("input[name=search_type][value = " + item.styleValue + "]").attr('checked', true);
        jqDom.find("input[name=search_type]").unbind('click').click(function () {//search的样式radio
            var value = $(this).val();
            item.styleValue = value;
            _self.previewDom.attr("styleValue", value);
            _self.notifyModelChanged();
        });

        jqDom.find('.reset_bg').click(function () {
            item.bgColor = 'f8f8f8';
            //_self.notifyModelChanged();
        });


        jqDom.find('.search_picker').colpick({//颜色选择器
            layout: 'hex',
            submit: 0,
            colorScheme: 'white',
            color: '#f8f8f8',
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $(el).css('background', '#' + hex);
                if (!bySetColor) $(el).attr('value', hex);
                item.bgColor = hex;
                _self.previewDom.attr("bgColor", hex);
                _self.notifyModelChanged();

            }

        }).keyup(function () {
            $(this).colpickSetColor(this.value);

        });

        this.editorDom.append(jqDom);

    }
}
//--------------------------------------/商品搜索--------------------------------------------------

//--------------------------------------辅助线-----------------------------------------------
function sublineType() {
    this.previewDom = $('<div class="app_field pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.bgColor = '';
        this.model.styleValue = '0';
        this.model.stylePadding = '0';
        this.model.name = 'sublineType';

    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//预览区
        var dom = '<div class="subline_out">' +
					'<div class="subline_line"></div>' +
				  '</div>';
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        var jqDom = $(dom);

        jqDom.find('.subline_line').css({ 'border-top-color': '#' + item.bgColor });
        switch (item.styleValue - 0) {
            case 0:
                jqDom.find('.subline_line').css({ 'border-top-style': 'solid' });
                break;
            case 1:
                jqDom.find('.subline_line').css({ 'border-top-style': 'dashed' });
                break;
            case 2:
                jqDom.find('.subline_line').css({ 'border-top-style': 'dotted' });
                break;
        }
        /*if(item.styleValue == '0'){
			jqDom.find('.subline_line').css({'border-top-style':'solid'});
		}
		else if(item.styleValue == '1'){
			jqDom.find('.subline_line').css({'border-top-style':'dashed'});
		}
		else if(item.styleValue == '2'){
			jqDom.find('.subline_line').css({'border-top-style':'dotted'});
		}*/

        if (item.stylePadding == '0') {
            jqDom.removeClass('subline_margin');
        }
        else {
            jqDom.addClass('subline_margin');
        }

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }

    this.updateEditor = function (item) {//编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="group_list clearfix">' +
						'<div class="line_left">' +
							'<span class="list_nm">颜色：</span>' +
							'<div class="list_control">' +
								'<div class="pick_color">' +
									'<input type="text" class="picker line_picker"></input>' +
								'</div>' +
								'<button class="reset_bg" type="button">重置</button>' +
							'</div>' +
						'</div>' +
						'<div class="line_left">' +
							'<label class="line_space_check">' +
								'<input type="checkbox" name="linePadding">左右留边' +
							'</label>' +
						'</div>' +

					'</div>' +
					'<div class="group_list clearfix">' +
						'<span class="list_nm">样式：</span>' +
						'<div class="list_control">' +
							'<label class="radio">' +
				                '<input type="radio" name="subline_type" value="0" checked="">实线' +
				            '</label>' +
				            '<label class="radio">' +
				                '<input type="radio" name="subline_type" value="1">虚线' +
				            '</label>' +
				            '<label class="radio">' +
				                '<input type="radio" name="subline_type" value="2">点线' +
				            '</label>' +
						'</div>' +
					'</div></div></div>';
        var jqDom = $(dom);
        var _self = this;
        jqDom.find("input[name=subline_type][value = " + item.styleValue + "]").attr('checked', true);
        jqDom.find("input[name=subline_type]").click(function () {
            var value = $(this).val();
            item.styleValue = value;
            _self.notifyModelChanged();
        });
        if (item.stylePadding == '0') {
            jqDom.find("input[name=linePadding]").attr('checked', false);
        } else {
            jqDom.find("input[name=linePadding]").attr('checked', true);
        }

        jqDom.find("input[name=linePadding]").click(function () {
            if ($(this).is(":checked")) {
                item.stylePadding = '1';
            }
            else {
                item.stylePadding = '0';
            }
            _self.notifyModelChanged();
        });

        jqDom.find('.line_picker').colpick({//颜色选择器
            layout: 'hex',
            submit: 0,
            colorScheme: 'white',
            color: '#f8f8f8',
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $(el).css('background', '#' + hex);
                if (!bySetColor) $(el).attr('value', hex);
                item.bgColor = hex;
                _self.notifyModelChanged();
            }
        }).keyup(function () {
            $(this).colpickSetColor(this.value);

        });
        this.editorDom.append(jqDom);

    }
}
//------------------------------------/辅助线--------------------------------------------

//------------------------------------文本导航---------------------------------------//
function TextNav() {//文本导航
    var textInput = '';
    this.model = {};

    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的父级
    //右边添加内容初始化

    this.setupModel = function () {//初始化
        this.model.property = [{ text: null, href: null, hrefName: null }];
        this.model.hrefDom = null;
        this.model.hrefPageDom = null;
        this.model.name = 'textNav';
    };

    this.notifyModelChanged = function () {//更新
        var _self = this;
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;

        this.updatePreview(item);
        this.updateEditor(item);
    };

    this.updatePreview = function (item) {//预览区
        var dom = '<div class="control_group">' +
						'<ul class="custom_nav">' +
						'</ul>' +
					'</div>' +
					'<div class="actions">' +
					    '<div class="actions_wrap">' +
					    	'<span class="action edit">编辑</span>' +
					    	'<span class="action add">加内容</span>' +
					    	'<span class="action delete">删除</span>' +
					    '</div>' +
					'</div>';
        var jqDom = $(dom), $navName = jqDom.find(".custom_nav");

        for (var i in item.property) {
            var $obj = $('<li><a href="javascript:;"><span class="custom_nav_tit">点此添加一个『文本导航』</span><span class="right_arrow"></span></a>');
            item.property[i].text && $obj.find(".custom_nav_tit").html(item.property[i].text)
            item.property[i].href && $obj.children("a").attr("href", item.property[i].href)
            $navName.append($obj)
        }

        this.previewDom.append(jqDom);
    };

    this.updateEditor = function (item) {//编辑区
        var _self = this;
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="choiceBox"></div>' +
						'</div>' +
						'<div class="group_list clearfix textNav_Add">' +
							'<a href="javascript:;" class="add_option addOneText"> 添加一个文本导航</a>' +
						'</div>' +
					'</div>';
        var textEditRtDefault = '<div class="choice">' +
									'<ul>' +
									'<li class="addTextNav" style="display:block;">' +
										'<div class="group_list clearfix">' +
											'<span class="list_nm"><em class="required">*</em>名称：</span>' +
											'<div class="list_control">' +
												'<input type="text" name="text_title" maxlength="100" class="txt_common" />' +
												'<p class="help-block error-message">标题不能为空。</p>' +
											'</div>' +
										'</div>' +
										'<div class="group_list clearfix control-group">' +
											'<span class="list_nm"><em class="required">*</em>链接:</span>' +
											'<div class="list_control js-controls">' +
												'<div class="dropdown">' +
													'<a href="javascript:;" class="drop_choice_info">设置链接到的页面地址 </a>' +
													'<ul class="dropdown-menu" style="display: none;">' +
														//'<li><a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面及分类</a></li>'+
														'<li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li>' +
													'</ul>' +
												'</div>' +
											'</div>' +
										'</div>' +
										'<div class="actions">' +
											'<span class="action delete close_modal" title="删除">×</span>' +
											'<span class="action" title="添加">+</span>' +
										'</div>' +
									'</li>' +
								'</ul>' +
							'<div>';
        var jqDom = $(dom), $listBox = jqDom.find(".choiceBox");

        for (var i in item.property) {
            var $obj = $(textEditRtDefault);
            item.property[i].text && $obj.find(".txt_common").val(item.property[i].text);
            item.property[i].href && !item.property[i].hrefName && ($obj.find(".js-controls").html(item.hrefDom), $obj.find(".link-to-title-text").html(item.property[i].href));
            item.property[i].hrefName && ($obj.find(".js-controls").html(item.hrefPageDom), $obj.find(".label-success").html(item.property[i].hrefName))
            $listBox.append($obj);
        }

        jqDom.find(".textNav_Add").on("click", function () {
            item.property.push({ text: null, href: null });
            _self.notifyModelChanged();
        })
        jqDom.find('.close_modal').on("click", function () {
            item.property.splice($(this).parents(".choice").index(), 1);
            _self.notifyModelChanged();
        })
        jqDom.find(".txt_common").on("change", function () {
            item.property[$(this).parents(".choice").index()].text = $(this).val();
            _self.notifyModelChanged();
        })

        this.editorDom.append(jqDom);
        showElement(this.editorDom.find(".choice li"));//右边编辑区域删除按钮
    }
}
//------------------------------------------/文本导航------------------------------------------//

//--------------------------------------辅助留白-----------------------------------------------
function blankTyp() {
    this.previewDom = $('<div class="app_field pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.height = '0';
        this.model.name = 'blacktype';

    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//预览区
        var dom = '<div class="blank_out" style="height:' + this.model.height + 'px"></div>';
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        var jqDom = $(dom);

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }

    this.updateEditor = function (item) {//编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><form class="form-horizontal" novalidate="">\
				    <div class="control-group white-space-group">\
				        <label class="control-label">空白高度：</label>\
				        <div class="controls controls-slider" >\
				            <div class="js-slider white-space-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false" id="slider-range"><a class="ui-slider-handle ui-state-default ui-corner-all" href="#"></a></div>\
				            <div class="slider-height"><span class="js-height" style="margin-left:20px" id="amount">'+ item.height + '</span>像素</div>\
				        </div>\
				    </div>\
				</form></div></div>';
        var jqDom = $(dom);
        var _self = this;
        var aTxt = $("#amount").text();
        this.editorDom.append(jqDom);
        $("#slider-range").slider({
            range: "min",
            value: item.height,
            min: 30,
            max: 100,
            slide: function (event, ui) {
                //$( "#amount" ).text(ui.value );
                item.height = $("#slider-range").slider("value");
                _self.previewDom.find('.blank_out').css('height', ui.value)
                _self.previewDom.attr("blankheight", ui.value);
                return ui.value
            }
        });
        // item.height=aHeight
        //item.height=$("#slider-range" ).slider( "value" )
        //alert( $("#slider-range" ).slider( "value" ) )

    }
}
//------------------------------------/辅助留白--------------------------------------------

function showElement(obj) {//显示隐藏切换
    $(obj).unbind('mouseenter mouseleave').hover(function () {
        $(this).toggleClass("hover");
    });
}

//--------------------------------------------图片轮播----------------------------------------------
function BannerType() {//图片轮播
    this.previewDom = $('<div class="app_field pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化数据
        this.model.styleValue = '0';
        this.model.text = [{ text: null }, { text: null }, { text: null }];
        this.model.imgs = [{ src: null }, { src: null }, { src: null }];
        this.model.property = [{ hrefName: null, href: null }, { hrefName: null, href: null }, { hrefName: null, href: null }];
        this.model.hrefDom = null;
        this.model.hrefPageDom = null;
        this.model.name = 'BannerType';
    }
    this.notifyModelChanged = function () {//更新
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
        initImg(this, item, function (data, $form, refreshObj) {
            var index = $('.app-sidebar .imageBannerEdit form').index($form);
            item.imgs[index].src = data;
            refreshObj.notifyModelChanged();
        });
    }
    this.updatePreview = function (item) {//左边预览
        var dom1 = '<div class="slide" style="display:block;">' +
					'<div class="swiper-container">' +
					      '<div class="swiper-wrapper">';
        var model = this.model;
        $.each(this.model.imgs, function (index, item) {
            var src = item.src;
            if (src === null) {
                src = "/Content/Images/temp/banner1.jpg";
            }
            var alt = model.text[index].text;
            if (alt == null) {
                alt = "";
            }
            var href = model.property[index].href;
            if (href == null) {
                href = "javascript:;";
            }
            dom1 += '<div class="swiper-slide"><a href="' + href + '"><img src="' + src + '" alt="' + alt + '"></a></div>';
        })
        dom1 += '</div>' +
					      '<div class="pagination">' +
					      	'<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>' +
					      	'<span class="swiper-pagination-bullet"></span>' +
					      	'<span class="swiper-pagination-bullet"></span>' +
					      '</div>' +
					'</div>' +
				'</div>';

        //轮播二
        var dom2 = '<div class="slide_type2"><div class="swiper-container gallery-top"><div class="swiper-wrapper">';
        $.each(this.model.imgs, function (index, item) {
            if (item.src) {
                dom2 += '<div class="swiper-slide"><a href="javascript:;"><img src="' + item.src + '" alt=""></a></div>';
            }else{
                dom2 += '<div class="swiper-slide"><a href="javascript:;"><img src="/Content/Images/temp/banner1.jpg" alt=""></a></div>';
            }
        })
     
        dom2 += '</div></div><div class="gallery-thumbs"><div class="swiper-wrapper">';
        $.each(this.model.imgs, function (index, item) {
            if (item.src) {
                dom2 += '<div class="swiper-slide" style="background-image:url(' + item.src + ')"></div>';
            } else {
                dom2 += '<div class="swiper-slide" style="background-image:url(/Content/Images/temp/banner1.jpg)"></div>';
            }
        })
        dom2 += '</div></div></div>';

        var dom;
        if (item.styleValue == '0') {
            dom = dom1;
        }
        else {
            dom = dom2;
        }
        var jqDom = $(dom), $hrefDom = jqDom.find(".swiper-slide a");
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        for (var i in item.property) {
            item.property[i] && $($hrefDom[i]).attr("href", item.property[i].href)
        }
        this.previewDom.append(jqDom);
        this.previewDom.append(action);

    }

    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="group_list clearfix">' +
						'<span class="list_nm">轮播样式：</span>' +
						'<div class="list_control">' +
							'<label class="radio">' +
				                '<input type="radio" name="banner_type" value="0" class="banner_type_radio" checked="">轮播一' +
				            '</label>' +
				            '<label class="radio">' +
				                '<input type="radio" name="banner_type" value="1" class="banner_type_radio">轮播二' +
				            '</label>' +
						'</div>' +
					'</div>' +
					'<div class="imageBannerEdit">' +
						'<ul>' +
							'<li class="choice">' +
								'<div class="choice-image">' +
									'<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>' +
										'<a href="javascript:;" class="add-image js-trigger-image"><i class="icon_add"></i>添加图片' +
									'</a>' +
								'</div>' +
								'<div class="choice_image_info">' +
									'<div class="group_list clearfix">' +
										'<span class="list_nm">文字：</span>' +
										'<div class="list_control">' +
											'<input type="text" name="title_edt" maxlength="100" class="txt_common" />' +
										'</div>' +
									'</div>' +
									'<div class="group_list clearfix control-group">' +
										'<span class="list_nm">链接：</span>' +
										'<div class="list_control js-controls">' +
											'<div class="dropdown">' +
												'<a href="javascript:;" class="drop_choice_info">设置链接到的页面地址 </a>' +
												'<ul class="dropdown-menu" style="display: none;">' +
													//'<li><a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面及分类</a></li>' +
													'<li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li>' +
												'</ul>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</li>' +
							'<li class="choice">' +
								'<div class="choice-image">' +
									'<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>' +
										'<a href="javascript:;" class="add-image js-trigger-image"><i class="icon_add"></i>添加图片' +
									'</a>' +
								'</div>' +
								'<div class="choice_image_info">' +
									'<div class="group_list clearfix">' +
										'<span class="list_nm">文字：</span>' +
										'<div class="list_control">' +
											'<input type="text" name="title_edt" maxlength="100" class="txt_common" />' +
										'</div>' +
									'</div>' +
									'<div class="group_list clearfix control-group">' +
										'<span class="list_nm">链接：</span>' +
										'<div class="list_control js-controls">' +
											'<div class="dropdown">' +
												'<a href="javascript:;" class="drop_choice_info">设置链接到的页面地址 </a>' +
												'<ul class="dropdown-menu" style="display: none;">' +
													//'<li><a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面及分类</a></li>' +
													'<li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li>' +
												'</ul>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</li>' +
							'<li class="choice">' +
								'<div class="choice-image">' +
									'<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>' +
										'<a href="javascript:;" class="add-image js-trigger-image"><i class="icon_add"></i>添加图片' +
									'</a>' +
								'</div>' +
								'<div class="choice_image_info">' +
									'<div class="group_list clearfix">' +
										'<span class="list_nm">文字：</span>' +
										'<div class="list_control">' +
											'<input type="text" name="title_edt" maxlength="100" class="txt_common" />' +
										'</div>' +
									'</div>' +
									'<div class="group_list clearfix control-group">' +
										'<span class="list_nm">链接：</span>' +
										'<div class="list_control js-controls">' +
											'<div class="dropdown">' +
												'<a href="javascript:;" class="drop_choice_info">设置链接到的页面地址 </a>' +
												'<ul class="dropdown-menu" style="display: none;">' +
													//'<li><a class="js-modal-magazine" data-type="feature" href="javascript:void(0);">微页面及分类</a></li>' +
													'<li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li>' +
												'</ul>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</li>' +
						'</ul>' +
					'</div></div></div>';

        var jqDom = $(dom);
        var _self = this, $controls = jqDom.find(".js-controls"), $trigger_image = jqDom.find("a.js-trigger-image"), $hiddenImgSrc = jqDom.find(".hiddenImgSrc");
        jqDom.find("input[name=banner_type][value = " + item.styleValue + "]").attr('checked', true);


        jqDom.find("input[name=banner_type]").unbind('click').click(function () {//轮播样式的radio
            var value = $(this).val();
            item.styleValue = value;
            _self.previewDom.attr("styleValue", value);
            _self.notifyModelChanged();
        });

        for (var i in item.imgs) {
            item.imgs[i].src &&
            ($($trigger_image[i]).html('<img src="' + item.imgs[i].src + '" width="120" height="80" /><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>'),
            $($hiddenImgSrc[i]).val(item.imgs[i].src)
            );
        }

        for (var i in item.property) {
            item.property[i].href && !item.property[i].hrefName && ($($controls[i]).html(item.hrefDom), $($controls[i]).find(".link-to-title-text").html(item.property[i].href))
            item.property[i].hrefName && ($($controls[i]).html(item.hrefPageDom), $($controls[i]).find(".label-success").html(item.property[i].hrefName))
        }


        this.editorDom.append(jqDom);
    }
}
//--------------------------------------------/图片轮播----------------------------------------------

//-------------------------------------------图片广告--------------------------------------------
function ImageBannerType() {
    var _self = this;
    this.previewDom = $('<div class="app_field pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化数据
        this.model.styleValue = '0';
        this.model.sizeValue = '0';
        this.model.link = '';
        this.model.property = [];
        this.model.hrefDom = null;
        this.model.hrefPageDom = null;
        this.model.name = 'ImageBannerType';
    }
    this.notifyModelChanged = function () {//更新
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);

        initImg(this, item, function (data, $form, refreshObj) {
            var index = $form.parents("li.choice").index();
            item.property[index].imgSrc = data;
            refreshObj.notifyModelChanged();
        });
    }

    this.updatePreview = function (item) {//预览区
        var dom1 = '<div class="imageBanner image_banner_small">' +
						'<ul>' +
						'</ul>' +
					'</div>';//非折叠
        var dom2 = '<div class="image_slide_banner">' +
						'<div class="swiper-container custom-image-swiper">' +
			                  '<div class="swiper-wrapper swiper_advertising">' +
			                  '</div>' +
			                  '<div class="pagination"></div>' +
			            '</div>' +
					'</div>';//折叠
        var dom;
        if (item.styleValue == '0') {//折叠
            dom = dom2;
        } else {//分开
            dom = dom1;
        }

        var jqDom = $(dom);
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        if (item.sizeValue == 0) {
            jqDom.removeClass('image_banner_small');
        } else {
            jqDom.addClass('image_banner_small');
        }
        jqDom.is(".imageBanner") ? _self.expand(jqDom, item) : _self.fold(jqDom, item);//生成标签

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="group_list clearfix">' +
							'<span class="list_nm">显示方式：</span>' +
							'<div class="list_control">' +
								'<label class="radio">' +
					                '<input type="radio" name="show_method" value="0" checked="">折叠轮播' +
					            '</label>' +
					            '<label class="radio">' +
					                '<input type="radio" name="show_method" value="1">分开显示' +
					            '</label>' +
							'</div>' +
						'</div>' +
						'<div class="group_list clearfix">' +
							'<span class="list_nm">显示大小：</span>' +
							'<div class="list_control">' +
								'<label class="radio">' +
					                '<input type="radio" name="image_size" value="0" checked="">大图' +
					            '</label>' +
					            '<label class="radio radio_small">' +
					                '<input type="radio" name="image_size" value="1" >小图' +
					            '</label>' +
							'</div>' +
						'</div>' +
						'<div class="control-group js-choices-region">' +
						    '<ul class="choices ui-sortable">' +
						    '</ul>' +
						'</div>' +
						'<div class="group_list clearfix">' +
							'<div class="control-group options js-addDom">' +
						        '<a href="javascript:void(0);" class="add-option js-add-option"><i class="icon-add"></i> 添加一个广告</a>' +
						    '</div>' +
						'</div>' +
					'</div>' +
					'</div>';
        var editAddDom = '<li class="choice"><div class="choice-image"><form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form><a href="javascript:;" class="add-image js-trigger-image"><i class="icon_add"></i>添加图片</a><!--for error msg--><div class="control-group"><div class="controls"><input type="hidden"name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">标题：</label><div class="controls"><input class="imgBannerTitel" type="text"name="title[c189]"value=""></div></div><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action"href="javascript:void(0);">设置链接到的页面地址<i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div><div class="actions"><span class="action add close-modal"title="添加">+</span><span class="action delete close-modal"title="删除">×</span></div></li>'
        var jqDom = $(dom);

        item.property.length == 0 && _self.initial();

        for (var i in item.property) {
            var $obj = $(editAddDom)
            item.property[i].title && $obj.find(".imgBannerTitel").val(item.property[i].title)
            item.property[i].href && !item.property[i].hrefName && ($obj.find(".js-controls").html(item.hrefDom), $obj.find(".link-to-title-text").html(item.property[i].href))
            item.property[i].hrefName && ($obj.find(".js-controls").html(item.hrefPageDom), $obj.find(".label-success").html(item.property[i].hrefName));

            item.property[i].imgSrc &&
            ($obj.find("a.js-trigger-image").html('<img src="' + item.property[i].imgSrc + '" width="120" height="80" /><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>'),
            $obj.find(".hiddenImgSrc").val(item.property[i].imgSrc));

            jqDom.find(".choices").append($obj);
        }//初始化

        jqDom.on("change", ".imgBannerTitel", function () {
            item.property[$(this).parents(".choice").index()].title = $(this).val();
            _self.notifyModelChanged();
        })

        jqDom.find("input[name=image_size][value = " + item.sizeValue + "]").attr('checked', true);
        jqDom.find("input[name=image_size]").click(function () {//显示大小
            var value = $(this).val();
            item.sizeValue = value;
            _self.notifyModelChanged();
        });

        jqDom.find("input[name=show_method][value = " + item.styleValue + "]").attr('checked', true);
        jqDom.find("input[name=show_method]").click(function () {//显示方式
            var value = $(this).val();
            item.styleValue = value;
            _self.notifyModelChanged();
        });

        jqDom.find(".js-addDom").off("click").on("click", function () {
            item.property.push({ imgSrc: null, href: null, title: null, hrefName: null });
            _self.notifyModelChanged();
        })//添加

        jqDom.find(".delete").on("click", function () {
            item.property.splice($(this).parents(".choice").index(), 1);
            _self.notifyModelChanged();
        })

        if (item.styleValue == '0') {
            jqDom.find(".radio_small").hide();
        }
        this.editorDom.append(jqDom);
    }
    this.fold = function (obj, item) {//折叠
        var addDom = '<div class="swiper-slide"><a href="javascript:;"><img src="/Content/Images/temp/imagebanner_slide.jpg" alt=""></a></div>';
        for (var i in item.property) {
            var jqAddDom = $(addDom);
            item.property[i].imgSrc && jqAddDom.find("img").attr("src", item.property[i].imgSrc);
            item.property[i].href && jqAddDom.find("a").attr("href", item.property[i].href);
            obj.find(".swiper-wrapper").append(jqAddDom);
        }
    }
    this.expand = function (obj, item) {//非折叠
        var addDom = '<li><a href="javascript:;"><img src="/Content/Images/temp/imagebanner_small.jpg" alt="" /></a></li>';
        for (var i in item.property) {
            var jqAddDom = $(addDom);
            item.property[i].imgSrc && jqAddDom.find("img").attr("src", item.property[i].imgSrc);
            item.property[i].href && jqAddDom.find("a").attr("href", item.property[i].href);
            obj.find("ul").append(jqAddDom);
        }
    }
    this.initial = function (obj) {
        var $obj = '<div style="background:#d9dadb; height:100px;text-align:center;color:#fff;line-height:100px;font-size:24px;"><h6>推荐图片尺寸：640px</h6></div>';
        _self.previewDom.append($obj);
    }
}
//-------------------------------------------/图片广告----------------------------------------------

//-------------------------------------------/公告----------------------------------------------
function bulletinType() {//公告模块
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.objValue = null;
        this.model.name = 'bulletin';
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="bulletin">' +
						'<p>' +
							'<span id="bulletin">请填写内容，多余文字将滚动显示</span>' +
						'</p>' +
					'</div>';
        var jqDom = $(dom);

        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        if (this.model.objValue || this.model.objValue == 0) {
            jqDom.find("#bulletin").html(this.model.objValue)
        }

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region">' +
						'<div class="app-sidebar">' +
						    '<div class="arrow"></div>' +
						    '<div class="app-sidebar-inner js-sidebar-region">' +
							    '<div>' +
								    '<form class="form-horizontal edit-tpl-11-11" novalidate="" onsubmit="return false">' +
									    '<div class="control-group">' +
									        '<label class="control-label" style="text-align:right; line-height:35px;">公告：</label>' +
									        '<div class="controls">' +
									            '<input type="text" name="content" id="bulletinText" class="input-xxlarge"  placeholder="请填写内容，多余文字将滚动显示">' +
									        '</div>' +
									    '</div>' +
									'</form>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';
        var jqDom = $(dom);
        var _self = this;

        item.objValue && jqDom.find("#bulletinText").val(item.objValue);

        jqDom.find("#bulletinText").on("change", function () {
            item.objValue = $(this).val();
            _self.notifyModelChanged();
        })
        this.editorDom.append(jqDom);
    }
}
//-------------------------------------------/公告----------------------------------------------

//-------------------------------------------/橱窗----------------------------------------------
function wicket() {//橱窗模块
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.titleName = null;
        this.model.className = "windowDe_main";
        this.model.mainName = null;
        this.model.mainText = null;
        this.model.property = [{ hrefName: null, href: null }, { hrefName: null, href: null }, { hrefName: null, href: null }];
        this.model.hrefDom = null;
        this.model.hrefPageDom = null;
        this.model.name = 'wicket';
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
        initImg(this, item, function (data, $form, refreshObj) {
            var index = $form.parents("li.choice").index();
            item.property[index].imgSrc = data;
            refreshObj.notifyModelChanged();
        });
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="windowBox windowDe_main">' +
					'<h6 class="windowBox_name"></h6>' +
					'<ul id="windowList">' +
						'<li style="background:#9edffd;"><a href="javascript:;"><img src="" alt=""><span class="middle"></span></a></li>' +
						'<li style="background:#fad473;"><a href="javascript:;"><img src="" alt=""><span class="middle"></span></a></li>' +
						'<li style="background:#f69c91;"><a href="javascript:;"><img src="" alt=""><span class="middle"></span></a></li>' +
					'</ul>' +
					'<div class="windowBoxMain">' +
						'<h6 id="windowBoxMainName"></h6>' +
						'<p id="windowBoxMainText"></p>' +
					'</div>' +
				'</div>';

        var jqDom = $(dom);
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        var $windowBoxMain = jqDom.find(".windowBoxMain"), $hrefDom = jqDom.find("a");

        for (var i in item.property) {
            item.property[i].href && $($hrefDom[i]).attr("href", item.property[i].href)
            item.property[i].imgSrc && $($hrefDom[i]).children("img").attr("src", item.property[i].imgSrc)
        }//初始化
        $windowBoxMain.hide();
        if (this.model.titleName || typeof this.model.mainText == "number") {
            jqDom.find(".windowBox_name").html(this.model.titleName);
        }
        if (this.model.mainName || typeof this.model.mainText == "number") {
            $windowBoxMain.show();
            jqDom.find("#windowBoxMainName").html(this.model.mainName);
        }
        if (this.model.mainText || typeof this.model.mainText == "number") {
            $windowBoxMain.show();
            jqDom.find("#windowBoxMainText").html(this.model.mainText);
        }

        jqDom.attr("class", "windowBox").addClass(this.model.className);

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="app-sidebar-inner js-sidebar-region"><div><form class="form-horizontal" novalidate><div class="control-group"><label class="control-label">橱窗标题名：</label><div class="controls"><input type="text" name="title" value="" id="titleName" maxlength="15"></div></div><div class="control-group"><label class="control-label">显示方式：</label><div class="controls"><label class="radio inline"><input type="radio" name="mode" value="0" class="wicketSort" data-sort="detail" checked>默认</label><label class="radio inline"><input type="radio" name="mode" class="wicketSort" value="1" data-sort="3">3 列</label><p class="help-desc">PC版一直显示 3 列</p></div></div><div class="control-group"><label class="control-label">图片间隙：</label><div class="controls"><label class="radio inline"><input type="radio" class="wicketGap" name="without_space" data-gap="ture" value="0" checked>保留</label><label class="radio inline"><input type="radio" class="wicketGap" name="without_space" data-gap="false" value="1">消除</label></div></div><div class="control-group"><label class="control-label">内容区标题：</label><div class="controls"><input type="text" id="windwoMainTitle" name="body_title" value="" maxlength="15"></div></div><div class="control-group"><label class="control-label">内容区说明：</label><div class="controls"><textarea name="body_desc" id="windowMainText" cols="15" rows="3" maxlength="50"></textarea></div></div><div class="control-group js-collection-region js-nav-region"><ul class="choices ui-sortable js_imgNav_ul"><li class="choice"><div class="choice-image"><a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i>添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links"  href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li><li class="choice"><div class="choice-image"><a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i>添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links"  href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li><li class="choice"><div class="choice-image"><a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i> 添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links"  href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li></ul></div></form></div></div></div></div>';
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="app-sidebar-inner js-sidebar-region"><div><div class="control-group"><label class="control-label">橱窗标题名：</label><div class="controls"><input type="text" name="title" value="" id="titleName" maxlength="15"></div></div><div class="control-group"><label class="control-label">显示方式：</label><div class="controls"><label class="radio inline"><input type="radio" name="mode" value="0" class="wicketSort" data-sort="detail" checked>默认</label><label class="radio inline"><input type="radio" name="mode" class="wicketSort" value="1" data-sort="3">3 列</label><p class="help-desc">PC版一直显示 3 列</p></div></div><div class="control-group"><label class="control-label">图片间隙：</label><div class="controls"><label class="radio inline"><input type="radio" class="wicketGap" name="without_space" data-gap="ture" value="0" checked>保留</label><label class="radio inline"><input type="radio" class="wicketGap" name="without_space" data-gap="false" value="1">消除</label></div></div><div class="control-group"><label class="control-label">内容区标题：</label><div class="controls"><input type="text" id="windwoMainTitle" name="body_title" value="" maxlength="15"></div></div><div class="control-group"><label class="control-label">内容区说明：</label><div class="controls"><textarea name="body_desc" id="windowMainText" cols="15" rows="3" maxlength="50"></textarea></div></div><div class="control-group js-collection-region js-nav-region"><ul class="choices ui-sortable js_imgNav_ul"><li class="choice"><div class="choice-image">';
        dom += '<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>';
        dom += '<a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i>添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li><li class="choice"><div class="choice-image">';
        dom += '<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>';
        dom += '<a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i>添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li><li class="choice"><div class="choice-image">';
        dom += '<form  action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" ><input class="hiddenImgSrc" type="hidden" value="" /><input class="add-image js-trigger-image"  name="test_file" type="file" class="uploadFile test_file" style="display:block;opacity: 0;z-index:1;cursor: pointer;position: absolute;"></form>';
        dom += '<a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i> 添加图片</a> <div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div></li></ul></div></div></div></div></div>';

        var jqDom = $(dom);
        var _self = this;
        var $titleName = jqDom.find("#titleName"), $jqDomLi = jqDom.find(".js_imgNav_ul>li"), $controls = jqDom.find(".js-controls"), $wicketText = jqDom.find("#windowMainText"), $wicketTitle = jqDom.find("#windwoMainTitle"), $wicketSort = jqDom.find(".wicketSort"), $wicketGap = jqDom.find(".wicketGap"), $wicketAll = jqDom.find(".wicketSort,.wicketGap");

        item.titleName && $titleName.val(item.titleName);
        item.mainName && $wicketTitle.val(item.mainName);
        item.mainText && $wicketText.val(item.mainText);
        if (item.className == "windowGap_main") {
            $($wicketSort[1]).prop("checked", true);
            $($wicketGap[1]).prop("checked", true);
        } else if (item.className == "windowDe_main") {
            $($wicketSort[0]).prop("checked", true);
            $($wicketGap[0]).prop("checked", true);
        } else if (item.className == "windowBox_main") {
            $($wicketSort[1]).prop("checked", true);
            $($wicketGap[0]).prop("checked", true);
        } else {
            $($wicketSort[0]).prop("checked", true);
            $($wicketGap[1]).prop("checked", true);
        }//编辑区初始化


        for (var i in item.property) {
            item.property[i].href && !item.property[i].hrefName && ($($controls[i]).html(item.hrefDom), $($controls[i]).find(".link-to-title-text").html(item.property[i].href))
            item.property[i].hrefName && ($($controls[i]).html(item.hrefPageDom), $($controls[i]).find(".label-success").html(item.property[i].hrefName));

            item.property[i].imgSrc && ($jqDomLi.eq(i).find("a.js-trigger-image").html('<img src="' + item.property[i].imgSrc + '" width=120 height=80 /><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>'),
            $jqDomLi.eq(i).find(".hiddenImgSrc").val(item.property[i].imgSrc));
        }//初始化

        $titleName.on("change", function () {
            item.titleName = $(this).val();
            _self.notifyModelChanged();
        })//标题名

        $wicketAll.on("change", function () {
            if ($($wicketGap[0]).prop("checked")) {
                if ($($wicketSort[0]).prop("checked")) {
                    item.className = "windowDe_main";
                    _self.previewDom.attr("className", "windowDe_main");
                } else {
                    item.className = "windowBox_main";
                    _self.previewDom.attr("className", "windowBox_main");

                }
            } else {
                if ($($wicketSort[0]).prop("checked")) {
                    item.className = "windowDeGap_main";
                    _self.previewDom.attr("className", "windowDeGap_main");

                } else {
                    item.className = "windowGap_main";
                    _self.previewDom.attr("className", "windowGap_main");

                }
            }
            _self.notifyModelChanged();
        })//标题名

        $wicketTitle.on("change", function () {
            item.mainName = $(this).val();
            _self.notifyModelChanged();
        })//内容区标题

        $wicketText.on("change", function () {
            item.mainText = $(this).val();
            _self.notifyModelChanged();
        })//内容区说明

        this.editorDom.append(jqDom);
    }
}
//-------------------------------------------/橱窗----------------------------------------------

//-------------------------------------------/图片导航----------------------------------------------
function navigation() {//图片导航模块
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.className = "imgNav";
        this.model.property = [{ name:null, imgSrc:null, href: null, hrefName: null }];
        this.model.hrefDom = null;
        this.model.hrefPageDom = null;
        this.model.name = 'navigation';
        this.model.nameShow = true;
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);

        initImg(this, item, function (data, $form, refreshObj) {
            var index = $form.parents("li.choice").index();
            item.property[index].imgSrc = data;
            refreshObj.notifyModelChanged();
        });
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="imgNav" style="display:block;">' +
					'<ul class="imgNav_list">'
                    '</ul>'
                 '</div>';
        var listDom = '<li><a href="javascript:;"><div class="imgNav_productImg"><img src="" alt=""><span class="middle"></span></div><span class="imgNav_productName">标题</span></a></li>'
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');

        var jqDom = $(dom), $imgNav_list = jqDom.find(".imgNav_list");
        jqDom.find(".imgNav_list").addClass("imgNav_num" + item.property.length)

        jqDom.attr("class", this.model.className);

        for (var i in this.model.property) {
            var $list = $(listDom)
            item.property[i].name && $list.find(".imgNav_productName").html(item.property[i].name);
            item.property[i].href && $list.find("a").attr("href", item.property[i].href)
            item.property[i].imgSrc && $list.find("img").attr("src", item.property[i].imgSrc)
            $imgNav_list.append($list);
        }
        if (!item.nameShow) {
            jqDom.find(".imgNav_productName").hide();
        }

        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="app-sidebar-inner js-sidebar-region"><div class="inputAll"><label><input type="radio" class="navigation_input" checked name="imgNav">模板1</label><label><input type="radio" class="navigation_input" name="imgNav">模板2</label></div><div class="textShow"><label><input type="checkbox">是否显示文字</label></div><div><div class="js-collection-region js-nav-region"><ul class="choices ui-sortable js_imgNav_ul"></ul></div></div></div></div></div>';
        var listDom = '<li class="choice"><div class="choice-image"><form action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload"><input class="hiddenImgSrc" type="hidden" value=""><input class="add-image js-trigger-image" name="test_file" type="file" style="display:block;opacity:0;z-index:1;cursor:pointer;position:absolute"></form><a class="add-image js-trigger-image" href="javascript: void(0);"><i class="icon-add"></i> 添加图片</a><div class="control-group"><div class="controls"><input type="hidden" name="image_url"></div></div></div><div class="choice-content"><div class="control-group"><label class="control-label">文字：</label><div class="controls"><input class="imgNavText" data-index="0" type="text" name="title" value="" maxlength="5"></div></div><div class="control-group"><label class="control-label">链接：</label><div class="controls js-controls"><input type="hidden" name="link_url"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div></div><div class="actions"><span class="action delete close-modal" title="删除">×</span></div></li>';
        var addDom = '<p class="add-shopnav js-add-nav hide" style="display:block">+ 添加导航</p>';

        var jqDom = $(dom), $js_imgNav_ul = jqDom.find(".js_imgNav_ul"), jqDomLi = jqDom.find(".imgNavText"), $controls = jqDom.find(".js-controls");;
        var _self = this;

        item.className == "imgNav imgNavTwo" && $(jqDom.find(".navigation_input")[1]).prop("checked", true)
        item.property.length < 10 && jqDom.append(addDom);//最多8个

        jqDom.find(".textShow input").prop("checked", item.nameShow);

        for (var i in item.property) {
            var $obj = $(listDom);
            item.property[i].href && !item.property[i].hrefName && ($obj.html(item.hrefDom), $obj.find(".link-to-title-text").html(item.property[i].href));
            item.property[i].hrefName && ($obj.html(item.hrefPageDom), $obj.find(".label-success").html(item.property[i].hrefName));

            item.property[i].name && $obj.find(".imgNavText").val(item.property[i].name);

            item.property[i].imgSrc && ($obj.find("a.js-trigger-image").html('<img src="' + item.property[i].imgSrc + '" width="66" height="66" /><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>'),
            $obj.find(".hiddenImgSrc").val(item.property[i].imgSrc));
            $js_imgNav_ul.append($obj)
        }//初始化

        jqDom.find(".navigation_input").on("change", function () {
            item.className = $(this).parent().index() == 0 ? "imgNav" : "imgNav imgNavTwo";
            _self.previewDom.attr("className", item.className);
            _self.notifyModelChanged();
        })

        //var jqDomText = jqDom.find(".imgNavText"), $jqDomli = jqDom.find(".choice"), $controls = jqDom.find(".js-controls");

        /*for (var i in item.property) {
            $(jqDomText[i]).val(item.property[i].name)
            item.property[i].href && !item.property[i].hrefName && ($($controls[i]).html(item.hrefDom), $($controls[i]).find(".link-to-title-text").html(item.property[i].href))
            item.property[i].hrefName && ($($controls[i]).html(item.hrefPageDom), $($controls[i]).find(".label-success").html(item.property[i].hrefName))

            item.property[i].imgSrc && ($jqDomli.eq(i).find("a.js-trigger-image").html('<img src="' + item.property[i].imgSrc + '" width="66" height="66" /><a class="modify-image js-trigger-image" href="javascript: void(0);">重新上传</a>'),
           $jqDomli.eq(i).find(".hiddenImgSrc").val(item.property[i].imgSrc));

        }*/

        jqDom.find(".navigation_input").on("change", function () {
            item.className = $(this).parent().index() == 0 ? "imgNav" : "imgNav imgNavTwo";
            _self.previewDom.attr("className", item.className);
            _self.notifyModelChanged();
        })//更改class名

        jqDom.find(".textShow input").on("change", function () {
            item.nameShow = $(this).prop("checked");
            _self.notifyModelChanged();
        })//name是否显示

        jqDom.find(".js-add-nav").on("click", function () {
            item.property.push({ name:null, href: null, hrefName: null });
            _self.notifyModelChanged();
        })//添加

        jqDom.find(".close-modal").on("click", function () {
            item.property.splice($(this).parents(".choice").index(), 1);
            _self.notifyModelChanged();
        })//删除

        jqDom.find(".imgNavText").on("change", function () {
            item.property[$(this).parents(".choice").index()].name = $(this).val();
            _self.notifyModelChanged();
        })//更改name

        this.editorDom.append(jqDom);
    }
}
//-------------------------------------------/图片导航----------------------------------------------

//-------------------------------------------/商品列表----------------------------------------------
function productList() {//商品列表
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的
    var thisSelf = this;
    this.model = {};
    this.setupModel = function () {//初始化
        this.model.proNum = '3';
        this.model.size = '2';
        this.model.size_type = '0';
        this.model.buy_btn = '0';
        this.model.buy_btn_type = '1';
        this.model.title = '0';
        this.model.price = '0';
        this.model.name = 'productList2';
        this.model.initial = [{ imgSrc: '/Content/Images/temp/cs1.jpg', domain: 'http://localhost:5664', name: '商品名称', price: '100' },
					        { imgSrc: '/Content/Images/temp/cs1.jpg', domain: 'http://localhost:5664', name: '商品名称', price: '100' },
					        { imgSrc: '/Content/Images/temp/cs1.jpg', domain: 'http://localhost:5664', name: '商品名称', price: '100' }];
        this.model.product = [];
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();
        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//左边预览
        var lihtml = '', oddLi = '', dbLi = '', ulhtml = '<div class="product-list clearfix"><ul>';
        var dom = '<div class="app-field ui-state-default editing dragSource_div"></div>';

        var productData = item.product.length ? item.product : item.initial;

        if (item.size_type == '1') {
            oddLi = '<div class="oddli">';
            dbLi = '<div class="dbli">'
            for (var i = 0; i < productData.length; i++) {
                var pinfo = productData[i];
                if (i % 2 == 0) {
                    oddLi += '<li data-productId="' + pinfo.id + '"><a class="js_photo_link" href="javascript:alert(\'测试商品\')"><span class="photo-pic"><img src="' + pinfo.imgUrl + '"></span></a>';
                    //if (item.buy_btn == '0' && item.size_type != '2' && item.size_type != '3') {
                    //    oddLi += '<p class="add-icon"></p>';
                    //}
                    if (item.title == '0' || item.price == '0') {
                        if (item.title == '0') {
                            oddLi += '<div class="tips-txt"><p class="name">' + pinfo.name + '</p></div>';
                        }
                        if (item.price == '0') {
                            oddLi += '<div class="tips-txt"><p class="price">￥' + pinfo.price + '</p></div>';
                        }
                    }
                    oddLi += '</li>';
                }
                else {
                    dbLi += '<li data-productId="' + pinfo.id + '"><a class="js_photo_link" href="javascript:alert(\'测试商品\')"><span class="photo-pic"><img src="' + pinfo.imgUrl + '"></span></a>';
                    //if (item.buy_btn == '0' && item.size_type != '2' && item.size_type != '3') {
                    //    oddLi += '<p class="add-icon"></p>';
                    //}
                    if (item.title == '0' || item.price == '0') {
                        if (item.title == '0') {
                            dbLi += '<div class="tips-txt"><p class="name">' + pinfo.name + '</p></div>';
                        }
                        if (item.price == '0') {
                            dbLi += '<div class="tips-txt"><p class="price">￥' + pinfo.price + '</p></div>';
                        }
                    }
                    dbLi += '</li>';
                }
            }
            oddLi += '</div>';
            dbLi += '</div>'
            ulhtml += oddLi;
            ulhtml += dbLi;
            ulhtml += '</ul>';
        }else {
            for (var i = 0; i < productData.length; i++) {
                var pinfo = productData[i];

                console.log(pinfo)
                lihtml += '<li data-productId="' + pinfo.id + '"><a class="js_photo_link" href="javascript:alert(\'测试商品\')"><span class="photo-pic"><img src="' + pinfo.imgUrl + '"></span></a>';
                if (item.title == '0' || item.price == '0') {
                    if (item.title == '0') {
                        lihtml += '<div class="tips-txt"><p class="name">' + pinfo.name + '</p></div>';
                    }
                    if (item.price == '0') {
                        lihtml += '<div class="tips-txt"><p class="price">￥' + pinfo.price + '</p></div>';
                    }

                }
                lihtml += '</li>'
            }
            ulhtml += lihtml;
            ulhtml += '</ul>';
        }

        var jqDom = $(dom);
        jqDom.append(ulhtml)
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');
        this.previewDom.append(jqDom);
        this.previewDom.append(action);

        var add_icon = '<p class="add-icon"></p>';

        switch (item.size) {
            case '0':
                this.previewDom.find('.product-list ul').addClass('size-0');
                break;
            case '1':
                this.previewDom.find('.product-list ul').addClass('size-1');
                break;
            case '2':
                this.previewDom.find('.product-list ul').addClass('size-2');
                break;
            case '3':
                this.previewDom.find('.product-list ul').addClass('size-3');
                break;
        }

        switch (item.size_type) {
            case '0':
                this.previewDom.find('.product-list ul').addClass('card');
                break;
            case '1':
                this.previewDom.find('.product-list ul').addClass('card');
                break;
            case '2':
                this.previewDom.find('.product-list ul').addClass('n-card');
                break;
            case '3':
                this.previewDom.find('.product-list ul').addClass('card');
                break;
        }

        switch (item.buy_btn_type) {
            case '1':
                this.previewDom.find('.add-icon').addClass('ai-0')
                break;
            case '2':
                this.previewDom.find('.add-icon').addClass('ai-1')
                break;
            case '3':
                this.previewDom.find('.add-icon').addClass('ai-2')
                break;
            case '4':
                this.previewDom.find('.add-icon').addClass('ai-3')
                break;

        }
        if (item.size_type) {
            if (item.size_type == '2' && item.size != '3') {
                this.previewDom.find('.tips-txt').addClass('ts-1');
                if (item.size == '1' || item.title == '1') {
                    this.previewDom.find('.tips-txt .name').css('display', 'none');
                    this.previewDom.find('.tips-txt').css('width', 'auto');
                }
            }
            if (item.size == '1' && item.size_type == '3') {
                this.previewDom.find('.tips-txt').css('width', 'auto');
                this.previewDom.find('.tips-txt').addClass('ts-0');

            }
        }

    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar">' +
					'<div class="arrow"></div>' +
					'<div class="app-sidebar-inner js-sidebar-region">' +
					'<div>' +
						'<form class="form-horizontal" novalidate>' +
							'<div class="control-group">' +
								'<label class="control-label">选择商品：</label>' +
								'<div class="controls">' +
									'<ul class="module-goods-list clearfix ui-sortable" name="goods">' +
					'</ul></div></form></div></div></div>';

        var fromHtml = '<div class="js-goods-style-region"><div><form class="form-horizontal" novalidate=""><div class="control-group"><label class="control-label">列表样式：</label>' +
			        	'<div class="controls">' +
					            '<label class="radio inline">' +
					                '<input type="radio" name="size" value="0" checked="">大图' +
					            '</label>' +
					            '<label class="radio inline">' +
					                '<input type="radio" name="size" value="1" >小图' +
					            '</label>' +
					            '<label class="radio inline">' +
					                '<input type="radio" name="size" value="2">一大两小' +
					            '</label>' +
					            '<label class="radio inline">' +
					                '<input type="radio" name="size" value="3">详细列表' +
					            '</label>' +
					        '</div>' +
					    '</div>' +
					'<div class="control-group"><div class="controls"><div class="controls-card"></div></div></div></div></div></form>';
        var _cardHtml1 = '<div class="controls-card-tab">' +
						                    '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="0" checked="">' +
						                        '卡片样式' +
						                    '</label>' +
						                    '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="2">' +
						                        '极简样式' +
						                    '</label>' +
						                '</div>';
        var _cardHtml2 = '<div class="controls-card-tab">' +
						                    '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="0" checked="">' +
						                        '卡片样式' +
						                    '</label>' +
						                     '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="1">' +
						                        '瀑布流' +
						                    '</label>' +
						                    '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="2">' +
						                        '极简样式' +
						                    '</label>' +
						                    '<label class="radio inline">' +
						                        '<input type="radio" name="size_type" value="3">' +
						                        '促销' +
						                    '</label>' +
						                '</div>';
        var _buyHtml = '<div class="controls-card-item item-buy"><div>' +
                    '<label class="checkbox inline">' +
                                '<input type="checkbox" name="buy_btn" value="0">显示购买按钮' +
                        '</label></div> </div>'
        var _buyliHtml = '<div style="margin: 10px 0 0 20px;" class="item-buy-inp">' +
                        '<label class="radio inline">' +
                            '<input type="radio" name="buy_btn_type" value="1" checked="">' +
                            '样式1' +
                        '</label>' +
                        '<label class="radio inline">' +
                            '<input type="radio" name="buy_btn_type" value="2">' +
                            '样式2' +
                        '</label>' +
                        '<label class="radio inline">' +
                            '<input type="radio" name="buy_btn_type" value="3">' +
                            '样式3' +
                        '</label>' +
                        '<label class="radio inline">' +
                            '<input type="radio" name="buy_btn_type" value="4">' +
                            '样式4' +
                        '</label></div>'

        _titHtml = '<div class="controls-card-item"><label class="checkbox inline"><input type="checkbox" name="title" value="0">显示商品名 </label></div>';
        _priHtml = '<div class="controls-card-item"><label class="checkbox inline"><input type="checkbox" name="price" value="1" >显示价格</label></div>';

        var jqDom = $(dom);
        var _self = this;
        jqDom.append(fromHtml)
        this.editorDom.append(jqDom);
        switch (item.size) {
            case '0':
                jqDom.find('.controls-card').append(_cardHtml1);
                break;
            case '1':
                jqDom.find('.controls-card').append(_cardHtml2);
                break;
            case '2':
                jqDom.find('.controls-card').append(_cardHtml1);
                break;
            case '3':
                jqDom.find('.controls-card').append(_cardHtml1 + _buyHtml);
                break;
        }
        switch (item.size_type) {
            case '0':
                if (item.size != '3') {
                    jqDom.find('.controls-card').append(_buyHtml + _titHtml + _priHtml);
                }
                break;
            case '1':
                jqDom.find('.controls-card').append(_buyHtml + _titHtml + _priHtml);
                break;
            case '2':
                if (item.size == '1') {
                    jqDom.find('.controls-card').append(_priHtml);
                }
                else if (item.size != '3') {
                    jqDom.find('.controls-card').append(_titHtml + _priHtml);
                }
                break;
        }
        //添加商品
        for (var i in item.product) {
            var addLI = '<li class="sort"><a href="' + (item.product[i].domain + "/m/product/detail/" + item.product[i].id) + '" target="_blank"><img src="' + item.product[i].imgUrl + '" alt="商品图" width="50" height="50"></a><a class="close-modal js-delete-goods js-delete-product small hide" data-id="" title="删除">×</a></li>';
            jqDom.find(".module-goods-list").append(addLI);
        }
        jqDom.find(".module-goods-list").append('<li class="productAdd"><a href="javascript:void(0);" class="js-add-goods add-goods"><i class="icon-add"></i></a></li>');
        jqDom.find(".js-delete-product").on("click", function () {
            item.product.splice($(this).parents("li.sort").index(), 1)
            thisSelf.notifyModelChanged();
        })
        jqDom.find(".productAdd").on("click", function () {
            $("body").append(productAdd(thisSelf));
        })
        //添加商品

        $('input[name="size"]').each(function (i) {
            if ($(this).val() == item.size) {
                $(this).attr('checked', 'checked');
            }
        })
        $('input[name="size_type"]').each(function (i) {
            if ($(this).val() == item.size_type) {
                $(this).attr('checked', 'checked');
            }
        })

        if (item.buy_btn == '0') {
            $('input[name="buy_btn"]').attr('checked', 'checked');
            jqDom.find('.item-buy').append(_buyliHtml);
        }
        if (item.title == '0') {
            $('input[name="title"]').attr('checked', 'checked');
        }
        if (item.price == '0') {
            $('input[name="price"]').attr('checked', 'checked');
        }

        $('input[name="buy_btn_type"]').each(function (i) {
            if ($(this).val() == item.buy_btn_type) {
                $(this).attr('checked', 'checked');
            }
        })
        jqDom.find("input").click(function () {
            var value = $(this).val();
            var thisName = $(this).attr('name');

            switch (thisName) {
                case 'size':
                    item.size = value;
                    if (item.size_type == '1') {
                        item.size_type = '0'
                    }
                    _self.previewDom.attr("size", item.size);
                    break;
                case 'size_type':
                    item.size_type = value;
                    _self.previewDom.attr("size_type", item.size_type);
                    break;
                case 'buy_btn':
                    item.buy_btn = item.buy_btn == '0' ? '1' : '0';
                    _self.previewDom.attr("buy_btn", item.buy_btn);
                    break;
                case 'buy_btn_type':
                    item.buy_btn_type = value;
                    _self.previewDom.attr("buy_btn_type", item.buy_btn_type);
                    break;
                case 'title':
                    item.title = item.title == '0' ? '1' : '0';
                    _self.previewDom.attr("title", item.title);
                    break;
                case 'price':
                    item.price = item.price == '0' ? '1' : '0';
                    break;

            }

            if (item.size == '1' && item.size_type == '3') {
                item.price = '0';
            }
            _self.previewDom.attr("price", item.price);
            _self.notifyModelChanged();

        });
    }
}
//-------------------------------------------/商品列表----------------------------------------------
//-------------------------------------------/魔方----------------------------------------------
function rubixCube() {
    var _self = this;
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    this.model = {};
    this.setupModel = function () {//初始化
        this.model.hrefDom = null;
        this.model.arr = [];
        this.model.clickIndex = null;
        this.model.pathData = [];
        this.model.tdArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        this.model.del = [];
        this.model.dom = null;
        this.model.editDom = { active: null, dom: [] };
        this.model.property = [];
        this.model.hrefPageDom = null;
        this.model.name = 'rubixCube';
        //arr为选取的td，clickIndex为单击的td下标,pathData为历史x,y数据，tdArr为虚拟index,del为隐藏或大的td,editDom已框选的dom与选择的区域;
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();
        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
        initImg(this, item, function (data, $form, refreshObj) {
            //var index = $form.parents("li.choice").index();
            item.property[item.editDom.active.index].imgSrc = data;
            refreshObj.notifyModelChanged();
        }, true);
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="rubix_table">' +
				    '<table>' +
				        '<tbody>' +
				            '<tr>' +
				                '<td data-index=0></td>' +
				                '<td data-index=1></td>' +
				                '<td data-index=2></td>' +
				                '<td data-index=3></td>' +
				            '</tr>' +
				            '<tr>' +
				                '<td data-index=4></td>' +
				                '<td data-index=5></td>' +
				                '<td data-index=6></td>' +
				                '<td data-index=7></td>' +
				            '</tr>' +
				            '<tr>' +
				                '<td data-index=8></td>' +
				                '<td data-index=9></td>' +
				                '<td data-index=10></td>' +
				                '<td data-index=11></td>' +
				            '</tr>' +
				            '<tr>' +
				                '<td data-index=12></td>' +
				                '<td data-index=13></td>' +
				                '<td data-index=14></td>' +
				                '<td data-index=15></td>' +
				            '</tr>' +
				        '</tbody>' +
				    '</table>' +
				'</div>;';
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');

        var jqDom = $(dom);
        if (item.dom) {
            jqDom.html(item.dom);
            jqDom.find(".rubixActive").html("");
        }

        var $tdAll = jqDom.find("td");
        for (var i in item.property) {
            if (item.property[i].imgSrc) {
                $($tdAll[item.property[i].index]).html("<a href='" + (item.property[i].href || 'javascript:;') + "'><img src='" + item.property[i].imgSrc + "' /></a>")
            }
        }
        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar"><div class="arrow"></div><div class="app-sidebar-inner js-sidebar-region"><h6 class="rubix_table_title">魔方布局：</h6><div class="rubix_table"><table><tbody><tr><td data-index="0"></td><td data-index="1"></td><td data-index="2"></td><td data-index="3"></td></tr><tr><td data-index="4"></td><td data-index="5"></td><td data-index="6"></td><td data-index="7"></td></tr><tr><td data-index="8"></td><td data-index="9"></td><td data-index="10"></td><td data-index="11"></td></tr><tr><td data-index="12"></td><td data-index="13"></td><td data-index="14"></td><td data-index="15"></td></tr></tbody></table></div><div class="rubix_edit"></div></div></div></div>';
        var popDom = '<div class="rubix_popup_box">' +
					    '<div class="rubix_popup">' +
					        '<ul>' +
					            '<li data-index=0></li>' +
					            '<li data-index=1></li>' +
					            '<li data-index=2></li>' +
					            '<li data-index=3></li>' +
					        '</ul>' +
					        '<ul>' +
					            '<li data-index=4></li>' +
					            '<li data-index=5></li>' +
					            '<li data-index=6></li>' +
					            '<li data-index=7></li>' +
					        '</ul>' +
					        '<ul>' +
					            '<li data-index=8></li>' +
					            '<li data-index=9></li>' +
					            '<li data-index=10></li>' +
					            '<li data-index=11></li>' +
					        '</ul>' +
					        '<ul>' +
					            '<li data-index=12></li>' +
					            '<li data-index=13></li>' +
					            '<li data-index=14></li>' +
					            '<li data-index=15></li>' +
					        '</ul>' +
					    '</div>' +
					'</div>';
        var deleteDom = '<div class="control-group js-item-region"><ul class="choices"><li class="choice"><div class="control-group"><label class="control-label"><em class="required">*</em>选择图片：</label><div class="controls" name="image_url"><form action="/PublicOperation/UploadPic" enctype="multipart/form-data" method="post" target="iframeUpload" class="choice-image rubixCubeFile"><input type="file" class="add-image" name="rubixCubeFile"></form><a class="control-action js-trigger-image" href="javascript: void(0);">选择图片</a><p class="help-desc">建议尺寸：320 x 320像素</p></div></div><div class="control-group"><label class="control-label">链接到：</label><div class="controls js-controls"><div class="dropdown hover"><a class="js-dropdown-toggle dropdown-toggle control-action" href="javascript:void(0);">设置链接到的页面地址<i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div><div class="control-group"><label class="control-label">图片占：</label><div class="controls"><div class="btn-group"><a class="btn dropdown-toggle dropdown_status" data-toggle="dropdown" href="javascript:;"></a><ul class="dropdown-menu"><li><a class="js-image-layout" href="javascript:;" data-width="1" data-height="1">1行1列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="2" data-height="1">1行2列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="3" data-height="1">1行3列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="1" data-height="2">2行1列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="2" data-height="2">2行2列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="3" data-height="2">2行3列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="1" data-height="3">3行1列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="2" data-height="3">3行2列</a></li><li><a class="js-image-layout" href="javascript:;" data-width="3" data-height="3">3行3列</a></li></ul></div></div></div><div class="actions"><span class="action delete close-modal" title="删除">×</span></div></li></ul></div>'
        var popUpDom = '<div class="popover bottom" id="popover_popup" style="position:absolute;"><div class="arrow"></div><div class="popover-inner popover-link"><div class="popover-content"><div class="form-inline"><input type="text" class="link-placeholder" placeholder="链接地址：http://example.com"> <button type="button" class="btn btn-primary js-btn-confirm" data-loading-text="确定">确定</button> <button type="reset" class="btn js-btn-cancel">取消</button></div></div></div></div>'
        var hrefDom = '<input type="hidden" name="link_url"><div class="control-action clearfix"><div class="pull-left js-link-to link-to"><a href="javascript:;" target="_blank" class="new-window link-to-title"><span class="label label-success">外链 <em class="link-to-title-text"></em></span></a> <a href="javascript:;" class="js-delete-link link-to-title close-modal pull_left_close"  title="删除">×</a></div><div class="dropdown hover pull-right"><a class="dropdown-toggle" href="javascript:void(0);">修改 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links"  href="javascript:void(0);">自定义外链</a></li></ul></div></div>';
        var singlePage = '<div class="controls pageControls"><input type="hidden" name="link_url"><div class="control-action clearfix"><div class="pull-left js-link-to link-to"><span class="label label-success"></span> <a href="javascript:;" class="js-delete-link link-to-title close-modal" title="删除">×</a></div><div class="dropdown hover pull-right"><a class="dropdown-toggle" href="javascript:void(0);">修改 <i class="caret"></i></a><ul class="dropdown-menu"><li><a class="js-modal-links" href="javascript:void(0);">自定义外链</a></li></ul></div></div></div>';

        var jqDom = $(dom), $popUpDom = $(popUpDom);
        if ($(".rubix_popup_box").length == 0) {
            $("body").append(popDom);
        }

        if (item.dom) {
            jqDom.find(".rubix_table").html(item.dom);
            console.log(item.editDom.dom)
            jqDom.find(".rubix_edit").html(item.editDom.dom[item.editDom.active.index]);
            jqDom.find(".clickActive").removeClass('clickActive');
            var $tdAll = jqDom.find("td");
            $($tdAll[item.editDom.active.cols]).addClass('clickActive');

            for (var i in item.property) {
                if (item.property[i].imgSrc) {
                    $($tdAll[item.property[i].index]).html("<a href='javascript:;'><img src='" + item.property[i].imgSrc + "' /></a>")
                }
            }

            var thisItem = item.property[item.editDom.active.index];
            if (thisItem.href || typeof thisItem.href == "number") {
                !thisItem.hrefName && (jqDom.find(".js-controls").html(hrefDom), jqDom.find(".link-to-title-text").html(thisItem.href))
                thisItem.hrefName && (jqDom.find(".js-controls").html(singlePage), jqDom.find(".label-success").html(thisItem.hrefName))
            }
        }

        var jqPopDom = $(".rubix_popup_box"),
			$popup = jqPopDom.find(".rubix_popup li"),
			$popupBox = jqPopDom.find(".rubix_popup"),
			$tableBox = jqDom.find(".rubix_table"),
			$table = jqDom.find(".rubix_table td"),
			$popupUl = jqPopDom.find(".rubix_popup ul");//缓存Dom元素

        $table.unbind('click').on("click", function () {
            var index = $(this).data("index");
            if (item.tdArr[index] == null) {
                for (var i = 0; i < item.pathData.length; i++) {
                    if (index == item.pathData[i].cols) {
                        item.editDom.active = item.pathData[i];
                        jqDom.find(".rubix_edit").html(item.editDom.dom[item.editDom.active.index]);

                        var thisItem = item.property[item.editDom.active.index];
                        if (thisItem.href || typeof thisItem.href == "number") {
                            !thisItem.hrefName && (jqDom.find(".js-controls").html(hrefDom), jqDom.find(".link-to-title-text").html(thisItem.href))
                            thisItem.hrefName && (jqDom.find(".js-controls").html(singlePage), jqDom.find(".label-success").html(thisItem.hrefName))
                        }
                    }
                }
                item.dom = $tableBox.html();
                $(".clickActive").removeClass('clickActive');
                $(this).addClass("clickActive");
                _self.notifyModelChanged();
                return;
            }//显示下方内容区域

            $popup.hide();
            var cols = (index + 1) % 4 == 0 ? 4 : (index + 1) % 4, row = Math.ceil((index + 1) / 4);
            item.clickIndex = index;
            var required = (5 - row) * (5 - cols);
            for (var i = index; i < $popup.length; i++) {
                if ((i % 4 < cols - 1 && cols - 1 != 0)) {
                    continue;
                }
                if (item.pathData.length != 0 && i != index) {
                    for (var j = 0; j < item.pathData.length; j++) {
                        if (index < item.pathData[j].row) {
                            if (!(parseInt(i / 4) < parseInt(item.pathData[j].cols / 4)) &&
		                       !(i % 4 < item.pathData[j].cols % 4) && (index % 4 <= item.pathData[j].row % 4)
		                    ) {
                                break;
                            }
                        }
                        if (j == item.pathData.length - 1) {
                            $popup[i].style.display = "block";
                        }
                    }
                } else {
                    $popup[i].style.display = "block";
                }
            }//将已选择区域筛选出去，留下与单击点可成矩形的区域

            $popupBox.css("width", (4 - (cols - 1)) * 50 + 2)//弹出框宽度调整
            jqPopDom.show();
            return false;
        })//单击td筛选所需内容并弹出选择框

        $popup.unbind('click').on("mouseover", function () {
            item.arr = [];
            var index = $(this).data("index"), column = index % 4;
            $popup.removeClass('active')

            for (var i = item.clickIndex; i < index + 1; i++) {
                if (i % 4 > column || i % 4 < item.clickIndex % 4) {
                    continue;
                }
                item.arr.push(i)
                $($popup[i]).addClass('active');
            }//鼠标经过离左上角的成矩形的变颜色  
        })//弹出框内鼠标触碰效果，并传输所选数据至arr数组

        $popup.unbind('click').on("click", function () {
            jqPopDom.hide()
            var delJson = { "start": item.tdArr[item.arr[0]], "dataLength": item.arr.length, "dataNum": [item.tdArr[item.arr[0]]] };
            item.tdArr[item.arr[0]] = null;
            for (var i = 1; i < item.arr.length; i++) {
                $table.eq(item.arr[i]).hide();
                delJson.dataNum.push(item.tdArr[item.arr[i]])
                item.tdArr[item.arr[i]] = null;
            }//将鼠标单击的保留，其余隐藏

            item.del.push(delJson)
            var row = parseInt(item.arr[item.arr.length - 1] / 4) + 1 - parseInt(item.arr[0] / 4), cols = item.arr.length / row;

            item.pathData.push({ 'cols': item.arr[0], 'row': item.arr[item.arr.length - 1], index: item.pathData.length })//保存已选择的路径
            $(".clickActive").removeClass('clickActive');
            var $thisTable = $table.eq(item.arr[0]);
            $thisTable.attr({ "colspan": cols, "rowspan": row });
            $thisTable.addClass("column" + cols + " row" + row + " rubixActive clickActive");
            $thisTable.html(160 * cols + " x " + 160 * row);

            item.dom = $tableBox.html();
            $popup.removeClass("active");

            /*魔方编辑区域*/
            item.editDom.active = item.pathData[item.pathData.length - 1];
            var $deleteDom = $(deleteDom);
            $deleteDom.find(".dropdown_status").html(row + "行" + cols + "列");

            item.property.push({ hrefName: null, href: null, imgSrc: null, index: $thisTable.data("index") });
            var $rubix_edit = jqDom.find(".rubix_edit");
            $rubix_edit.html($deleteDom);

            item.editDom.dom.push($rubix_edit.html());

            /*魔方编辑区域*/
            _self.notifyModelChanged();

            return false;
        })//选择所需内容,删除多余td并改变单个td的大小

        jqPopDom.unbind('click').on("click", function () {
            $(this).hide();
        })//点击灰色隐藏

        jqDom.find(".js-trigger-image").on("click", function () {

        })

        jqDom.unbind('click').on("click", ".delete", function () {
            for (var i = 0; i < item.del.length; i++) {
                if (item.del[i].start != item.editDom.active.cols) {
                    continue;
                }
                $table.eq(item.del[i].start).removeClass().html("").attr({ "colspan": 1, "rowspan": 1 });
                for (var j = 0; j < item.del[i].dataLength; j++) {
                    $table.eq(item.del[i].dataNum[j]).show();
                    item.tdArr[item.del[i].dataNum[j]] = item.del[i].dataNum[j];
                }
            }
            //item.editDom.dom.splice(item.editDom.active.index, 1);

            item.editDom.dom[item.editDom.active.index] = "";
            //item.pathData.splice(item.editDom.active.index, 1);
            item.pathData[item.editDom.active.index] = ""
            //item.property.splice(item.editDom.active.index, 1);
            item.property[item.editDom.active.index] = "";
            $(this).parents(".rubix_edit").html(null);
            item.dom = $tableBox.html();
            _self.notifyModelChanged();
        })//删除区域块

        jqDom.off("mouseenter").on("mouseenter", ".dropdown", function () {
            $(this).children(".dropdown-menu").show();
        })//显示链接选择框
        jqDom.off(".mouseleave").on("mouseleave", ".dropdown", function () {
            $(this).children(".dropdown-menu").hide();
        })//隐藏链接选择框

        jqDom.on("click", ".js-modal-links", function () {
            $(".popover").remove();
            var coordinate = $(this).parents(".control-group").offset();
            $popUpDom.css({ "left": coordinate.left + 180, "top": coordinate.top + 23 });
            $popUpDom.find("input").val(null)
            $("body").append($popUpDom);

            $(".popover").on("click", ".js-btn-confirm", function () {
                var inputVal = $(this).siblings("input").val(), $obj = jqDom.find(".js-controls");
                //inputVal != "" && ($obj.html(hrefDom),$obj.find(".link-to-title-text").html(inputVal));
                inputVal != "" && (item.property[item.editDom.active.index].href = inputVal);
                //item.editDom.dom[item.editDom.active.index] = jqDom.find(".js-item-region");//储存数据
                $(".popover").remove();
                _self.notifyModelChanged();
            })//确定弹出框
        })//显示链接弹出框

        jqDom.on("click", ".dropdown-menu li", function () {
            if (!$(this).children("a").data("type")) {
                return;
            }
            var dom = manager.pageHref(_self, item.editDom.active.index, hrefDom, $(this).children("a").data("type"));
            $("body").append(dom);
        })//弹出框链接（非自定义）

        jqDom.on("click", ".js-modal-history,.js-modal-homepage,.js-modal-usercenter", function () {
            var className = ($(this).is(".js-modal-history") && "history") || ($(this).is(".js-modal-homepage") && "homepage") || ($(this).is(".js-modal-usercenter") && "usercenter");
            manager.singlePage(_self, item.editDom.active.index, singlePage, className)
        })//历史消息 店铺主页  会员主页 函数

        this.editorDom.append(jqDom);
    }
}
//-------------------------------------------/魔方----------------------------------------------

//-------------------------------------------/富文本----------------------------------------------
function editor(id, tail) {//图片导航模块
    this.previewDom = $('<div class="app_field  pageItem"></div>');//设置app_field为左边每一模块的父级
    this.editorDom = $('<div class="rt_sider_inner"></div>');//设置rt_sider_inner为右边每一木块的

    var _self = this,two = tail;
    _self.editor = null;
    this.model = {};
    this.setupModel = function () {//初始化
        this.model.id = id;
        //this.model.editor = null;
        this.model.content = null;
        this.model.name = 'editor';
    }
    this.notifyModelChanged = function () {//更新数据
        this.previewDom.empty();
        this.editorDom.empty();

        var item = this.model;
        this.updatePreview(item);
        this.updateEditor(item);
    }
    this.updatePreview = function (item) {//左边预览
        var dom = '<div class="editBox" style="height:100px;width:100%;"></div>';
        var jqDom = $(dom);
        var action = $('<div class="actions">' +
						    '<div class="actions_wrap">' +
						    	'<span class="action edit">编辑</span>' +
						    	'<span class="action delete">删除</span>' +
						    '</div>' +
						'</div>');

        !!item.content && jqDom.css("height", "auto");

        jqDom.append(item.content)
        this.previewDom.append(jqDom);
        this.previewDom.append(action);
    }
    this.updateEditor = function (item) {//右边编辑区
        var dom = '<div class="app-design clearfix without-add-region"><div class="app-sidebar">'+
                    '<script id="' + ("editor" + item.id) + '" type="text/plain" style="width:320px;height:200px;"></script>' +
                  '</div></div>';
        var jqDom = $(dom);
        this.editorDom.append(jqDom);
    }
    this.newEdit = function (item,index){
        if (!document.getElementById("editor" + item.id) || two) {
            two = false;
            return;
        }
        _self.editor && (item.content = _self.editor.getContent(), _self.editor.destroy())//赋值内容 && 删除编辑器
        _self.editor = UE.getEditor("editor" + item.id);//生成编辑器

        item.content && _self.editor.addListener("ready", function () {
            _self.editor.setContent(item.content);
        })//编辑器生成成功后添加保存的内容

        var ediitObj = _self.previewDom.children(".editBox");
        _self.editor.addListener("contentChange", function (){
            var content = _self.editor.getContent();


            !!content ? (ediitObj.css("height", "auto")) : ediitObj.css("height", "100px");

            manager.model.data[index].content = content;
            ediitObj.html(content)
        })//编辑器更改内容反馈到左侧预览区
    }
}
//-------------------------------------------/富文本----------------------------------------------



