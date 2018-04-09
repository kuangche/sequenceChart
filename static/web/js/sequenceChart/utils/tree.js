define(function(require,exports,module){
	require('ztree');
	
	var initTree = function(options){
		var defOpts = {
			data:null,
			id:null,
			mounted:function(){},
			open:function(){},
			close:function(){}
		}
		var opts = $.extend(defOpts,options);
		
		var setting = {
			data: {
				key: {
					title:"t"
				},
				simpleData: {
					enable: true
				},
			},
			view: {
				showLine: false
			},
			callback: {
				onExpand: onExpand,
				onCollapse: onCollapse,
			}
		};

		//展开操作
		function onExpand(event, treeId, treeNode) {
			var treeId = opts.id
			var expandSize = getExpandSize(treeId);
			var data = $.fn.zTree.getZTreeObj(treeId).getNodes();
			opts.open(expandSize,data);
		};
		
		//收缩操作
		function onCollapse(event, treeId, treeNode) {
			var treeId = opts.id
			var expandSize = getExpandSize(treeId);
			var data = $.fn.zTree.getZTreeObj(treeId).getNodes();
			opts.close(expandSize,data);
		};
		
		function getExpandSize(id){
			var data = $.fn.zTree.getZTreeObj(id).getNodes();
			var size = 0;
			data.forEach(function(item){
				size++;
				if(item.open){
					size += item.children.length;
				}
			});
			return size;
		}
		
		$.fn.zTree.init($('#'+opts.id), setting, opts.data);
		
		//初始化完成
		var treeId = opts.id
		var expandSize = getExpandSize(treeId);
		opts.mounted(expandSize,opts.data)
	}
	
	module.exports = {
		init:initTree
	}
})
