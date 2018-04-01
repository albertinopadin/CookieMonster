let domainPrefix = "www."
let domainSuffix = ".com"

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

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
      for (cookie in request.cookies) {
        console.log("Deleting cookie: " + cookie.name + " in domain: " + cookie.domain);
        chrome.cookies.remove({name: cookie.name});
      }
    }
  }
);