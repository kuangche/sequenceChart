define(function (require, exports, module) {

    /**
     * @name config
     * @class 公用常量、变量。
     */
    var config = {};
    config = {
        /**
         * @function
         * @desc 浏览器相关。
         * @example
         * Object{
	     *     w: 1024,
	     *     h: 768,
	     *     msie: false,
	     *     ie6: false,
	     *     iev: undefined
	     * }
         */
        browser: {
            w: 1024,
            h: 768,
            msie: false,
            ie6: false,
            iev: undefined
        },
        /**
         * @function
         * @desc 键盘操作。
         * @example
         * Object{
	     *     ENTER: 13, ESC: 27, END: 35, HOME: 36,
	     *     SHIFT: 16, TAB: 9,
	     *     LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
	     *     DELETE: 46, BACKSPACE:8
	     * }
         */
        keyCode: {
            ENTER: 13, ESC: 27, END: 35, HOME: 36,
            SHIFT: 16, CTRL: 17, TAB: 9,
            LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40,
            DELETE: 46, BACKSPACE:8
        }
    };

    return config;
});