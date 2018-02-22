
// check current packages against those that were stored and compare
var updated = false;
var count = 0;

// get settings, or use defaults
var targetStored = 'saved';
var showOK = true;
var noData = false;
// color data
var bodyColor = '#FCF3CF';
var headingColor = '#f7dc6f';
var flagColor = '#ff0000';
var originalHeadingColor = $(".package-heading").not(".premium").first().css("background");
var originalBodyColor = $(".package-body").first().css("background");
// settings
var autosave = false;
var threshold = 2;
var flagsInsert = true;

chrome.storage.sync.get('settings', function(res) {
	if (res.settings === undefined) {
		// do nothing
	}
	else {
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
		if (res.settings.showOK !== undefined) {
			showOK = res.settings.showOK;
		}
		if (res.settings.threshold !== undefined) {
			threshold = res.settings.threshold;
		}
		if (res.settings.flags !== undefined) {
			flagsInsert = res.settings.flags;
		}
		if (res.settings.flagColor !== undefined) {
			flagColor = res.settings.flagColor;
		}
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
		else if ($.isEmptyObject(res)) {
		 	// do nothing, not updated
		 	noData = true;
		 	insertDate();
		}
		else {
			// iterate through each package listed on CS and lookup in returned hashmap
			$(document).ready(function () {
	  			$(".package").each(function(index,value) {
	  				// check by heading
	  				var heading = $(value).find(".package-heading");
	  				var changing = false;
	  				// find elements
	  				var username = $($(heading).children()[0]).find("a").text();
	  				var price = $($(heading).children()[1]).find("strong").text();
	  				var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
	  				var parsedEffi = efficiency.trim().split(" ")[0];
	  				var contents =  $(value).find(".package-body").text();
	  				contents = prepContents(contents);

	  				// insert flag
	  				var flags = {};
	  				var index = -1;
	  				// price thresholding
	  				var present = false;
	  				var ogPrice;
	  				var thresh;
	  				var upperBound;
	  				var lowerBound;
	  				var priceParsed;
	  				if (res[targetStored][username] !== undefined) {
	  					present = true;
	  					ogPrice = res[targetStored][username].price;
	  					ogPrice = Number(ogPrice.replace(/[^0-9\.-]+/g,""));
	  					thresh = threshold*5/100;
	  					upperBound = ogPrice+(ogPrice*thresh);
	  					lowerBound = ogPrice-(ogPrice*thresh);
	  					priceParsed = Number(price.replace(/[^0-9\.-]+/g,""));
	  				}
	  				// first check user
	  				if (!present) {
	  					changing = true;
	  					updated = true;
						count++;
						// insert flag
						index++;
						flags[index] = "Unsaved Package";
	  				}
	  				else {
	  					// then efficiency 
		  				if (res[targetStored][username].efficiency.trim().split(" ")[0] !== parsedEffi) {
		  					changing = true;
		  					updated = true;
							count++;
							// insert flag
							index++;
							flags[index] = "Efficiency";
		  				}
		  				// else check package contents (is this going to be too slow?)
		  				if (res[targetStored][username].contents !== contents) {
		  					if (!changing) {
		  						count++;
		  						changing = true;
		  						updated = true;
		  					}
							// insert flag
							index++;
							flags[index] = "Contents";
		  				}
		  				// then finally, price
		  				if ((priceParsed > upperBound) || (priceParsed < lowerBound)) {
		  					if (!changing) {
		  						count++;
		  						changing = true;
		  						updated = true;
		  					}
							// insert flag
							index++;
							flags[index] = "Price";
		  				}
	  				}
	  				if (changing) {
		  				// then  change color of package
		  				update = {'price': price, 'efficiency': efficiency,'contents': contents};
		  				// construct flag
		  				var flagString = "Changes: ";
		  				if (flags[0] == "Unsaved Package") {
		  					flagString = flags[0];
		  				}
		  				else if (index === 0) {
		  					flagString += flags[0];
		  				}
		  				else if (index > 0) {
		  					for (var i = 0; i++; i < index) {
		  						flagString += flags[i];
		  						flagString += ", ";
		  					}
		  					flagString += flags[index];
		  				}
		  				changePackage(value, username, update, flagString);
		  			}
	  			});
				// once done, insert the last saved date
				insertDate();
				// finally, autosave if necessary 
				if (autosave) {
					chrome.runtime.sendMessage({func: "autosave"}, function(response) {});
				}
			});
		}
	});
}

