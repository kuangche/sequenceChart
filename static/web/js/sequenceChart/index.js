define(function(require,exports,module){
	require('./mockData');
	$(function(){
		require('moment');
		var $dialog = require('dialog');
		var tree = require('./utils/tree');
		var timeLine = require('./utils/timeLine');
		var chart = require('./utils/chart');
		
		var startDate = '2016-01-01';
		var endDate = '2018-01-01';
		
		
		//获取ztree数据
		$.ajax({
			url:'/treeData',
			type:'get',
			success:function(data){
				var treeData = JSON.parse(data).data;
				//初始化ztree
				tree.init({
					id:'graphLegendTree',
					data:treeData,
					mounted:function(expandSize,data){
						inintChart(expandSize);
					},
					open:function(expandSize,data){
						inintChart(expandSize);
					},
					close:function(expandSize,data){
						inintChart(expandSize);
					}
				});
			},
			error:function(data){}
		})
		
		//弹框展示详细信息
		function dlgShowDetail(node,date,id){
			var dlg = $dialog({
				title: '详细记录',
				quickClose: true,
				align: 'right',
				content: '<dl>'+
							'<dt>2018-04-01<dd>'+
							'<dd><div>账号：321315646541654</div><div>|<div><div>账号：321315646541654</div><dd>'+
						'</dl>'+
						'<dl>'+
							'<dt>2018-04-03<dd>'+
							'<dd><div>账号：321315646541654</div><div>|<div><div>账号：321315646541654</div><dd>'+
						'</dl>'
			});
			dlg.show(node);
		}
		
		//获取时序图数据
		function getSequenceChartData(expandSize,callback){
			$.ajax({
				url:'/sequenceChartData',
				type:'get',
				success:function(data){
					callback(JSON.parse(data).data)
				},
				error:function(data){}
			})
		}
		
		function inintChart(expandSize){
			getSequenceChartData(expandSize,function(data){
				data.forEach(function(dateItem){
					dateItem.record.forEach(function(peopleItem){
						var id = peopleItem.id;
						var newArr = [];
						peopleItem.to.forEach(function(item){
							if(item.id == id) return;
							newArr.push(item)
						})
						peopleItem.to = newArr
					})
				})
				//时间轴
				timeLine.init({
					id:'timeLine',
					width:$('#timeLine').width(),
					height:$('#timeLine').height(),
					start:startDate,
					end:endDate,
					data:data,
					eventZoom:function(viewStartDate,viewEndDate){
						//画图
						chart.init({
							id:'chartbox',
							data:data,
							start:viewStartDate,
							end:viewEndDate,
							width:$('#timeLine').width(),
							height:$('#timeLine').height(),
							nodeSize:expandSize || 4,
							nodeHeight:36,
							callBack:dlgShowDetail
						});
					}
				});
				
			})
		}
		
		
	})
})
