define(function(require,exports,module){
	require('d3');
	require('moment');
	require.async('./timeline.css');
	
	var timeLine = function(options){
			var defaultConfig = {
				id:'timeLine',
				data:null,
				start: '2018-01-01',
				end: '2018-04-01',
				nodeSize: 10, //左侧tree展开节点数量
				minScale: 0.01,
				maxScale: 100,
				width: 2000,
				height: 80,
				locale: d3.locale({//不可删
	                "decimal": ",",
	                "thousands": " ",
	                "grouping": [3],
	                "dateTime": "%Y %B %e %A, %X",
	                "date": "%Y/%m/%d",
	                "time": "%H:%M:%S",
	                "periods": ["上午", "下午"],
	                "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
	                "shortDays": ["", "", "", "", "", "", ""],
	                "months": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
	                "shortMonths": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
	            }),
				axisFormat: function(xAxis) {
	                xAxis.ticks(10);//用来设定分段数量
	            },
				tickFormat: [
				  ["%b %d", function(d) { 
				  	return d.getDate() != 1; 
				  }],
				  ["%B", function(d) { 
				  	return d.getMonth();
				  }],
				  ["%Y", function() { 
				  	return true; 
				  }]
				],
				
				//event callback
				eventHover: null,
				eventZoom: null,
				eventClick: null,
			};
			
			var config = $.extend(defaultConfig,options);
			
			//删除已有图层，重新渲染
			d3.select('.timelinesvg').remove();
			
			var xScale = d3.time.scale(),
				yScale = d3.scale.linear(),
				svg = d3.select('#'+config.id)
						.append('svg')
						.classed('timelinesvg', true)
						.attr('width', config.width)
						.attr('height', config.height);
						
			// 绘制坐标轴
			var graph = svg.append('g')
						.classed('graph', true);
		
			//时间轴取值范围控制
			xScale.range([0, config.width]).domain([moment(config.start).toDate(), moment(config.end).toDate()]);
			
			function drawXAxis(){
				var tickFormatData = [];
				config.tickFormat.forEach(function(item){
					var tick = item.slice(0);
					tickFormatData.push(tick);
				});
				
				var tickFormat = config.locale ? config.locale.timeFormat.multi(tickFormatData) : d3.time.format.multi(tickFormatData);
				var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('top')
					.tickFormat(tickFormat);
					
				if(typeof config.axisFormat === 'function'){
					config.axisFormat(xAxis);
				}
				
				graph.select('.x-axis').remove();
				var xAxisEl = graph
					.append('g')
					.classed('x-axis', true)
					.attr('transform', 'translate(0, ' + config.height + ')')
					.call(xAxis);
					
				xAxisEl.selectAll('text')
					.attr('fill', '#707070');
			}
			drawXAxis();
			
			// Zoom控制
			var zoomWidth = config.width,
				zoomHeight = config.height,
				zoom = d3.behavior.zoom()
						.center(null)
						.scaleExtent([config.minScale, config.maxScale]) //scaleExtent 用于设置最小和最大的缩放比例
						.on('zoom', updateZoom),							//当 zoom 事件发生时，调用 zoomed 函数
				curx,
				cury,
				zoomRect;
			
			zoomRect = svg
				.append('rect')
				.call(zoom)			//call 相当于定义一个函数，再把选择的元素给它
				.classed('zoom', true)
				.attr('width', zoomWidth)
				.attr('height', zoomHeight)
				.attr('transform', 'translate(0, 0)');
			zoom.x(xScale);
			zoom.on('zoomend', zoomEnd);
          	
			if(typeof config.eventHover === 'function'){
				zoomRect.on('mousemover', function(d, e){
					var event = d3.event;
					if(curx == event.clientX && cury == event.clientY) return;
					curx = event.clientX;
					cury = event.clientY;
					zoomRect.attr('display', 'none');
					
					var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
					zoomRect.attr('display', 'block');
					if(el.tagName !== 'circle') return;
					config.eventHover(el);
				});
			}
			
			if(typeof config.eventClick === 'function'){
				zoomRect.on('click', function(d, e){
					zoomRect.attr('display', 'none');
					var el = document.elementFromPoint(d3.event.clientX, d3.event.clientY);
					zoomRect.attr('display', 'block');
					if(el.targetName !== 'circle') return;
					config.eventClick(el);
				});
			}
			
			function updateZoom(){
				if(d3.event.sourceEvent && d3.event.sourceEvent.toString() === '[object MouseEvent]'){
					zoom.translate([d3.event.translate[0], 0]);
				}
				
				if(d3.event.sourceEvent && d3.event.sourceEvent.toString() === '[object WheelEvent]'){
					zoom.scale(d3.event.scale);	//返回缩放级别（config.minScale, config.maxScale）
				}
				drawXAxis();
				//返回可是区域内时间范围
				var viewStartDate = moment(xScale.domain()[0]).format('YYYY-MM-DD');
				var viewEndDate = moment(xScale.domain()[1]).format('YYYY-MM-DD')
				drawDateBlock({
					con: svg,
					height:10,
					width:config.width,
					startDate: viewStartDate,
					endDate: viewEndDate,
					data: dataFromat(viewStartDate,viewEndDate,config.data)
				});
				
				showViewTime(viewStartDate,viewEndDate);
				
				//回调
				config.eventZoom(viewStartDate,viewEndDate);
			}
			
			function zoomEnd(){
				if(config.eventZoom){
					var viewStartDate = moment(xScale.domain()[0]).format('YYYY-MM-DD');
					var viewEndDate = moment(xScale.domain()[1]).format('YYYY-MM-DD')
					config.eventZoom(viewStartDate,viewEndDate);
				}
			}
			
			function showViewTime(start,end){
				if($('.ViewTime').size() ==0 ){
					$("#"+config.id).prepend("<div class='ViewTime' style='position: absolute;top: 5px;width: 100%;height: 30px;'></div>");
				}
				$('.ViewTime').empty().append(moment(start).format('YYYY-MM-DD')+ ' 至 ' +moment(end).format('YYYY-MM-DD'))
			}
			showViewTime(config.start,config.end)
			
			//画日期区块图
			function drawDateBlock(options){
				var defOpts = {
					con: null,
					height:5,
					startDate: '2017-01-01',
					endDate: '2017-02-01',
					data: [],
					color: '#4669bc'
				}
				var opts = $.extend(true, defOpts, options);
				
				//添加时间区块背景边框
				if($('.dateBlockBorder').size() ==0 ){
					$("#"+config.id).prepend("<div class='dateBlockBorder' style='border: 1px solid #ececec;position: absolute; z-index:1px; top: 45px;width: 100%;height: 10px;'></div>");
				}
				
				opts.con.select('.TLDateRange').remove();
				var dateBlock= svg
					.append('g')
					.classed('TLDateRange', true)
					.attr('transform', 'translate(0,0)');
				//计算天数
				var getDateIndex = function(date) {
					var start = moment(opts.startDate);
					var end = moment(date);
					return end.diff(start, 'day');
				}
		
				var width = opts.width;
				var height = opts.height;
		
				var dayLong = getDateIndex(opts.endDate) + 1;
				var unitLong = width / dayLong; //每个单元格长度（px）
		
				var formatData = [];
				opts.data.forEach(function(item){
					formatData.push({
						index:getDateIndex(item),
						date:item
					})
				});
				dateBlock.selectAll("rect")
					.data(formatData)
					.enter()
					.append("rect")
					.attr('title',function(d){return d.date})
					.attr("width", unitLong)
					.attr("height", height)
					.attr("x", function(d) {
						return d.index*unitLong;
					})
					.attr("y", 45)
					.attr("fill", opts.color);
			}
			
			drawDateBlock({
				con: svg,
				height:10,
				width:config.width,
				startDate: config.start,
				endDate: config.end,
				data: dataFromat(config.start,config.end,config.data)
			});
			config.eventZoom(config.start,config.end);
			
			
			/**
			 *时间轴数据格式化 
			 */
			function dataFromat(start,end,data){
				var dateBlock = [];
				data.forEach(function(item){
					var currDate = item.date;
					if(moment(currDate).isAfter(start) && moment(currDate).isBefore(end)){
						dateBlock.push(currDate);
					}
				});
				return dateBlock;
			}
		
	}
	module.exports = {
		init:timeLine
	}
})
