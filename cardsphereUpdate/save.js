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
  $(".package").each(function(index,value) {
    var heading = $(value).find(".package-heading");
    var username = $($(heading).children()[0]).find("a").text();
    var price = $($(heading).children()[1]).find("strong").text();
    var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
    var contents =  prepContents($(value).find(".package-body").text());
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
  console.log('Saved., yes!');
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