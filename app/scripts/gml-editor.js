var app = app || {};

var MAX_POINTS = 1000;

app.gmlEditor = (function(){

	var pts = [],
		t1 = -1,
		width, height,
		canvas,
		draw, 
		width, 
		height;

	var _addPoint = function(x,y){
		var d = new Date();
		if (t1 ===-1 ){
			t1 = d;
		}
		var t = d-t1;
		pts.push({
			'x': (x/width),
			'y': (y/height),
			'z': 0,
			't': t
		});
		$('#m-pointcount').css('width', (pts.length / MAX_POINTS)*$('#draw-input').width());
	};

	var _updateTime = function(lastTime){
		pts.forEach(function(pt){
			pt.t = pt.t/(lastTime-t1);
		});
	};

	var _sketch = function(processing, $constants) {
		function setup() {
			processing.size(width, height);
			processing.background(245,246,243);
			processing.stroke(0);
			console.log('setting up');
		}
		function mousePressed(){
			clear();
			processing.fill(0);
			// processing.ellipse(processing.mouseX-1,processing.mouseY-1,2,2);
			_addPoint(processing.mouseX,processing.mouseY);
			console.log(pts);
		}
		function mouseDragged(){
			if (pts.length>=MAX_POINTS){
				return;
			}
			processing.fill(0);
			processing.stroke(0);

			// processing.ellipse(processing.mouseX-1,processing.mouseY-1,2,2);
			_addPoint(processing.mouseX,processing.mouseY);
			if (pts.length === 1)
				return;
			processing.line(pts[pts.length-1].x*(width-1),pts[pts.length-1].y*(height-1),pts[pts.length-2].x*(width-1),pts[pts.length-2].y*(height-1));


		}
		function mouseReleased(){
			var d = new Date();
			_updateTime(d);

		}
		processing.setup = setup;
		processing.mousePressed = mousePressed;
		processing.mouseDragged = mouseDragged;
		processing.mouseReleased = mouseReleased;
	};

	var getGML = function( callback ){

		var x2js = new X2JS();
		var gml = {};
		gml = {
			'tag':{
				'drawing':{
					'stroke': {
						'pt':[]
					}
				}
			}
		};
		pts.forEach(function(pt){
			gml.tag.drawing.stroke.pt.push(pt);
		});
		var xml= '<gml spec="1.0">'+ x2js.json2xml_str(gml) + '</gml>';
		var msg = {
			'gml' : xml,
			'time' : Date.now()
		};
		return xml;
	};

	var _draw = function(a,b){
	};

	/**
	 * Initializes a gml editor in a canvas element 
	 * @param {string} containerId : id of canvas element
	 * @param {function} drawingFunction drawing function in processing js
	 * @param {num} w width of canvas, defaults to 500
	 * @param {num} h height of canvas, defaults to 500
	 */
	var init = function( containerId, drawingFunction, w, h ){
		var el = document.getElementById(containerId);
		if (!el)
			return;
		canvas = $('canvas')[0];
		width = $('canvas').width();
		height = $('canvas').height();
		width = w || 500;
		height = h || 500;
		draw = drawingFunction || _draw;
		var processingInstance = new Processing( canvas, _sketch);
	};

	var clear = function(){
		pts = [];
		t1 = -1;
		var context = canvas.getContext('2d');
        context.fillStyle = 'rgb(245,246,243)';
        context.fillRect(0,0,width,height);
	};

	var drawGrid = function(){
		var context = canvas.getContext('2d');

		context.beginPath();
		context.moveTo(100, 150);
		context.lineTo(450, 50);
		context.stroke();
	};

	var getPoints = function(){
		return pts;
	};

	return {
		'init' : init,
		'getGML' : getGML,
		'clear' : clear,
		'getPoints' : getPoints
	};

})();
