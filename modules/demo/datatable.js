layui.define(['common'], function (exports) {
    var modulePath = '/demo/datatable';
    console.debug('加载', modulePath, '模块');

    var $ = layui.$;
    var element = layui.element;
    var layer = layui.layer;
    var util = layui.util;
    var table = layui.table;
    var form = layui.form;
    var laydate = layui.laydate;

    var common = layui.common;

    common.renderBodyTpl(modulePath, {}, function (str) {

        laydate.render({
            elem: 'div[lay-filter="dom_datetimerange"]',
            range: ['input[lay-filter="dom_datetimerange_start"]', 'input[lay-filter="dom_datetimerange_end"]'],
            rangeLinked: true,
            type: 'datetime',
            fullPanel: true,
            weekStart: 1, // 设置周一为起始周
            shortcuts: [
                {
                    text: "昨天",
                    value: function () {
                        var now = new Date();
                        now.setDate(now.getDate() - 1); // 获取昨天的日期
                        var a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        var b = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        return [a, b];
                    }
                },
                {
                    text: "今天",
                    value: function () {
                        var now = new Date();
                        var a = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        var b = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        return [a, b];
                    }
                },
                {
                    text: "本月",
                    value: function () {
                        var now = new Date();
                        var year = now.getFullYear();
                        var month = now.getMonth();
                        var a = new Date(year, month, 1, 0, 0, 0); // 本月第一天0点0分0秒
                        var b = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        return [a, b];
                    }
                }
            ]
        });

        form.on('submit(dom_formSearchSubmit)', function (data) {
            var field = data.field; // 获取表单字段值
            console.debug('表单数据', field);

            table.reloadData('datatable', {
                where: field
            });
        });

        table.render({
            url: 'data/datatable.json', // 此处为静态模拟数据，实际使用时需换成真实接口
            method: 'get',
            cols: [[
                { type: 'checkbox', fixed: 'left' },
                { field: 'id', fixed: 'left', minWidth: 80, title: 'ID', sort: true },
                { field: 'username', minWidth: 80, title: '用户' },
                { field: 'email', title: '邮箱', hide: true, minWidth: 150 },
                { field: 'sex', minWidth: 80, title: '性别', sort: true },
                { field: 'sign', title: '签名', minWidth: 260 },
                { field: 'experience', minWidth: 100, title: '积分', sort: true },
                { field: 'checkin', title: '打卡', minWidth: 100, sort: true },
                { field: 'ip', title: 'IP', minWidth: 150 },
                { field: 'joinTime', title: '加入时间', minWidth: 180 },
                { fixed: 'right', title: '操作', minWidth: 125, templet: $('script[lay-filter="tpl_operation"]') }
            ]],
            defaultToolbar: [
                {
                    // 扩展工具
                    title: '添加', // 标题
                    name: 'add', // name
                    layEvent: 'add', // 事件标识
                    icon: 'layui-icon-add-1', // 图标 className
                    onClick: function (obj) { // 点击事件 - 2.9.12+
                        //console.debug(obj); // 查看返回的对象成员
                        layer.open({
                            type: 1,
                            area: ['auto', '100%'],
                            maxWidth: $(window).width(),
                            offset: 'r',
                            anim: 'slideLeft', // 从右往左
                            shade: [0.6, '#FFF'],
                            shadeClose: true,
                            resize: false,
                            scrollbar: false,
                            title: '新增',
                            id: 'formData',
                            content: $('div[lay-filter="dom_formData"]'),
                            btn: ['提交', '取消'],
                            btn1: function (index, layero, that) {
                                // return false // 点击该按钮后不关闭弹层
                            },
                            btn2: function (index, layero, that) {

                            }
                        });
                    }
                }, {
                    // 扩展工具
                    title: '删除', // 标题
                    name: 'del', // name
                    layEvent: 'del', // 事件标识
                    icon: 'layui-icon-delete', // 图标 className
                    onClick: function (obj) { // 点击事件 - 2.9.12+
                        //console.debug(obj); // 查看返回的对象成员
                        var tableStatus = table.checkStatus('datatable');
                        console.debug('选中行的数据', tableStatus.data);
                        console.debug('选中行数量', tableStatus.data.length);
                        console.debug('选中的原始缓存数据', tableStatus.dataCache);
                        console.debug('表格是否全选', tableStatus.isAll);
                        if (tableStatus.data.length > 0) {
                            layer.confirm('是否删除选中的 [' + tableStatus.data.length + '] 项？', { icon: 3 }, function () {
                                layer.msg(JSON.stringify(tableStatus.data), { icon: 1 });
                            }, function () {
                                layer.msg('点击取消的回调');
                            });
                        }
                    }
                },
                'filter', 'exports', 'print' // 内置工具
            ]
        });

    });

    var api = {};
    exports(modulePath, api);
});