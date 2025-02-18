layui.define(['common', 'menu'], function (exports) {
    console.debug('加载 index 模块');

    var $ = layui.$;
    var util = layui.util;

    var config = layui.config();

    // 头部事件
    util.on({
        // 折叠左侧菜单按钮事件
        dom_leftMenuCollapse: function () {
            $('body').toggleClass('css_collapse');
            if ($('body').hasClass('css_collapse')) {
                $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
            } else {
                $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
            }
        }
    });

    // 动态展示或隐藏菜单
    $(window).resize(function () {
        if ($(window).width() <= 768) {
            $('body').addClass('css_collapse');
            $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
        } else {
            $('body').removeClass('css_collapse');
            $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
        }
    });

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