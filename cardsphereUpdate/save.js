chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  var packages = document.getElementById('packages cs-row');
  var saved = {};
  $(document).ready(function () {
    	$(".package").each(function(index,value) {
    		var heading = $(value).find(".package-heading");
    		var username = $($(heading).children()[0]).find("a").text();
    		var price = $($(heading).children()[1]).find("strong").text();
    		var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
    		var contents =  $(value).find(".package-body").text();

    		saved[username] = {price,efficiency,contents};
        console.log('Saving ' + username);
    	});
    	chrome.storage.local.set({'saved': saved}, function() {});
    	var d = new Date();
    	chrome.storage.local.set({'last_accessed': d.toString()}, function() {});
    	console.log("Saved, " + d.toString());
      console.log(saved);
  });
});