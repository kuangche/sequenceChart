define(function(require,exports,module) {
	require('d3');

	function initLine(options){
		var defOpts = {
			id:'chartbox',
			data:'',
			start:'2018-01-01',
			end:'2018-04-01',
			width:500,
			height:100,
			nodeSize:4,
			nodeHeight:30,
			callBack:function(){}
		}
		var opts = $.extend(defOpts,options);
		var callBack = opts.callBack;
		var id = opts.id;
		var width = $('#'+id).width();
		var height = $('#'+id).height();
	
		d3.select('#lineChart').remove();
		var svg = d3.select('#'+id).append("svg")
			.attr("id","lineChart")
			.attr("width", width)
			.attr("height", height);
	
		function initRelationLine(options) {
			//添加最外层容器
			var content;
			if(options.svg.selectAll('#TLLineCon')[0].length == 0) {
				content = options.svg.append('g')
					.attr('id', 'TLLineCon');
			} else {
				content = options.svg.selectAll('#TLLineCon');
			}
			//画箭头
			initArrow({
				content: content
			})
	
			//关系线容器
			var currDate = options.date;
			var nodeId = options.id;
			var lineCon = content.append('g')
				.attr('id', 'TLLine' + nodeId);
			
			options.pointList.forEach(function(item, index) {
				//画点
				var recordNum = 0;
				if(index == 0) {
					recordNum = options.pointList.length - 1;
				}
				
				initCircle({
					content: lineCon,
					nodeId:nodeId,
					currDate:currDate,
					recordNum: recordNum,
					point: {
						x: item[0],
						y: item[1]
					}
				});
	
				
				if(index == options.pointList.length - 1) return;
				var endPoint = options.pointList[index + 1];
				var startPoint = item;
	
				//画线
				initP2PLine({
					content: content,
					lineCon: lineCon,
					startPoint: startPoint,
					endPoint: endPoint,
				})
	
				//标注转账钱数
				inintMoneyText({
					content: lineCon,
					money: thousandBitSeparator(parseInt(Math.random() * 1000000)),
					startPoint: startPoint, //路径起点处
					endPoint: endPoint
				});
			})
		}
		
		/**
		 *画坐标轴 
		 */
		function drawYAxis(){
			// 最大数量（定义域的最大值）
			var maxCount = opts.nodeSize;
			var gap = opts.nodeHeight
			var gapArr = [];
			for(var i = 0; i < maxCount; i++){
				gapArr.push(i * gap);
			}
			
			svg.select('.y-axis').remove();
			var yAxisEl = svg
				.append('g')
				.classed('y-axis', true)
				.attr('transform', 'translate(0, 0)');
				
			var yLine = yAxisEl.selectAll('g').data(gapArr);
			yLine.enter()
				.append('g')
				.classed('y-line', true)
				.attr('transform', 'translate(0.5 0.5)')
				.append('line')
				.attr('transform', function(d, index){
			  		return 'translate(0, ' + (index*opts.nodeHeight+ opts.nodeHeight/2)+ ')';
			 	})
				.attr('stroke-dasharray', '2,2')
				.attr('x1', 0)
				.attr('x2', opts.width);
			yLine.exit().remove();
		}
		
		drawYAxis()
	
		/**
		 * function
		 * 箭头方法
		 */
		function initArrow(options) {
			var defOpts = {
				content: '',
				arrowPath: "M2,2 L10,6 L2,10 L6,6 L2,2",
				arrowColor: '#c9c9c9',
			}
			var opts = $.extend(true, defOpts, options);
	
			var defs = null;
			var arrowMarker = null;
			if($('#Tldefs').size() === 0) {
				defs = opts.content.append("defs")
					.attr('id', 'Tldefs');
	
				arrowMarker = defs.append("marker")
					.attr("id", "TLArrow")
					.attr("markerUnits", "strokeWidth")
					.attr("markerWidth", "10")
					.attr("markerHeight", "10")
					.attr("viewBox", "0 0 12 12")
					.attr("refX", "6")
					.attr("refY", "6")
					.attr("orient", "auto");
				arrowMarker.append("path")
					.attr("d", opts.arrowPath)
					.attr("fill", opts.arrowColor);
			}
		}
	
		/**
		 * function
		 *两点之间连线
		 * 箭头显示在路径终止处
		 */
		function initP2PLine(options) {
			var defOpts = {
				content: '',
				lineCon: '', //line容器——<g>
				startPoint: [0, 0], //路径起点处
				endPoint: [0, 0], //路径终点处
				lineWidth: 1,
				lineColor: '#c9c9c9',
				space: 15,
			}
			var opts = $.extend(true, defOpts, options);
	
			//绘制直线  
			var line = opts.lineCon.append("line")
				.attr("x1", opts.startPoint[0])
				.attr("y1", opts.startPoint[1])
				.attr("x2", opts.endPoint[0])
				.attr("y2", opts.endPoint[1] - (opts.endPoint[1] > opts.startPoint[1] ? opts.space : -opts.space))
				.attr("stroke", opts.lineColor)
				.attr("stroke-width", opts.lineWidth)
				.attr("marker-end", "url(#TLArrow)");
		}
	
		/**
		 * function
		 *绘制直线上的圆点、初始点添加统计数据
		 */
		function initCircle(options) {
			var defOpts = {
				point: {
					x: 0,
					y: 0
				}, //圆点坐标
				recordNum: 0,
				showNumRadius: 8,
				defaultRadius: 3,
				content: '',
				fontSize: 12,
				fontColor: '#000',
				fill: '#cae4fa',
				stroke: '#95bced',
				strokeWidth: 2
			}
	
			var opts = $.extend(true, defOpts, options);
			var opintG;
			if(opts.recordNum == 0){
				opintG = opts.content.append('g')
			}else{
				opintG = opts.content.append('g')
				.attr('date',opts.currDate)
				.attr('nodeid', opts.nodeId)
				.on('click',function(){
					callBack($(this).attr('date'),$(this).attr('nodeid'))
				});
			}
	
			var radius = opts.recordNum == 0 ? opts.defaultRadius : opts.showNumRadius;
			var circle = opintG.append('circle')
				.attr('cx', opts.point.x)
				.attr('cy', opts.point.y)
				.attr('r', radius)
				.attr('stroke', opts.stroke)
				.attr('stroke-width', opts.strokeWidth)
				.attr('fill', opts.fill);
	
			if(opts.recordNum !== 0) {
				var textMidd = opts.recordNum.toString().split('').length * 8; //文字偏移量 x轴 (4:一个数字所占像素)
				opintG.append('text')
					.text(opts.recordNum)
					.attr('fill', opts.fontColor)
					.attr('font-size', opts.fontSize)
					.attr('x', opts.point.x - textMidd / 2)
					.attr('y', opts.point.y + opts.fontSize / 2 - 1)
			}
		}
	
		/**
		 * function
		 * 两点之间，在连线上添加交易数据文字
		 */
		function inintMoneyText(options) {
			var defOpts = {
				content: null,
				startPoint: [0, 0],
				endPoint: [0, 0],
				money: 0,
				fontSize: 12,
				fontColor: '#c9c9c9'
			}
	
			var opts = $.extend(true, defOpts, options);
			var textPoint = {
				x: 0,
				y: 0,
			};
			var textLong = opts.money.toString().split('').length * 8 - 10; //文字偏移量 x轴 (4:一个数字所占像素)
			textPoint.x = opts.startPoint[0] - textLong / 2 + 5;
			textPoint.y = opts.startPoint[1] + (opts.endPoint[1] - opts.startPoint[1]) / 2 + (opts.endPoint[1] < opts.startPoint[1] ? opts.fontSize : 0);
	
			//交易数据文字添加白色背景
			/*opts.content.append('rect')
				.attr('fill', 'white')
				.attr('x', textPoint.x)
				.attr('y', textPoint.y - opts.fontSize)
				.attr('width', textLong)
				.attr('height', opts.fontSize)*/
			opts.content.append('text')
				.text(opts.money)
				.attr('fill', opts.fontColor)
				.attr('font-size', opts.fontSize)
				.attr('x', textPoint.x)
				.attr('y', textPoint.y)
		}
	
		/**
		 *function
		 * 数字千分符格式
		 */
		function thousandBitSeparator(num) {
			var num = (num || 0).toString(), result = '';
		    while (num.length > 3) {
		        result = ',' + num.slice(-3) + result;
		        num = num.slice(0, num.length - 3);
		    }
		    if (num) { result = num + result; }
		    return result;
		}
		
		/**
		 *数据格式化 
		 */
		function dataFormat(startDate,endDate,nodeSize,data,width){
			var xScale = d3.time.scale();
			xScale.range([0, width]).domain([moment(startDate).toDate(), moment(endDate).toDate()]);
			
			var formatData = [];
			data.forEach(function(item){
				var currDate = item.date;
				if(moment(currDate).isAfter(startDate) && moment(currDate).isBefore(endDate)){
					item.record.forEach(function(nodeData){
						var pointList = [];
						var x = xScale(moment(currDate).toDate());
						nodeData.to.forEach(function(toData){
							if(toData.id == nodeData.id)return;
							var y = (toData.id-1)* opts.nodeHeight + opts.nodeHeight/2;
							pointList.push([x,y])
						});
						formatData.push({
							pointList:pointList,
							id:nodeData.id,
							date:currDate
						})
					})
				}
			});
			return formatData;
		}
		
		var formatData = dataFormat(opts.start,opts.end,opts.nodeSize,opts.data,opts.width);
		
		formatData.forEach(function(data){
			initRelationLine({
				svg: svg,
				pointList:data.pointList,
				date:data.date,
				id: data.id
			})
		});
	
	}
	module.exports = {
		init : initLine
	}
	
})