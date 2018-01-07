
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
  			$(".package").each(function(index,value) {
  				// check by heading
  				var heading = $(value).find(".package-heading");
  				var username = $($(heading).children()[0]).find("a").text();
  				var price = $($(heading).children()[1]).find("strong").text();
  				var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
  				// else check package contents (is this going to be too slow?)
  				var contents =  $(value).find(".package-body").text();
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

