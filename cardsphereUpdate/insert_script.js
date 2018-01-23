
// check current packages against those that were stored and compare
var updated = false;
var count = 0;
var packages = document.getElementById('packages cs-row');

// get settings, or use defaults
var targetStored = 'saved';
var bodyColor = '#FCF3CF';
var headingColor = '#f7dc6f';
// TODO
var autosave = false;

chrome.storage.sync.get('settings', function(res) {
	//update settings if present
	if (res.settings.body !== undefined) {
		bodyColor = res.settings.body;
	}
	if (res.settings.heading !== undefined) { 
		headingColor = res.settings.heading;
	}
	if (res.settings.usingSettings !== undefined) {
		if (res.settings.usingSettings) {
			targetStored = JSON.stringify(getSettings()).hashCode().toString();
		}
	}
	if (res.settings.autosave !== undefined) {
		autosave = res.settings.autosave;
	}
	// recolor packages
	modifyPackages();
});

function modifyPackages() {
	chrome.storage.local.get(targetStored, function(res) {
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
	  				if (res[targetStored][username] === undefined) {
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// then price
	  				else if (res[targetStored][username].price !== price) {
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// then efficiency 
	  				else if (res[targetStored][username].efficiency !== efficiency) {
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				// else check package contents (is this going to be too slow?)
	  				else if (res[targetStored][username].contents !== contents) {
	  					changing = true;
	  					updated = true;
						count++;
	  				}
	  				if (changing) {
		  				// then  change color of package
		  				console.log(username);
		  				update = {'price': price, 'efficiency': efficiency,'contents': contents};
		  				changePackage(value, username, update, targetStored);
		  			}
	  			});
				// once done, insert the last saved date
				insertDate();
			});
		}
	});
}

function changePackage(value, user, update, target) {
	console.log(user);
	var originalHeadingColor = $(value).find('.package-heading').prop("background");
	var originalBodyColor = $(value).find('.package-body').prop("background");
	// first change the color of the package
	if (!($(value.firstElementChild).attr('class') === 'package-heading premium')) {
		$(value).find('.package-heading').css("background", headingColor);
	}
	$(value).find('.package-body').css("background", bodyColor);
	$(value).find('.package-footer').css("background", bodyColor);
	// then insert the ok button
	$(value).find('.button-div').prepend("<button type='button' id='"+user+"'class='bt btn-primary'>OK</button>")
	$('#'+user).click(function(){
		// update stored data to remove this as a new package
		// recolor
		// if (!($(value.firstElementChild).attr('class') === 'package-heading premium')) {
		// 	$(value).find('.package-heading').css("background", originalHeadingColor);
		// }
		// $(value).find('.package-body').css("background", originaBodyColor);
		// $(value).find('.package-footer').css("background", originalBodyColor);
		// finally, hide button
		$('#'+user).hide();
	});
}

function updateSaved(user, update, target) {
	// place hold for huh
	chrome.storage.local.get(targetStored, function(res){
		res[targetStored][user] = update;
		chrome.storage.local.set(res, function(){});
	})
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
		else if (count === 1) {
			msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+'. There is 1 new or different package.)</font>';
		}
		else {
			msg = '<span class="caret"></span> Package Controls <font color="red">(Packages last saved on '+time+'. There are '+count+' new or different packages.)</font>';
		}
		var top = document.getElementById('filter-btn');
		top.innerHTML = msg;
	});
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getSettings() {
  return {'countries': $('#countries').val(),
          'cutoff': $('#cutoff').val(),
          'min-package': $('#min-package').val(),
          'sort': $('select[name=sort] :selected').val(),
          'maximize': $('select[name=package] :selected').val()}
}