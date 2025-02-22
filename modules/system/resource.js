layui.define(['conf', 'common'], function (exports) {
    var modulePath = '/system/resource';
    console.debug('加载', modulePath, '模块');

    var $ = layui.$;
    var element = layui.element;
    var layer = layui.layer;
    var util = layui.util;
    var table = layui.table;
    var form = layui.form;
    var laydate = layui.laydate;

    var common = layui.common;
    var conf = layui.conf;

    common.renderBodyTpl(modulePath, {}, function (str) {


    });

    var api = {};
    exports(modulePath, api);
});