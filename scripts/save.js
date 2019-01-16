var settings;
var saved = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.func === 'save') {
    $(document).ready(function () {
      save();
    });
  }
});

function save() {
  $(document).ready(function () {
    $(".package").each(function(index,value) {
      var heading = $(value).find(".package-heading");
      var username = $($(heading).children()[0]).find("a").text();
      var price = $($(heading).children()[1]).find("strong").text();
      var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
      efficiency = efficiency.trim().split(" ")[0].replace(/\n/g, '');
      // need to remove flags if present
      var contents =  $(value).find(".package-body").find('li').text();
      contents = prepContents(contents);
      saved[username] = {'price': price, 'efficiency': efficiency,'contents': contents};
    });
    // store settings
    settings = JSON.stringify(getSettings()).hashCode().toString();
    chrome.storage.local.set({'saved': saved}, function() {});
    chrome.storage.local.set({[settings]: saved}, function() {});
    var d = new Date();
    dateFormat(d, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    chrome.storage.local.set({'saved_last_accessed': d.toString()}, function() {});
    var time = settings+'_last_accessed'
    chrome.storage.local.set({[time]: d.toString()}, function() {});
  });
}
