layui.define(['common', 'menu'], function (exports) {
    console.debug('加载 index 模块');

    var $ = layui.$;
    var util = layui.util;

    var config = layui.config();

    // 页脚版本号
    $('.css_body-footer').html('Copyright © 2025 LayUI ( ' + config.v + ' ) ');

    // 底部Top工具
    util.fixbar({
        margin: 1,
        default: true
    });

    var api = {};
    exports('index', api);
});