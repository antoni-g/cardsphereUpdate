
// check current packages against those that were stored and compare
var updated = false;
var packages = document.getElementById('packages cs-row');
chrome.storage.sync.get('last_saved', function(res) {
	// error check, see if there is no data in storage, else retreive date
	if (chrome.runtime.lastError) {
		// TODO: proper error check. How to even get error?
	}
	// else if (res[0] === undefined) {
	// 	// do nothing, not updated
	// }
	else {
		// iterate through each package listed on CS and lookup in returned hashmap
		$(document).ready(function () {
			console.log("ready");
  			$(".package").each(function(index,value) {
  				console.log(value);
  				// check by username
  				var check = $(value).find(".with-bg");
  				console.log($(check[0]).find().);
  			});
		});
	}
});

// display the date of the last time packages were saved
var msg;
chrome.storage.sync.get('last_accessed', function(res) {
	// error check, see if there is no data in storage, else retreive date
	if (res[0] === undefined) {
		msg = '<span class="caret"></span> Package Controls <font color="red">(No data stored for CSUpdate! Use the extension to save data for a comparison)</font>';
	}
	else if (!updated) {
		msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+res+'. There have been no changes.)</font>';
	}
	else {
		msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+res+')</font>';
	}
	var top = document.getElementById('filter-btn');
	top.innerHTML = msg;
});

