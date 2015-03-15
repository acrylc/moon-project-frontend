app.renderer = (function(){

	'use strict';
	var count = 0;
	var render = function(entry,w){

		var obj = entry;
		var gml = (x2js.xml_str2json(obj.pts)).gml;
//debugger;
		if (gml.tag.drawing.stroke.pt.length===0){

			var template = _.template($('#text-card-template').html());
			$('#cards').append(template({'text':obj.text}));

		} else {
			// var r = Math.random();
			count+=1;
			var backColor = [240,240,240];
			var strokeColor = [3];
			if (count===11){
				backColor = [60,169,183];
				strokeColor = [255];
				count =0;
			}
			if (count ===4){
				strokeColor = [240,240,240];
				backColor = [40,45,50];

			}

			var g = new GmlCanvas('cards', {
				'width' : w,
				'height' : w,
				'drawingFun' : utils.d1,
				'backgroundColor' : backColor,
				'strokeColor' : strokeColor
			});
			g.render(gml, 9000);
		}
	};

	return {
		'render' : render
	};

})();