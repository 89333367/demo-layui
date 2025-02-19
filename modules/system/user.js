layui.define(['common'], function (exports) {
    var modulePath = '/system/user';
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

        form.on('submit(dom_formSearchSubmit)', function (data) {
            var field = data.field; // 获取表单字段值
            console.debug('表单数据', field);

            table.reloadData('datatable', {
                where: field
            });

            // 直接滚动到页面最下方
            $('html, body').scrollTop($(document).height());
        });
        form.render();

        table.render({
            url: 'data/users.json', // 此处为静态模拟数据，实际使用时需换成真实接口
            method: 'get',
            cols: [[
                { field: 'id', minWidth: 80, title: 'ID', sort: true },
                { field: 'username', minWidth: 80, title: '用户', sort: true },
                { field: 'email', title: '邮箱', minWidth: 150, sort: true },
                {
                    field: 'sex', minWidth: 80, title: '性别', sort: true, templet: function (d) {
                        console.debug(d); // 得到当前行数据
                        console.debug(this); // 得到表头当前列配置项
                        console.debug(d.LAY_NUM); // 得到序号。或其他特定字段
                        if (d.sex == 1) {
                            return '男';
                        } else {
                            return '女';
                        }
                    }
                },
                { field: 'createTime', title: '创建时间', minWidth: 180, sort: true },
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