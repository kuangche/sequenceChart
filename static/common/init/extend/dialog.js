define(function (require, exports, module) {
	
	/* dialog扩展 */
	var $ = require('jquery'),
		$dialog = require('dialog');
	
	/**
     * 顶级zIndex
     */
	$dialog.topIndex = function(){
		if(mining.utils.isEmpty($dialog) || mining.utils.isEmpty($dialog.list)) return 2014;
		var indexArr  = [];
		$.each($dialog.list, function(i,n){
			indexArr.push(n.zIndex);
		});
		return indexArr.max()+1;
	}
	
    /**
     * 警告
     * @param   {String, HTMLElement}   消息内容
     * @param   {Function}              (可选) 回调函数
     */
	$dialog.alert = function (content, type, time, callback) {
    	var time_def = 10000,
    		title;
    	
    	if(typeof content == 'number'){
    		content += '';
    	}
    	if(typeof content != 'string'){
    		seajs.log("调用 $dialog.alert 时类型出错！暂只支持字符型，请检查。");
    		return;
    	}
    	
    	//关闭前一个弹框
    	if(!mining.utils.isEmpty($dialog.get('Alert'))){
    		$dialog.get('Alert').close();
    	}
    	
    	if(typeof type == 'number'){
    		time_def = type;
    		type = 'message';
    	}else if(typeof type == 'function'){
    		callback = type;
    		type = 'message';
    	}
    	if(typeof time == 'function'){
    		callback = time;
    	}
    	if(typeof time == 'number'){
    		time_def = time;
    	}
    	
    	if(type=='success'){
			title = '成功啦';
			content = '<span class="artui-dialog-alert-success"></span><span>' + content + '</span>';
		}else if(type=='warning'){
			title = '提醒';
			content = '<span class="artui-dialog-alert-warning"></span><span>' + content + '</span>';
		}else if(type=='error'){
			title = '出错啦';
			content = '<span class="artui-dialog-alert-error"></span><span>' + content + '</span>';
			time_def = 300000;
		}else{
			title = '消息';
		}
    	content = '<div class="artui-dialog-alert">'+content+'</div>';
    	
    	var $d = $dialog({
        	title: title,
            id: 'Alert',
            zIndex: $dialog.topIndex(),
            fixed: true,
            time: time_def,
            padding: '15px 30px',
            content: content,
            okValue: '知道了',
            ok: true,
            onbeforeremove: callback
        }).show();
    	
    	if(time_def != 0){
    		setTimeout(function () {
        		$d.close().remove();
            }, time_def);
    	}
    	
        return $d;
    };


    /**
     * 确认选择
     * @param   {String, HTMLElement}   消息内容
     * @param   {Function}              确定按钮回调函数
     * @param   {Function}              取消按钮回调函数
     */
    $dialog.confirm = function (options) {
    	options = $.extend({
    		id: 'Confirm',
    		title: '提醒',
    		content: '您确定要执行本操作？',
    		zIndex: $dialog.topIndex(),
    		fixed: true,
            padding: '15px 30px',
    		cancelValue: '取消',
    		cancel: true,
    		okValue: '确定',
    		ok: true,
    		onshow: function(){
    			$('.main').addClass('blur');//添加背景模糊效果
    		},
    		onclose: function(){
    			$('.main').removeClass('blur');//去除背景模糊效果
    		}
        }, options);
    	
    	options.content = '<span class="artui-dialog-confirm"></span><span>' + options.content + '</span>';
        return $dialog(options).showModal();
    };
});