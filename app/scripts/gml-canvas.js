var GmlCanvas = function(containerId, options){
	'use strict';
	this.clear();
	this.containerId = containerId;
	
	var defaultSettings = {
		drawingFun : {},
		width : 500,
		height : 500,
		backgroundColor : [245,246,243],
		strokeColor : [0,0,0]
	};
	this.settings = utils.merge(defaultSettings, options);
};

GmlCanvas.prototype.render = function(gml, duration){
	'use strict';
	var _this = this;
	this.duration = duration;
	var el = document.getElementById(_this.containerId);
	if (!el){
		return;
	}
	// this.canvas = $('canvas')[0];

	this.canvas = document.createElement('canvas');
	el.appendChild(_this.canvas);
		var template = _.template($('#drawing-card-template').html());
	var t = $(template()).appendTo(el);
	$(t).prepend(this.canvas);

	this.points = gml.tag.drawing.stroke.pt;
	var processingInstance = new Processing( _this.canvas, _this._sketch(), _this);
};

GmlCanvas.prototype.clear = function(){
    'use strict';
	if (!this.canvas){
		return;
	}
	var context = this.canvas.getContext('2d');
    context.fillStyle = 'rgb(245,245,246)';
    context.fillRect(0,0,this.settings.width,this.settings.height);
};

GmlCanvas.prototype._sketch = function(){
	'use strict';
	var _this = this;
	return function(processing, $constants) {
		
		var duration = _this.duration;
		function setup() {
			processing.size(_this.settings.width, _this.settings.height);
			processing.background.apply(processing, _this.settings.backgroundColor);
			processing.stroke.apply(processing, _this.settings.strokeColor);
			processing.fill.apply(processing, _this.settings.strokeColor);

			_this.points.forEach(function(pt,index){
				var _pt = pt;
				var _index = index;
				if (index !==0){
					(function(){
						setTimeout(function(){
						_this.settings.drawingFun( processing, (_pt.x*_this.settings.width)-1, (_pt.y*_this.settings.height)-1, (_this.points[_index-1].x*_this.settings.width)-1 ,(_this.points[_index-1].y*_this.settings.height)-1);
						}, _pt.t*duration);
					})();
				}
			});
		}
		processing.setup = setup;
	};
};
