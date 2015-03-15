var app = app || {};

app.form = function($el, config){

	'use strict';

	var init = function( socket){
		app.gmlEditor.init('draw-input', 550,550);
		_bindListeners();
	};


	var _submit = function(){
		var entry = _getEntry();
		var isValid = _validateEntry(entry, function(err){
		});
		isValid ? _stubsubmit(entry) /*_uploadEntry(entry)*/ : false;
	};

	var _stubsubmit = function (entry) {
		var data = JSON.stringify(entry);
		var url = "data:application/octet-stream;base64," + Base64.encode(data);
		var iframe;
		iframe = document.getElementById("hiddenDownloader");
		if (iframe === null)
		{
		    iframe = document.createElement('iframe');  
		    iframe.id = "hiddenDownloader";
		    iframe.style.display = "none";
		    document.body.appendChild(iframe);
		}
		iframe.src = url;   

	}

	var _bindListeners = function(){
		//listen to erase
		$('.erase').on('click', function(){
			app.gmlEditor.clear();
		});

		$('.submit').on('click', function(){
			_submit();
			app.gmlEditor.clear();
		});
	};

	var _getEntry = function(){

		var textInput = $('#m-textarea').val();
		var imgInput = app.gmlEditor.getPoints();

		var entry = {
			text : textInput  || '',
			pts : app.gmlEditor.getGML()
		};

		// optonal input
		var optionalFieldInputs = {
			'age' : '#m-age',
			'name' : '#m-name',
			'country' : '#m-country',
		};
		for (var key in optionalFieldInputs){
			entry[key] = $(optionalFieldInputs[key]).val();
		}
		return entry;
	};

	var _validateEntry = function(entry){

		console.log(entry);
		// get required input (text or drawing)
		if (!entry.text && app.gmlEditor.getPoints().length===0){
			return false;
		}
		return true;
	};

	var _uploadEntry = function(entry){
		console.log('uploading');
		if (entry){
			entry.time = Date.now(); //add timestamp
			console.log('saving ' + JSON.stringify(entry));
			$.ajax({
				type: 'POST',
				url: 'http://54.68.129.229',
				crossDomain: true,
				data: JSON.stringify(entry),
				dataType: 'json',
				success: function(responseData, textStatus, jqXHR) {
					var value = responseData.someKey;
				},
				error: function (responseData, textStatus, errorThrown) {
					console.log('POST failed.');
				}
			});
		}
		return false;
	};

	return {
		'init' : init,
		'upload' : _uploadEntry
	};
};

(function() {
var form = new app.form($('#moon-form'));
form.init();
})();
