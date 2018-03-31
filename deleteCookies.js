chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getAllCookies") {
      console.log("Getting all cookies from domain: " + request.domain);
      chrome.cookies.getAll({domain: request.domain}, function(cookies) {
        console.log("Got all cookies from domain: " + request.domain + ", size: " + cookies.length);
        for (var i = 0; i < cookies.length; i++) {
          console.log("Name: " + cookies[i].name + ", Contents: " + JSON.stringify(cookies[i]));
          // chrome.cookies.remove({name: cookies[i].name});
        }

        sendResponse({ domainCookies: cookies});
      });
      
      return true;
    }
  }
);