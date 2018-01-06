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
    	}
    });
});