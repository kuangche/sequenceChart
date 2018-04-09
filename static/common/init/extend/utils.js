define(function (require, exports, module) {

    /**
     * @name mining.utils
     * @class 扩展全局utils方法集。
     * @requires jQuery
     * @author 李博龙
     * @version v1.0.0
     */
	
    /*----- 扩展全局utils方法集 -----*/
	mining.utils = $.extend(mining.utils, {
		initUI: function(_box, callback){
			var $doc = $(_box || document);
			
			//select2
			$('input.select2-ipt, select.select2-ipt', $doc).each(function(){
				$(this).select2();
			});
			
			//daterangepicker
	    	if($('input.daterangebox-ipt', $doc).size()>0){
    			var _add = function($this){
    				if($this.data('daterangepicker'))return;
    				$this.daterangepicker({
	    	            format:'YYYY-MM-DD'
	    	        }, function(start, end, label) {
	    	        	console.log(start.toISOString(), end.toISOString(), label);
	    	        	var callback = $this.data('change');
	    	        	if(!mining.utils.isEmpty(callback) && $.isFunction(callback))callback.call($this);
	    	        });
    			}
    			$('input.daterangebox-ipt', $doc).each(function(){
	    			var $this = $(this);
	    			_add($(this));
	    		});
    			if(mining.utils.isEmpty(mining.daterangepicker)){
    				mining.daterangepicker = function(input){
    					setTimeout(function(){_add(input);},100)
    				}
    			}
	    	}
	    	
	    	//datetimepicker
	    	if($('input.datetimebox-ipt', $doc).size()>0){
    			var _add = function($this){
    				if($this.data('daterangepicker'))return;
    				$this.daterangepicker({
    					startDate: moment().format("YYYY-MM-DD")+' 12:00',
    					timePicker: true,
    					timePicker12Hour: false,
    		            singleDatePicker: true,
    		            timePickerIncrement: 1, 
	    	            format:'YYYY-MM-DD HH:mm'
	    	        }, function(start, end, label) {
	    	        	console.log(start.toISOString(), end.toISOString(), label);
	    	        	var callback = $this.data('change');
	    	        	if(!mining.utils.isEmpty(callback) && $.isFunction(callback))callback.call($this);
	    	        });
    			}
    			$('input.datetimebox-ipt', $doc).each(function(){
	    			var $this = $(this);
	    			_add($(this));
	    		});
    			if(mining.utils.isEmpty(mining.daterangepicker)){
    				mining.daterangepicker = function(input){
    					setTimeout(function(){_add(input);},100)
    				}
    			}
	    	}
			
			//validate form
	    	if($('form.required-validate', $doc).size()>0){
	    		require.async('validate',function(){
	    			$('form.required-validate', $doc).each(function(){
	    				var $form = $(this);
	    				$form.validate({
	    					onsubmit: false,
	    					focusInvalid: false,
	    					focusCleanup: true,
	    					errorElement: 'span',
	    					ignore:'.ignore',
	    					invalidHandler: function(form, validator) {
	    						var errors = validator.numberOfInvalids();
	    						if (errors) {
	    							//var message = DWZ.msg('validateFormError',[errors]);
	    							//alertMsg.error(message);
	    						} 
	    					}
	    				});
	    				
	    				$form.find('input[customvalid]').each(function(){
	    					var $input = $(this);
	    					$input.rules('add', {
	    						customvalid: $input.attr('customvalid')
	    					})
	    				});
	    			});
	    		});
	    	}
	    	$('input[type=radio]').addClass('ipt_radio');
	    	$('input[type=checkbox]').addClass('ipt_checkbox');
	    	$('input[disabled=disabled],textarea[disabled=disabled],select[disabled=disabled]').addClass('disabled');
	    	$('input[readonly=readonly],textarea[readonly=readonly],select[readonly=readonly]').addClass('readonly');
	    	$('input,textarea,select', $doc).each(function(){
	    		if(!mining.utils.isEmpty($(this).attr('class')) && $(this).attr('class').indexOf('required')!=-1){
	    			$(this).addClass('required');
	    		}
	    	});
	    	
	    	// 回调
	    	if($.isFunction(callback)){
	    		callback.call();
	    	}
    	},
    	/* 集体加hoverClass */
	    hoverClass: function(str){
			var array = new Array();
			array = str.split(",");
			for(var index in array){
				$(array[index]).hoverClass();
			}
		},
		loadLogin: function(){
			try{$dialog.getCurrent().close();}catch(e){}
			$dialog({
				title: '请重新登录',
				content: ['<div class="loginbox">',
					        '<form class="form-signin" onsubmit="return false;">',
					            '<strong class="title">登录</strong>',
					            '<div class="item">',
					                '<input name = "username" class="name required" type="text" placeholder="用户名" autofocus>',
					            '</div>',
					            '<div class="item">',
					                '<input name="password"  class="password required" type="password" placeholder="密码">',
					            '</div>',
					            '<div class="item">',
					                '<label class="remember"><input name="rememberme" id="rememberBox" type="checkbox" >保持登录状态</label>',
					                '<a class="forget" href="javascript:;">忘记密码？</a>',
					            '</div>',
					            '<input type="hidden" id="remember" name="remember">',
					            '<div class="item">',
					                '<input class="btn-submit" type="submit" value="登录">',
					            '</div>',
					        '</form>',
					    '</div>'].join(''),
				onshow: function(){
					var $d = this, $node = $(this.node);
					
	    			$('.main').addClass('blur');//添加背景模糊效果
					/* 修正浏览器自动填充密码后的黄色背景 */
			    	setTimeout(function(){
			    		$('input:-webkit-autofill').each(function(){
			        		var text = $(this).val();
			        		var name = $(this).attr('name');
			        		$(this).after(this.outerHTML).remove();
			        		$('input[name=' + name + ']').val(text);
			        	});
			    	},1000);
					$('.btn-submit',$node).on('click', function(){
						require.async('validate', function(){
							if($('[name=username]',$node).val()!='admin'){
								if(!$('form',$node).valid())return;
							}
							$ajax.ajax({
		            			url : '/trp/login/do_login_ajax/',
		                		data: JSON.stringify({
		                			username: $('[name=username]',$node).val(),
		                			password: $('[name=password]',$node).val(),
		                			remember: $('[name=rememberme]',$node).val()
		        				}),
		                		contentType : "application/json",
		                        type : 'POST',
		                        dataType : 'json',
		                        success: function(data){
		                        	if($('[name=username]',$node).val()!=$('.btn-user').text()){
		                        		mining.utils.gotoUrl('/trp/');
		                        		return;
		                        	}
		                        	$d.close();
		                        },
		                        error: function(){
		                        	$('.forget',$node).siblings('label.error').remove();
		                        	$('.forget',$node).after('<label for="attr_name" generated="true" class="error">用户名或密码错误，请检查</label>');
		                        }
		                	 });
						});
					});
					$('.name,.password',$node).on('focus', function(){
						$('.forget',$node).siblings('label.error').remove();
					});
				},
	    		onclose: function(){
	    			$('.main').removeClass('blur');//去除背景模糊效果
	    		}
			}).showModal();
		},
		alertMsg: function(data, msg, type){
			var _msg = (!mining.utils.isEmpty(msg)?msg:'');
			if(!mining.utils.isEmpty(data) && !mining.utils.isEmpty(data.message))_msg += ('：<b>'+data.message+'</b>');
			if(type=='success' || type=='warning' || type=='error'){
				$dialog.alert(_msg, type);
			}else{
				$dialog.alert(_msg);
			}
		}
    });
});