function changePackage(value, user, update, flags) {
	// first change the color of the package
	if (!($(value.firstElementChild).attr('class') === 'package-heading premium')) {
		$(value).find('.package-heading').css("background", headingColor);
	}
	$(value).find('.package-body').css("background", bodyColor);
	$(value).find('.package-footer').css("background", bodyColor);
	// get id
	var id = user.hashCode().toString();
	if (flagsInsert) {
		// insert change flags
		$(value).find('.package-body').append("<p style='color:"+flagColor+";' id='"+id+"Flag'><b>"+flags+"</b></p>");
	}
	// OK button 
	if (showOK) {
		$(value).find('.button-div').prepend("<button type='button' id='"+id+"Button'class='send-button btn btn-primary'>OK</button>");
		$('#'+id+"Button").click(function(){
			// recolor
			if (!($(value.firstElementChild).attr('class') === 'package-heading premium')) {
				$(value).find('.package-heading').css("background", originalHeadingColor);
			}	
			$(value).find('.package-body').css("background", originalBodyColor);
			$(value).find('.package-footer').css("background", originalBodyColor);
			// remove this package from saved data
			chrome.storage.local.get(targetStored, function(res){
				var ne = res;
				ne[targetStored][user] = update;
				chrome.storage.local.set({[targetStored]: ne[targetStored]}, function(){});
			});
			count--;
			// finally, hide button and update package count
			$('#'+id+'Button').hide();
			if (flagsInsert) {
				$('#'+id+'Flag').hide();
			}
			insertDate();
		});
	}
}

function insertDate() {
	// display the date of the last time packages were saved
	var msg;
	chrome.storage.local.get(targetStored+'_last_accessed', function(res) {
		// error check, see if there is no data in storage, else retreive date
		// TODO format this time string better
		var key = targetStored+'_last_accessed'
		var time = res[key];
		time = dateFormat(time, "dddd, mmmm dS, yyyy, h:MM:ss TT");
		if (res === undefined || $.isEmptyObject(res)) {
			msg = '<span class="caret"></span> Package Controls <font color="red">(No data stored for CSUpdate! Use the extension to save data for a comparison.)</font>';
		}
		else if (noData && (targetStored != 'saved')) {
			msg = msg = "<span class='caret'></span> Package Controls <font color='"+flagColor+"'>(No data stored for these selected settings! Use the extension to save data for a comparison.)</font>";
		}
		else if (updated === false || count === 0) {
			msg = "<span class='caret'></span> Package Controls <font color='"+flagColor+"'>(Packages last saved on "+time+". There have been no changes.)</font>";
		}
		else if (count === 1) {
			msg = "<span class='caret'></span> Package Controls <font color='"+flagColor+"'>(Packages last saved on "+time+". There is 1 new or different package.)</font>";
		}
		else {
			msg = "<span class='caret'></span> Package Controls <font color='"+flagColor+"'>(Packages last saved on "+time+". There are '+count+' new or different packages.)</font>";
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

function prepContents(contents) {
	contents = contents.split(/\s/g).clean("").clean("of");
	for (var i = 0; i < contents.length; i++) {
		if (contents[i].includes("$") || contents[i].includes("%")) {
			contents[i] = "";
		}
	}
	contents.clean("");
	return contents.join(" ").hashCode();
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};