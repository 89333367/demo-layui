layui.define(function (exports) {
    console.debug('加载 conf 模块');

    var api = {
        /**
        * 获取前置url
        * @returns 前置url
        */
        preUrl: function () {
            var origin = window.location.origin; // 返回完整的协议和域名，例如 "https://example.com"
            console.debug("Origin:", origin);
            //return origin;//有服务端的时候，并且页面和服务端在一个项目，返回origin即可
            //return 'https://api.uml-tech.com';//前后分离的时候，返回api的域名
            return '';//没有服务端的时候，返回空字符串，会使用data目录下的示例数据
        }
    };
    exports('conf', api);
});