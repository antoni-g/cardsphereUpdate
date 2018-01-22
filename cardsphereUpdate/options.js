// load stored settings
var headingColor = '#f7dc6f';
var bodyColor = '#FCF3CF';
chrome.storage.sync.get('settings', function(res) {
	if (res.settings.body !== undefined) {
		bodyColor = res.settings.body;
	}
	if (res.settings.heading !== undefined) { 
		headingColor = res.settings.heading;
	}
	addListeners();
});

function addListeners() {
	// first update colors
	$("#headingColor").prop('value',headingColor);
	$("#bodyColor").prop('value',bodyColor); 
	// add button listeners
	$(document).ready(function() {
		$('#saveColor').click(function() {
			bodyColor = $($("#bodyColor").spectrum('get')).val();
			headingColor = $($("#headingColor").spectrum('get')).val();
			chrome.storage.sync.get('settings', function(res) {
				res.body = bodyColor;
				res.heading = headingColor;
				console.log(res);
				chrome.storage.sync.set({'settings': res}, function() {
					chrome.storage.sync.get('settings', function(res) {
						console.log(res)
					});
				});
			});
		});
		$('#default').click(function() {
			$("#headingColor").prop('value','#f7dc6f');
			$("#bodyColor").prop('value','#FCF3CF'); 
		});
	});
}