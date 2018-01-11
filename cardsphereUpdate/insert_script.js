
// check current packages against those that were stored and compare
var updated = false;
var packages = document.getElementById('packages cs-row');
chrome.storage.local.get('saved', function(res) {
	// error check, see if there is no data in storage, else retreive date
	if (chrome.runtime.lastError) {
		// TODO: proper error check. How to even get error?
	}
	else if (res === undefined) {
	 	// do nothing, not updated
	}
	else {
		// iterate through each package listed on CS and lookup in returned hashmap
		$(document).ready(function () {
  			$(".package").each(function(index,value) {
  				// check by heading
  				var heading = $(value).find(".package-heading");
  				//first check user
  				var username = $($(heading).children()[0]).find("a").text();
  				// then price
  				var price = $($(heading).children()[1]).find("strong").text();
  				// then efficiency 
  				var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
  				// else check package contents (is this going to be too slow?)
  				var contents =  $(value).find(".package-body").text();

  				//change color of package
  				console.log('changing color of ' + username);
  				$(value).find('.package-heading').css("background", '#ff6d6d');
  				$(value).find('.package-body').css("background", '#ffb7b7');
  				$(value).find('.package-footer').css("background", '#ffb7b7');
  			});
		});
	}
});

// display the date of the last time packages were saved
var msg;
chrome.storage.local.get('last_accessed', function(res) {
	// error check, see if there is no data in storage, else retreive date
	// TODO format this time string better
	var time = res.last_accessed;
	if (res === undefined) {
		msg = '<span class="caret"></span> Package Controls <font color="red">(No data stored for CSUpdate! Use the extension to save data for a comparison)</font>';
	}
	else if (!updated) {
		msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+'. There have been no changes.)</font>';
	}
	else {
		msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+')</font>';
	}
	var top = document.getElementById('filter-btn');
	top.innerHTML = msg;
});

