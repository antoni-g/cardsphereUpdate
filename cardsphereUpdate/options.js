// load stored settings
var headingColor = '#f7dc6f';
var bodyColor = '#FCF3CF';
var autosaving = false;
var savingSettings = false;
var showOK = true;
chrome.storage.sync.get('settings', function(res) {
	if (chrome.runtime.lastError) {
		// TODO: proper error check. How to even get error?
	}
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
	addListeners();
});

function addListeners() {
	// add button listeners
	$(document).ready(function() {
		// first update colors and values
		$("#headingColor").prop('value',headingColor);
		$("#bodyColor").prop('value',bodyColor);
		if (autosaving) {
			$('#autosave').prop('checked', true);
		}
		if (savingSettings) {
			$('#saveSettings').prop('checked', true);
		}
		if (showOK) {
			$('#okButton').prop('checked', true);
		}
		// save colors
		$('#saveColor').click(function() {
			bodyColor = $($("#bodyColor").spectrum('get')).val();
			headingColor = $($("#headingColor").spectrum('get')).val();
			chrome.storage.sync.get('settings', function(res) {
				chrome.storage.sync.set({'settings': {'body': bodyColor,
													  'heading': headingColor,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK}});
			});
		});
		// default colors
		$('#default').click(function() {
			$("#headingColor").prop('value','#f7dc6f');
			$("#bodyColor").prop('value','#FCF3CF'); 
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
													  'usingSettings': using,
													  'autosave': res.settings.autosave,
													  'showOK': res.settings.showOK}});
			});
		});
		// autosave
		$('#autosave').change(function(){
			var autosaving = false;
			if ($('#autosave').is(':checked')) {
				autosaving = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				res.autosave = autosaving;
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'usingSettings': res.settings.usingSettings,
													  'autosave':autosaving,
													  'showOK': res.settings.showOK}});
			});
		});
		// ok button
		$('#okButton').change(function(){
			var showing = false;
			if ($('#okButton').is(':checked')) {
				showing = true;
			}
			chrome.storage.sync.get('settings', function(res) {
				res.autosave = showing;
				chrome.storage.sync.set({'settings': {'body': res.settings.body,
													  'heading': res.settings.heading,
													  'usingSettings': res.settings.usingSettings,
													  'autosave': res.settings.autosave,
													  'showOK': showing}});
			});
		});
	});
}