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
    // send dmessage to save.js content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            console.log('Saved.');
        });
    });

    var d = new Date();
    document.getElementById('alert').style.display = 'block';
    $('#alert').text('Saved! At '+d.toString());
    $('#alert').hover(function() {
        $(this).css('color', 'red');
    });
    $('#alert').click(function() {
        document.getElementById('alert').style.display = 'none';
    });
}

// helper method
function printMem() {
    console.log('printing mem');
    chrome.storage.local.get('saved', function(res) {
        console.log(res);
    });
    chrome.storage.local.get('last_accessed', function(res) {
        console.log(res);
    });
}