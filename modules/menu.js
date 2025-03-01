layui.define(['conf', 'common'], function (exports) {
    console.debug('加载 menu 模块');

    var $ = layui.$;
    var util = layui.util;
    var element = layui.element;

    var common = layui.common;
    var conf = layui.conf;
    var device = layui.device();

    /**
     * 隐藏菜单
     * - 左侧菜单折叠按钮
     * - 窗口宽度小于768px时，自动隐藏菜单
     */
    var hideMenu = function () {
        console.debug('隐藏菜单');
        $('body').addClass('css_collapse');
        $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-shrink-right').addClass('layui-icon-spread-left');
    };

    /**
     * 展示菜单
     * - 左侧菜单折叠按钮
     * - 窗口宽度大于768px时，自动展示菜单
     */
    var showMenu = function () {
        console.debug('展示菜单');
        $('body').removeClass('css_collapse');
        $('li[lay-on="dom_leftMenuCollapse"]>i').removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
    };

    // 绑定左侧菜单事件
    element.on('nav(dom_leftMenu)', function (elem) {
        var href = $(elem).attr('href');
        console.debug('点击了菜单', $(elem).text(), href);
        if (href !== 'javascript:;') {
            var url = layui.url(href);
            layui.use(url.hash.href, layui.factory(url.hash.href));//动态加载模块

            if (device.mobile) {//如果是移动设备，那么点击菜单后自动隐藏菜单
                hideMenu();
            }
        }
    });

    // 动态加载左侧菜单
    $.getJSON(conf.preUrl() + 'data/menu.json', function (data) {
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
            console.debug('点击了菜单折叠按钮');
            $('body').toggleClass('css_collapse');
            if ($('body').hasClass('css_collapse')) {
                hideMenu();
            } else {
                showMenu();
            }
        }
    });

    // 根据窗口宽度动态展示或隐藏菜单
    var debounce = layui.debounce(function (e) {
        console.debug('触发窗口大小改变事件，需要重新判断是否展示菜单', '当前窗口宽度', $(window).width());
        if ($(window).width() <= 768) {
            hideMenu();
        } else {
            showMenu();
        }
    }, 10);
    debounce();
    $(window).resize(debounce);

    var api = {};
    exports('menu', api);
});