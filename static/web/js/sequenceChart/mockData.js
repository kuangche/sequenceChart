define(function(require) {
    require('./mock/1.0/mock');
    var Random = Mock.Random;
    var data = [
		{
			date:'2017-05-06',
	    	record:[
		    	{
		    		name:'北京压力山大贸易有限公司',
					id:'1',
		    		to:[{
		    			name:'130955198904',
			    		id:'2',
			    		money:15611
		    		},{
		    			name:'北京熊二贸易有限公司',
		    			id:'4',
		    			money:5415
		    		}]
		    	},
		    	{
		    		name:'130955198904',
		    		id:'2',
		    		to:[{
		    			name:'北京压力山大贸易有限公司',
						id:'1',
			    		money:15611
		    		},{
		    			name:'北京熊二贸易有限公司',
		    			id:'4',
		    			money:5415
		    		}]
		    	}
	    	]
    	}
	];
    
    Mock.mock('/sequenceChartData', 'get', {
    	'data|1-200': [{
	        'date': '@date("yyyy-MM-dd")',
	        'record|1-3':[
	        	{
	        		'name': '@cname',
					'id': '@integer( 1, 7 )',
		    		'to|4':[{
		    			'name': '@cname',
			    		'id|+1': '@integer( 1, 7 )',
			    		'money':'@integer(0, 10000000)'
		    		}]

	        	}
	        ],
	    }]
    });
    Mock.mock('/treeData', 'get', {
    	data: [
			{ id:1, pId:0, name:"北京压力山大贸易有限公司", t:"我很普通，随便点我吧"},
			{ id:2, pId:0, name:"130955198904", t:"点我可以，但是不能点我的子节点，有本事点一个你试试看？"},
			{ id:3, pId:0, name:"320955198904858387", t:"你哪个单位的？敢随便点我？小心点儿.."},
			{ id:4, pId:0, name:"北京熊二贸易有限公司", t:"唉，随便点我吧"},
			{ id:5, pId:0, name:"13521885555", t:"点我可以，但是不能点我的子节点，有本事点一个你试试看？"},
			{ id:6, pId:0, name:"9871244", t:"你哪个单位的？敢随便点我？小心点儿.."},
			{ id:7, pId:0, name:"北京熊大贸易有限公司", t:"唉，随便点我吧"}
		]
    });
});
