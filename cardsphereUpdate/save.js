chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  var packages = document.getElementById('packages cs-row');
  var saved = {};
  $(document).ready(function () {
    	$(".package").each(function(index,value) {
    		var heading = $(value).find(".package-heading");
    		var username = $($(heading).children()[0]).find("a").text();
    		var price = $($(heading).children()[1]).find("strong").text();
    		var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
    		var contents =  ($(value).find(".package-body").text()).hashCode();

    		saved[username] = {'price': price, 'efficiency': efficiency,'contents': contents};
        console.log('Saving ' + username);
    	});
    	chrome.storage.local.set({'saved': saved}, function() {});
    	var d = new Date();
    	chrome.storage.local.set({'last_accessed': d.toString()}, function() {});
    	console.log("Saved, " + d.toString());
      console.log(saved);
  });
});

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