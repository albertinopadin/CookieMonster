document.addEventListener("DOMContentLoaded", function(event) {
  let searchCookiesButton = document.getElementById('search-cookies-button');
  let deleteCookiesButton = document.getElementById('delete-cookies-button');
  let domainTextBox = document.getElementById('domain-text-box');
  let cookieListElem = document.getElementById('cookie-list');
  let resultDiv = document.getElementById('result-div');

  domainTextBox.oninput = element => {
    // Autocomplete
    if (domainTextBox.value.trim().length > 2) {
      console.log("Domain text: " + domainTextBox.value);
      getPossibleDomains(domainTextBox.value, (domains) => {
        console.log("Found domains: " + JSON.stringify(domains));
      });
    }
  };

  searchCookiesButton.onclick = element => {
    if (domainTextBox.value.trim().length > 0) {
      getCookies(domainTextBox.value, (cookies) => {
        console.log("Found cookies: " + JSON.stringify(cookies));
        for(var i=0; i<cookies.length; i++) {
          console.log(JSON.stringify(cookies[i]));
          var li = document.createElement("li");
          li.appendChild(document.createTextNode(JSON.stringify(cookies[i])));
          cookieListElem.appendChild(li);
        }
      });
    } else {
      let err = "Domain text box is empty, cannot search cookies.";
      console.log(err);
      resultDiv.appendChild(document.createTextNode(err));
    }
  }

  deleteCookiesButton.onclick = element => {
    if (domainTextBox.value.trim().length > 0) {
      getCookies(domainTextBox.value, (cookies) => {
        console.log("(deleteCookiesButton) Found cookies: " + JSON.stringify(cookies));

        let message = {
          action: 'deleteCookies',
          cookies: cookies
        };
    
        chrome.runtime.sendMessage(message, (response) => {
          console.log("Cookies Removed: " + JSON.stringify(response));
          // Put something in the UI to let user know:
          var result = "";
          if (response.error) {
            result = "Error";
          } else {
            result = "Successfully removed " + cookies.length + " cookies!";
          }
          resultDiv.appendChild(document.createTextNode(result));
        });
      });
    } else {
      let err = "Domain text box is empty, cannot delete cookies.";
      console.log(err);
      resultDiv.appendChild(document.createTextNode(err));
    }
  }

  function getPossibleDomains(searchTerm, callback) {
    // Have to get all cookies first since it looks like Chrome doesn't
    // have the ability to search by prefix on the API:
    getCookies('', (cookies) => {
      let filteredCookies = cookies.filter(cookie => 
        cookie.domain.startsWith(searchTerm) ||
        cookie.domain.startsWith("." + searchTerm) ||
        cookie.domain.startsWith("www." + searchTerm)
      );
      // console.log("Filtered Cookies: " + JSON.stringify(filteredCookies));
      let possibleDomains = [...new Set(filteredCookies.map(cookie => cookie.domain))];
      callback(possibleDomains);
    });
  }

  function getCookies(searchTerm, callback) {
    let message = {
      action: 'getAllCookies',
      searchTerm: searchTerm
    };

    chrome.runtime.sendMessage(message, (response) => {
      // console.log("(getCookies) Found cookies: " + JSON.stringify(response.cookies));
      cookies = response.cookies;
      callback(cookies);
    });
  }

});