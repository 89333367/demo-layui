layui.define(function (exports) {
    console.debug('layui全局配置', layui.config());
    console.debug('加载 common 模块');

    var $ = layui.$;
    var laytpl = layui.laytpl;
    var table = layui.table;
    var layer = layui.layer;
    var util = layui.util;
    var element = layui.element;
    var form = layui.form;

    var device = layui.device();
    console.debug('当前设备', device);

    // 全局设置ajax请求
    $.ajaxSetup({
        beforeSend: function (xhr) {
            console.debug('ajax请求前', xhr);
        },
        error: function (xhr, status, error) {
            console.error('ajax请求异常', xhr, status, error);
        },
        complete: function (xhr, status) {
            console.debug('ajax请求完成', xhr, status);
        }
    });

    // 全局设置table
    table.set({
        elem: 'table[lay-filter="dom_datatable"]',
        id: 'datatable',
        autoSort: false,
        toolbar: true,
        limit: 10,
        limits: [10, 20, 50, 100, 200, 500, 1000],
        //loading: '<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop"></i>',
        defaultToolbar: [
            'filter', // 列筛选
            'exports', // 导出
            'print' // 打印
        ],
        height: function () {
            return $('.layui-side').height() - $('.layui-table-tool').height() - $('.css_body-footer').height();
        },
        //size: $(window).width() <= 768 ? 'sm' : 'md',//sm|md|lg
        before: function (options) {
            console.debug('当前实例属性配置项', options);
            //options.where.abc = 123; // 修改或额外追加 where 属性
        },
        done: function (res, curr, count, origin) {
            console.debug('当前渲染的数据', res);
            console.debug('当前页码', curr);
            console.debug('数据总量', count);
            console.debug('回调函数所执行的来源', origin);
        },
        error: function (res, msg) {
            console.error('数据表格异常', res, msg);
        },
        complete: function (xhr, ts) {
            // 数据接口请求完成后执行，无论成功还是失败均会触发
            console.debug('数据接口请求完毕', xhr, ts);
        },
        method: 'post',
        page: true,
        where: {},
        headers: {},
        contentType: 'application/json',
        dataType: 'json',
        request: {
            pageName: 'page', // 页码的参数名称，默认：page
            limitName: 'pageSize' // 每页数据条数的参数名，默认：limit
        },
        parseData: function (res) { // res 即为原始返回的数据
            return {
                "code": res.status, // 解析接口状态
                "msg": res.message, // 解析提示文本
                "count": res.data.total, // 解析数据长度
                "data": res.data.records // 解析数据列表
            };
        }
    });
    // 触发排序事件 
    table.on('sort(dom_datatable)', function (obj) {
        console.debug(obj.field); // 当前排序的字段名
        console.debug(obj.type); // 当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
        console.debug(this); // 当前排序的 th 对象

        table.reloadData('datatable', {
            initSort: obj, // 记录初始排序，如果不设的话，将无法标记表头的排序状态。
            where: { // 请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: obj.field, // 排序字段
                order: obj.type // 排序方式
            }
        }, true);
    });

    var api = {
        /**
         * 渲染公共部分
         * - 渲染表单
         * - 渲染面包屑
         * - 渲染搜索表单
         */
        renderCommon: function () {
            var loadIndex = layer.load(0);

            // 渲染表单
            form.render();

            //只要页面有lay-filter="dom_breadcrumb"的面包屑，就会自动渲染
            if ($('span[lay-filter="dom_breadcrumb"]').length > 0) {
                element.render('breadcrumb', 'dom_breadcrumb');
            }

            // 如果页面中有 dom_datatable 的表格，那么就会自动渲染搜索表单，并且点击查询按钮后，会自动滚动到页面最下方
            if ($('table[lay-filter="dom_datatable"]').length > 0) {
                // 如果查询表单过高，说明搜索项比较多，那么先隐藏溢出内容，显示展开按钮
                var dom_formSearch = $('form[lay-filter="dom_formSearch"]');
                var dom_formSearchExpandSearch = $('button[lay-on="dom_formSearchExpandSearch"]');
                if (dom_formSearch && dom_formSearchExpandSearch) {
                    if (dom_formSearch.height() > 110) {
                        dom_formSearchExpandSearch.show();
                        var searchFormItem0 = dom_formSearch.find('div.layui-form-item:eq(0)');
                        searchFormItem0.addClass('css_hide-overflow-content');
                        dom_formSearchExpandSearch.click(function () {
                            searchFormItem0.toggleClass('css_hide-overflow-content');
                            if (searchFormItem0.hasClass('css_hide-overflow-content')) {
                                $(this).html('<i class="layui-icon layui-icon-down"></i>展开');
                            } else {
                                $(this).html('<i class="layui-icon layui-icon-up"></i>收缩');
                            }
                        });
                    } else if (dom_formSearch) {
                        dom_formSearchExpandSearch.hide();
                    }
                }

                // 全局点击查询按钮后，直接滚动到页面最下方
                $('button[lay-filter="dom_formSearchSubmit"]').click(function () {
                    // 直接滚动到页面最下方
                    $('html, body').scrollTop($(document).height());
                });
            }

            layer.close(loadIndex);
        },
        /**
         * 获取模版渲染后的结果
         * @param {*} route 模版路由(传递 menu 就会去找 templates/menu.html)
         * @param {*} data 使用此数据渲染模板，如果没有则需要传递空对象
         * @param {*} callback 回调函数，调用方接收渲染后的结果
         */
        renderTpl: function (route, data, callback) {
            var loadIndex = layer.load(0);
            console.debug('renderTpl参数', arguments);
            var tplUrl = 'templates/' + route.replace(/^\/+/, '') + '.html';
            console.debug('准备加载模版', tplUrl, data);
            $.get(tplUrl, function (tpl) {
                console.debug('获得到的模版内容', tpl);
                laytpl(tpl).render(data, function (str) {
                    console.debug('渲染后的结果', str);

                    callback(str);//将渲染后的结果返回给调用方

                    layer.close(loadIndex);
                });
            });
        },
        /**
         * 直接将模版结果渲染到 css_body-content 中，并且回调调用者的方法
         * @param {*} route 
         * @param {*} data 
         * @param {*} callback 
         */
        renderBodyTpl: function (route, data, callback) {
            var loadIndex = layer.load(0);
            var that = this;

            this.renderTpl(route, data, function (str) {
                $('.css_body-content').html(str);

                that.renderCommon();

                callback(str);//回调

                layer.close(loadIndex);
            });
        }
    };
    exports('common', api);
});