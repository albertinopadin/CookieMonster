let wwwPrefix = "www";
let domainPrefix = wwwPrefix + ".";
let domainSuffix = ".com";
let httpsPrefix = "https://";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // ::GET CURRENT TAB URL::
    if (request.action == "getTabUrl") {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {
        var url = tabs[0].url;
        console.log(url);
        sendResponse({
          tabUrl: url
        });
      });

      // From: https://developer.chrome.com/docs/extensions/reference/tabs/
      // let queryOptions = { active: true, currentWindow: true };
      // let [tab] = await chrome.tabs.query(queryOptions);
      // return tab.url;

      return true;
    }

    // ::GET ALL COOKIES::
    if (request.action == "getAllCookies") {
      console.log("Getting all cookies from search: " + request.searchTerm);

      let baseDomain = "";
      let fullDomain = "";
      let cookiesFound = [];

      if(!request.searchTerm.startsWith(domainPrefix) && !request.searchTerm.endsWith(domainSuffix)) {
        baseDomain = request.searchTerm + domainSuffix;
        fullDomain = domainPrefix + baseDomain;
      } else if(request.searchTerm.startsWith(domainPrefix) && !request.searchTerm.endsWith(domainSuffix)) {
        fullDomain = request.searchTerm + domainSuffix;
        baseDomain = fullDomain.replace(domainPrefix, '');
      } else if(!request.searchTerm.startsWith(domainPrefix) && request.searchTerm.endsWith(domainSuffix)) {
        baseDomain = request.searchTerm;
        fullDomain = domainPrefix + baseDomain
      } else {
        fullDomain = request.searchTerm;
        baseDomain = fullDomain.replace(domainPrefix, '');
      }

      chrome.cookies.getAll({ domain: baseDomain }, function(cookies) {
        console.log("Got all cookies from domain: " + baseDomain + ", size: " + cookies.length);
        cookiesFound = cookiesFound.concat(cookies);

        // Search for fullDomain only after we have found baseDomain cookies:
        chrome.cookies.getAll({ domain: fullDomain }, function(cookies) {
          console.log("Got all cookies from domain: " + fullDomain + ", size: " + cookies.length);
          cookiesFound = cookiesFound.concat(cookies);
          sendResponse({ cookies: cookiesFound });
        });
      });
      
      return true;
    }

    // ::DELETE COOKIES::
    if (request.action == "deleteCookies") {
      var cookiesRemoved = [];
      var cookieArray = request.cookies;

      for(var i=0; i<cookieArray.length; i++) {
        cookieUrl = cookieArray[i].domain;
        if (cookieUrl.startsWith(".")) {
          cookieUrl = httpsPrefix + wwwPrefix + cookieUrl;
        }

        if (cookieUrl.startsWith("www.")) {
          cookieUrl = httpsPrefix + cookieUrl;
        }

        chrome.cookies.remove({
          name: cookieArray[i].name,
          url: cookieUrl
        }, (details) => {
          var removed = {};
          if (details == null) {
            removed = {
              // error: browser.runtime.lastError
              error: "There was some sort of error."
            };
          } else {
            removed = {
              details: details
            };
          }

          cookiesRemoved.push(removed);
        });
      }

      sendResponse({
        cookiesRemoved: cookiesRemoved
      });

      return true;
    }
  }
);