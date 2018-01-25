var settings;
var saved = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  $(document).ready(function () {
    	save();
  });
});

function save() {
  $(".package").each(function(index,value) {
        var heading = $(value).find(".package-heading");
        var username = $($(heading).children()[0]).find("a").text();
        var price = $($(heading).children()[1]).find("strong").text();
        var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
        var contents =  ($(value).find(".package-body").text()).hashCode();
        saved[username] = {'price': price, 'efficiency': efficiency,'contents': contents};
      });
      // store settings
      settings = JSON.stringify(getSettings()).hashCode().toString();
      chrome.storage.local.set({'saved': saved}, function() {});
      chrome.storage.local.set({[settings]: saved}, function() {});
      var d = new Date();
      chrome.storage.local.set({'saved_last_accessed': d.toString()}, function() {});
      var time = settings+'_last_accessed'
      chrome.storage.local.set({[time]: d.toString()}, function() {});
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