function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl((tgt) => {
    	var textSpace = document.getElementById('text');
    	if (!(tgt === 'https://www.cardsphere.com/send')) {
    		// display error message if not on the cardsphere site
    		var error ='<span>Not on Cardsphere\'s site! Load the send page to use this extension.</span><br>';
    		textSpace.innerHTML += error;
    	} else {
    		// else show the correct buttons when on the cardsphere site
    		document.getElementById('buttons').style.display = 'block';
    	}
    	textSpace.innerHTML += '<span>Current site: '+ tgt +'</span>';
    });
});