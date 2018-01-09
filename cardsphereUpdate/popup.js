// method taken from chrome extension tutorial
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((tgt) => {
    	var textSpace = document.getElementById('text');
    	if (!(tgt === 'https://www.cardsphere.com/send')) {
    		// display error message if not on the cardsphere site
    		var error ='<span>Not on Cardsphere\'s send page! Load it to use this extension.</span><br>';
    		textSpace.innerHTML += error;
    	} else {
    		// else show the correct buttons when on the cardsphere site
    		document.getElementById('buttons').style.display = 'block';
            $("#save").click(function() {
                savePackages();
            });
            $("#disp_mem").click(function() {
                printMem();
            });
    	}
    });
});

function savePackages() {
    // TODO - fix this. the scope of this document is the popup, not cardsphere
    var packages = document.getElementById('packages cs-row');
    var saved = {};
    $(document).ready(function () {
        $(".package").each(function(index,value) {
            console.log('adding package');
            var heading = $(value).find(".package-heading");
            var username = $($(heading).children()[0]).find("a").text();
            var price = $($(heading).children()[1]).find("strong").text();
            var efficiency = $($(heading).children()[1]).find(".efficiency-index").text();
            var contents =  $(value).find(".package-body").text();
            saved.username = {price,efficiency,contents};
        });
        console.log(JSON.stringify(saved));
        chrome.storage.sync.set({'saved': saved}, function() {});
        var d = new Date();
        chrome.storage.sync.set({'last_accessed': d.toString()}, function() {});
        document.getElementById('alert').style.display = 'block';
    });
}

// helper method
function printMem() {
    console.log('printing mem');
    chrome.storage.sync.get('saved', function(res) {
        console.log(res);
    });
    chrome.storage.sync.get('last_accessed', function(res) {
        console.log(res);
    });
}