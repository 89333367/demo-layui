layui.define(['common'], function (exports) {
    console.debug('加载 menu 模块');

    var $ = layui.$;
    var util = layui.util;
    var element = layui.element;

    var common = layui.common;

    // 绑定左侧菜单事件
    element.on('nav(dom_leftMenu)', function (elem) {
        var href = $(elem).attr('href');
        console.debug('点击了菜单', $(elem).text(), href);
        if (href !== 'javascript:;') {
            var url = layui.url(href);
            layui.use(url.hash.href, layui.factory(url.hash.href));
        }
    });

    // 动态加载左侧菜单
    $.getJSON('data/menu.json', function (data) {
        common.renderTpl('menu', data, function (str) {
            var dom_leftMenu = $('ul[lay-filter="dom_leftMenu"]');
            dom_leftMenu.html(str);
            element.render('nav');

            // 菜单加载后，自动选中菜单
            var url = layui.url(location.href);
            if (url.hash.path.length > 0) {
                var href = '#/' + url.hash.path.join('/');
                // 如果路径中带有之前的hash值，那么直接选中左侧菜单
                var menuItem = dom_leftMenu.find('a[href="' + href + '"]');
                if (menuItem.length != 0) {
                    menuItem.trigger('click');//这句话目的是为了让菜单变成选中状态
                } else {
                    common.renderBodyTpl('404', {}, function (str) { });
                }
            } else {
                // 如果路径中没有之前的hash值，那么默认选中左侧菜单的第一个
                var href = dom_leftMenu.find('li:eq(0) dl:eq(0) a:eq(0)').attr('href');
                dom_leftMenu.find('a[href="' + href + '"]').trigger('click');//这句话目的是为了让菜单变成选中状态
                location.hash = href;
            }
        });
    });

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

    // 根据窗口宽度动态展示或隐藏菜单
    var resizeWindow = function () {
        console.debug('当前窗口宽度', $(window).width());
        if ($(window).width() <= 768) {
            $('body').addClass('css_collapse');
            $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
        } else {
            $('body').removeClass('css_collapse');
            $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
        }
    };
    resizeWindow();
    // 根据窗口宽度动态展示或隐藏菜单
    $(window).resize(function () {
        resizeWindow();
    });

    var api = {};
    exports('menu', api);
});