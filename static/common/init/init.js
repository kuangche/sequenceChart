define(function (require) {

    /**
     * @name Init
     * @class 全站公用，页面初始化
     * @requires jQuery
     * @author 李博龙
     * @version v1.0.0
     */

    var $ = require('jquery'),
        mining = {};

    /* 全局化常用方法 */
    window.mining = mining;
    
    /* 扩充mining */
    $.extend(mining,require('./config'));
    mining.utils = require('utils');
    require('./extend/utils');
    require.async('./extend/extend.css');
    mining.ajaxTimeout = mining.utils.loadLogin;
    
    /* 扩充jQuery方法 */
    require('./extend/jquery');
    

    /* 浏览器resize */
    mining.utils.winResize({
        name: function(){
            $.extend(mining.browser, mining.utils.getBrowserInfo());
        }
    }, true);
    
    /* 页面初始化 */
    $(function () {
        seajs.log('common init complete!');
    });
});
