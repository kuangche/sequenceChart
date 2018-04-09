define(function(require){
	/* jQuery 方法扩展 */
    (function($){
    	/* 自定义元素方法 */
    	$.extend($.fn,{
    		/**
        	 * @name $.fn#initUI
    	     * @function   
    	     * @desc 格式化UI。
    	     * @param {Function} callback
    	     */
    		initUI: function(callback){
    			return this.each(function(){
    				mining.utils.initUI(this, callback);
    			});
    		},
    		/**
        	 * @name $.fn#hoverClass
    	     * @function   
    	     * @desc 鼠标经过className替换。
    	     * @param {String} className
    	     */
        	hoverClass:function(className){
    			var _className = className || 'hover';
    			return this.each(function(){
    				$(this).hover(function(){
    					$(this).addClass(_className);
    				},function(){
    					$(this).removeClass(_className);
    				});
    			});
    		},
    		/**
        	 * @name $.fn#isTag
    	     * @function   
    	     * @desc 标签判断。
    	     * @param {String} name
    	     */
        	isTag:function(name) {
    			if(!name || $(this)[0]==undefined || $(this)[0].tagName==undefined) return false;
    			return $(this)[0].tagName.toLowerCase() == name?true:false;
    		}
    	});
	})(jQuery);
});