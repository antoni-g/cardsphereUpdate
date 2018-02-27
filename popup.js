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

// autosave functionality
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.func === 'autosave') {
        savePackages();
    }
});

document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((tgt) => {
        $('#alert').css('visibility', 'hidden');
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
            $("#options").click(function() {
                chrome.runtime.openOptionsPage();
            });
    	}
    });
});

function savePackages() { 
    // send message to save.js content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {func: "save"}, function(response) {
            console.log('Saved.');
        });
    });

    var d = new Date();
    $('#alert').css('visibility', 'visible');
    $('#alert').text('Saved!');
    setTimeout(function() {
        $('#alert').css('visibility', 'hidden');
    }, 2000); 
}

// helper method
function printMem() {
    console.log('printing mem');
    chrome.storage.local.get(null, function(res) {
        console.log(res);
    });
}