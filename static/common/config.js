var staticUrl = (function(){
	var script = document.getElementsByTagName('script'),
		configsrc = 'static/common/config.js',
		baseurl = '';
	for(var i = 0; i < script.length; i++) {
		var idx = script[i].src.indexOf(configsrc);
		if( idx != -1) {
			baseurl = script[i].src.substr(0,idx) + 'static';
			seajs.timestamp = script[i].src.substr(idx + configsrc.length + 3, script[i].src.length);
			break;
		}
	}
	return baseurl;
})();
seajs.config({
    alias:{
        /* seajs 1111*/
        'seajs-combo':'seajs/seajs-combo/1.0.1/seajs-combo',
        'seajs-log':'seajs/seajs-log/1.0.1/seajs-log',
        'seajs-style':'seajs/seajs-style/1.0.2/seajs-style',
        'seajs-debug':'seajs/seajs-debug/1.1.1/seajs-debug',
        /* gallery */
        'dialog':'gallery/artdialog/6.0.0/dialog-plus',
        'autocompleter':'gallery/autocompleter/0.1.10/autocompleter',
        'colorpicker':'gallery/colorpicker/1.0.0/colorpicker',
        'cytoscape': 'gallery/cytoscape/2.7.4/cytoscape',
        'cytoscape-navigator': 'gallery/cytoscape-navigator/1.1.2/cytoscape-navigator',
        'cytoscape-navigatorcss': 'gallery/cytoscape-navigator/1.1.2/cytoscape.js-navigator.css',
        'cytoscape-ngraph-forcelayout': 'gallery/cytoscape-ngraph-forcelayout/1.2.9/cytoscape-ngraph-forcelayout',
        'cytoscape-panzoom': 'gallery/cytoscape-panzoom/1.0.2/cytoscape-panzoom',
        'cytoscape-panzoomcss': 'gallery/cytoscape-panzoom/1.0.2/cytoscape-panzoom.css',
        'cytoscape-edgehandles': 'gallery/cytoscape-edgehandles/2.2.1/cytoscape-edgehandles',
        'cytoscape-qtip': 'gallery/cytoscape-qtip/1.2.3/cytoscape-qtip',
        'jquery-qtip': 'gallery/jqueryqtip/2.2.0/jquery.qtip',
        'd3':'gallery/d3/3.5.5/d3',
        'daterangepicker':'gallery/daterangepicker/1.3.7/daterangepicker',
        'datetimepicker':'gallery/datetimepicker/2.0.0/datetimepicker',
        'draggabilly': 'gallery/draggabilly/2.0.0/draggabilly.pkgd.min',
        'html2canvas':'gallery/html2canvas/0.4.1/html2canvas',
        'easing':'gallery/easing/1.3.0/easing',
        'echarts':'gallery/echarts/3.2.1/echarts',
        'jquery':'gallery/jquery/1.11.1/jquery',
        'jqueryqtip':'gallery/jquery.qtip/3.0.3/jquery.qtip',
        'jqueryui':'gallery/jqueryui/1.11.2/jqueryui',
        'tablesorter':'gallery/jquery.tablesorter/jquery.tablesorter.min',
        'lightslider':'gallery/lightslider/1.1.5/lightslider',
        'modernizr': 'gallery/modernizr/2.6.2/modernizr',
        'moment':'gallery/moment/2.9.0/moment',
        'moment-range':'gallery/moment-range/1.0.9/moment-range',
        'mousewheel':'gallery/mousewheel/3.1.12/mousewheel',
        'pagination':'gallery/pagination/1.2.0/pagination',
        'sortable':'gallery/sortable/1.5.1/sortable',
        'scrollbar':'gallery/scrollbar/3.0.9/mCustomScrollbar',
        'select2':'gallery/select2/3.5.1/select2',
        'ztree':'gallery/ztree/3.5.17/ztree',
        'umeditor':'gallery/umeditor/1.2.2/main',
        'treetable':'gallery/treeTable/1.4.2/jquery.treeTable',
        /* utils */
        'utils':'utils/utils',
        /* init */
        'init':'init/init',
        'initscopa':'scopa/common/init'

    },
    base: (typeof staticUrl == 'undefined' ? '/static' : staticUrl) + '/common',
    map:[ [ /(^(?!.*(config|jquery|seajs-log|seajs-style|seajs-combo|seajs-debug|control|controldialog)\.(css|js)).*)$/i, '$1?t=' + seajs.timestamp] ],
    paths: {
    	baidu: staticUrl + '/common/gallery/baidu',
    	bootstrap: staticUrl + '/common/gallery/bootstrap',
    	scopa: staticUrl + '/scopa/js',
    	common: staticUrl + '/scopa/js/common',
    	core: staticUrl + '/scopa/js/core',
    	console: staticUrl + '/scopa/js/console',
    	harts: staticUrl + '/scopa/js/harts',
    	app: staticUrl + '/app'
    },
    preload:[ 'seajs-log', 'seajs-style'],
    //debug: (seajs.timestamp == '201609011800' ? true : false),
    preload:[ 'seajs-log', 'seajs-style'],
    debug: false,
    charset:'utf-8'
});
seajs.use('init');
