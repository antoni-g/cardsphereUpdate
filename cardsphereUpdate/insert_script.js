
// check current packages against those that were stored and compare
var updated = false;
var count = 0;
var packages = document.getElementById('packages cs-row');

// get settings, or use defaults
var bodyColor = '#ffb7b7';
var headingColor = '#ff6d6d';

chrome.storage.sync.get('settings', function(res) {
	console.log(res);
	/// then modify packages
	modifyPackages();
});

function modifyPackages() {
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
	  				var changing = false;
	  				//find elements
	  				var username = $($(heading).children()[0]).find("a").text();
	  				var price = $($(heading).children()[1]).find("strong").text();
	  				var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
	  				var contents =  $(value).find(".package-body").text().hashCode();
	  				//first check user
	  				if (res.saved[username] === undefined) {
	  					console.log(username + ' not present');
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// then price
	  				else if (res.saved[username].price !== price) {
	  					console.log('price difference for ' + username + ' : ' + price + ' now to ' + res.saved[username].price);
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// then efficiency 
	  				else if (res.saved[username].efficiency !== efficiency) {
	  					console.log('efficiency difference for ' + username + ' : ' + efficiency + ' now to ' + res.saved[username].efficiency);
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// else check package contents (is this going to be too slow?)
	  				else if (res.saved[username].contents !== contents) {
	  					console.log('contents difference for ' + username);
	  					changing = true;
	  					updated = true;
						count++;
	  				}

	  				if (changing) {
		  				// then  change color of package
		  				console.log('changing color of ' + username);
		  				console.log($(value.firstElementChild).attr('class'));
		  				if (!($(value.firstElementChild).attr('class') === 'package-heading premium')) {
		  					console.log($(value).find('package-heading'));
		  					$(value).find('.package-heading').css("background", headingColor);
		  				}
		  				$(value).find('.package-body').css("background", bodyColor);
		  				$(value).find('.package-footer').css("background", bodyColor);
		  			}
	  			});
	  			// insert the last saved date
	  			insertDate();
			});
		}
	});
}

function insertDate() {
	// display the date of the last time packages were saved
	var msg;
	chrome.storage.local.get('last_accessed', function(res) {
		// error check, see if there is no data in storage, else retreive date
		// TODO format this time string better
		var time = res.last_accessed;
		if (res === undefined) {
			msg = '<span class="caret"></span> Package Controls <font color="red">(No data stored for CSUpdate! Use the extension to save data for a comparison)</font>';
		}
		else if (updated === false) {
			msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+'. There have been no changes.)</font>';
		}
		else {
			msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+'. There are '+count+' new or different packages.)</font>';
		}
		var top = document.getElementById('filter-btn');
		top.innerHTML = msg;
	});
}
