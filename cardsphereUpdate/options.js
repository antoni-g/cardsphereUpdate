// load stored settings
chrome.storage.sync.get('settings', function(res) {
	addListeners();
});

function addListeners() {
	// add button listeners
	$(document).ready(function() {
		$('#saveColor').click(function() {
			console.log($($("#headingColor").spectrum('get')).val());
			console.log($($("#bodyColor").spectrum('get')).val());
		});
		$('#default').click(function() {
			$("#headingColor").prop('value','#ffff00');
			$("#bodyColor").prop('value','#ffff00'); 
		});
	});
}