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
		var config = $.extend(defOpts,options);
		var callBack = config.callBack;
		var id = config.id;
		var width = $('#'+id).width();
		var height = $('#'+id).height();
	
		//删除已有图层，重新渲染
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
				.attr('date', currDate)
				.attr('nodeid', nodeId)
				.attr('class','lincon')
				.attr('id', 'TLLine' + nodeId)
				.on('mouseover',function(){
					$('#TLLineCon .lincon').css('opacity',0.1);
					$(this).css('opacity',1);
					
					var nodeId = $(this).attr('nodeid');
					$('.y-line').css('opacity',0.3);
					$('#line'+nodeId).css('opacity',1);
				})
				.on('mouseout',function(){
					$('.lincon,.y-line').css('opacity',1);
				})
			
			//根据方向分组排序
			var newToPointListBig =[];//分组并排序后的数组(比当前点的坐标值大)
			options.toPointList.forEach(function(item){
				if(item[1] > options.currPoint[1]){//比较y轴的坐标值大小
					newToPointListBig.push(item)
				}
			});
			newToPointListBig.sort(function(a,b){
				return a[1]-b[1]
			});
			
			var newToPointListSmall =[];//分组并排序后的数组(比当前点的坐标值小)
			options.toPointList.forEach(function(item){
				if(item[1] < options.currPoint[1]){//比较y轴的坐标值大小
					newToPointListSmall.push(item)
				}
			});
			newToPointListSmall.sort(function(a,b){
				return b[1] - a[1]
			});
			
			//画统计交易数量的原点
			initCircle({
				content: lineCon,
				nodeId:nodeId,
				currDate:currDate,
				recordNum: options.toPointList.length,
				point: {
					x: options.currPoint[0],
					y: options.currPoint[1]
				}
			});

			newToPointListSmall.forEach(function(item, index) {
				//画点
				initCircle({
					content: lineCon,
					nodeId:nodeId,
					currDate:currDate,
					point: {
						x: item[0],
						y: item[1]
					}
				});
	
				var startPoint = index == 0 ? options.currPoint : newToPointListSmall[index - 1];
				var endPoint = newToPointListSmall[index];
	
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
					money: thousandBitSeparator(item[2]),
					startPoint: startPoint, //路径起点处
					endPoint: endPoint
				});
			});
			
			newToPointListBig.forEach(function(item, index) {
				//画点
				initCircle({
					content: lineCon,
					nodeId:nodeId,
					currDate:currDate,
					point: {
						x: item[0],
						y: item[1]
					}
				});
	
				var startPoint = index == 0 ? options.currPoint : newToPointListBig[index - 1];
				var endPoint = newToPointListBig[index];
	
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
					money: thousandBitSeparator(item[2]),
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
			var maxCount = config.nodeSize;
			var gap = config.nodeHeight
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
				.attr('id',function(pointY,index){
					return 'line'+(index+1)
				})
				.attr('transform', 'translate(0.5 0.5)')
				.append('line')
				.attr('transform', function(d, index){
			  		return 'translate(0, ' + (index*config.nodeHeight+ config.nodeHeight/2)+ ')';
			 	})
				.attr('stroke-dasharray', '2,2')
				.attr('x1', 0)
				.attr('x2', config.width);
			yLine.exit().remove();
		}
		
		/**
		 * function
		 * 初始化箭头方法
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
				.attr('class','centerPoint')
				.on('click',function(){
					callBack(this,$(this).attr('date'),$(this).attr('nodeid'))
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
			//计算可视区域内总天数
			var getDateIndex = function(date) {
				var start = moment(startDate);
				var end = moment(date);
				return end.diff(start, 'day');
			}
			var dayLong = getDateIndex(endDate) + 1;
			var unitLong = width / dayLong; //每天所占单元格长度（px）
			
			var xScale = d3.time.scale()
					.range([0, width])
					.domain([moment(startDate).toDate(), moment(endDate).toDate()]);
			
			//筛选在数据可视日期范围内的交易记录
			var formatData = [];
			data.forEach(function(item){
				var currDate = item.date;
				//判断当前日期是否在可视日期范围以内，如果不符合则过滤掉当前日期的数据
				if(moment(currDate).isAfter(startDate) && moment(currDate).isBefore(endDate)){
					//遍历当前日期内的所有人的交易记录
					item.record.forEach(function(nodeData){
						var toPointList = [];
						var currNodeId = nodeData.id;
						var currX = unitLong/2 + xScale(moment(currDate).toDate());//根据日期返回当前的x轴坐标
						var currY = (currNodeId-1)* config.nodeHeight + config.nodeHeight/2
						//遍历当前客户或者账号对其他的人或账号的转账记录
						nodeData.to.forEach(function(toData){
							var money = toData.money;
							//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、//
							var y = (toData.id-1)* config.nodeHeight + config.nodeHeight/2;
							//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、//
							toPointList.push([currX,y,money])
						});
						formatData.push({
							toPointList:toPointList,
							id:currNodeId,
							date:currDate,
							currPoint:[currX,currY]
						})
					})
				}
			});
			return formatData;
		}
		
		drawYAxis()
		var formatData = dataFormat(config.start,config.end,config.nodeSize,config.data,config.width);
		formatData.forEach(function(data){
			initRelationLine({
				svg: svg,
				toPointList:data.toPointList,
				currPoint: data.currPoint,
				date:data.date,
				id: data.id
			})
		});
	
	}
	module.exports = {
		init : initLine
	}
	
})