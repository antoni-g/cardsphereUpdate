// load stored settings
var headingColor = '#f7dc6f';
var bodyColor = '#FCF3CF';
var flagColor = '#FF0000';
var autosaving = false;
var savingSettings = false;
var showOK = true;
var threshVal = 2;
var flags = true;
chrome.storage.sync.get('settings', function(res) {
	// first, if no settings are saved, save defaults
	if (res === undefined) {
		chrome.storage.sync.set({'settings': {'body': '#FCF3CF',
													  'heading': '#f7dc6f',
													  'flagColor': '#ff0000',
													  'usingSettings': false,
													  'autosave': false,
													  'showOK': true,
													  'flags': true,
													  'threshold': 2}});
	}
	if (chrome.runtime.lastError || res.settings === undefined) {
		// TODO: proper error check. How to even get error?
		// do nothing
	}
	else {
		if (res.settings.body !== undefined) {
			bodyColor = res.settings.body;
		}
		if (res.settings.heading !== undefined) { 
			headingColor = res.settings.heading;
		}
		if (res.settings.autosave !== undefined) {
			autosaving = res.settings.autosave;
		}
		if (res.settings.autosave !== undefined) {
			savingSettings = res.settings.usingSettings;
		}
		if (res.settings.showOK !== undefined) {
			showOK = res.settings.showOK;
		}
		if (res.settings.threshold !== undefined) {
			threshVal = res.settings.threshold;
		}
		if (res.settings.flags !== undefined) {
			flags = res.settings.flags;
		}
		if (res.settings.flagColor !== undefined) {
			flagColor = res.settings.flagColor;
		}
	}
	addListeners();
});

	// add button listeners
function addListeners() {
	$(document).ready(function() {
		// first update colors and values
		$("#headingColor").prop('value',headingColor);
		$("#bodyColor").prop('value',bodyColor);
		$("#flagColor").prop('value',flagColor);
		if (autosaving) {
			$('#autosave').prop('checked', true);
		}
		if (savingSettings) {
			$('#saveSettings').prop('checked', true);
		}
		if (showOK) {
			$('#okButton').prop('checked', true);
		}
		if (flags) {
			$('#flagButton').prop('checked', true);
		}
		// save colors
		$('#saveColor').click(function() {
			bodyColor = $($("#bodyColor").spectrum('get')).val();
			headingColor = $($("#headingColor").spectrum('get')).val();
			flagColor = $($("#flagColor").spectrum('get')).val();
			chrome.storage.sync.get('settings', function(res) {
				console.log(res);
				chrome.storage.sync.set({'settings': {'body': bodyColor,
													  'heading': headingColor,
													  'flagColor': flagColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK,
													  'flags': res.settings.flags,
													  'threshold': res.settings.threshold}});
			});
			chrome.storage.sync.get('settings', function(res) {
				console.log(res);
			});
		});
		// default colors
		$('#default').click(function() {
			$("#headingColor").prop('value','#f7dc6f');
			$("#bodyColor").prop('value','#FCF3CF'); 
			$("#flagColor").prop('value','#FF0000'); 
		});
		// only compare same settings
		$('#saveSettings').change(function(){
			var using = false;
			if ($('#saveSettings').is(':checked')) {
				using = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				res.usingSettings = using;
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'flagColor': res.settings.flagColor,
													  'usingSettings': using,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK,
													  'flags': res.settings.flags,
													  'threshold': res.settings.threshold}});
			});
		});
		// autosave
		$('#autosave').change(function(){
			var autosaving = false;
			if ($('#autosave').is(':checked')) {
				autosaving = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'flagColor': res.settings.flagColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave':autosaving,
													  'showOK': res.settings.showOK,
													  'flags': res.settings.flags,
													  'threshold': res.settings.threshold}});
			});
		});
		// ok button
		$('#okButton').change(function(){
			var showing = false;
			if ($('#okButton').is(':checked')) {
				showing = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'flagColor': res.settings.flagColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': showing,
													  'flags': res.settings.flags,
													  'threshold': res.settings.threshold}});
			});
		});
		// flags 
		$('#flagButton').change(function(){
			var flags = false;
			if ($('#flagButton').is(':checked')) {
				flags = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'flagColor': res.settings.flagColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK,
													  'flags': flags,
													  'threshold': res.settings.threshold}});
			});
		});
		// price threshold
		var slider = document.getElementById("threshold");
		slider.value = threshVal;
		$("#thresholdValue").text(threshVal*5+"%");
		$('#threshold').attr("value", threshVal);
		slider.oninput = function() {
			var val = this.value;
    		$("#thresholdValue").text(val*5+"%");
    		chrome.storage.sync.get('settings', function(res) {
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'flagColor': res.settings.flagColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK,
													  'flags': res.settings.flags,
													  'threshold': val}});
			});
		}
		// defaults
		$('#revertDefault').click(function() {
			chrome.storage.sync.set({'settings': {'body': '#FCF3CF',
													  'heading': '#f7dc6f',
													  'flagColor': '#ff0000',
													  'usingSettings': false,
													  'autosave': false,
													  'showOK': true,
													  'flags': true,
													  'threshold': 2}});
			// revert all displays to defaults
			$("#headingColor").prop('value','#f7dc6f');
			$("#bodyColor").prop('value','#FCF3CF');
			$("#flagColor").prop('value','#FF0000');
			$('#saveSettings').prop('checked', false);
			$('#autosave').prop('checked', false);
			$('#okButton').prop('checked', true);
			$('#flagButton').prop('checked',true);
			slider.value = 2;
			$("#thresholdValue").text("10%");
		});
	});
}