
var utils = (function(){

	'use strict';

	var d1 = function(processing, x1,y1,x2,y2){
		processing.line(x1,y1,x2,y2);
	};

	var d2 = function(processing, x1,y1){
		processing.ellipse( x1,y1,2,2);
	};

	var merge = function(defaultObj, options){
		var key;
		for (key in defaultObj){
			defaultObj[key] = options[key] || defaultObj[key];
		}
		return defaultObj;
	};

	return {
		'd1' : d1,
		'd2' : d2,
		'merge' : merge
	};


})();