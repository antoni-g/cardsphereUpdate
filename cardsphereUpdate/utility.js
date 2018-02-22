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

function prepEfficiency(effi) {
  
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