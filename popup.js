document.addEventListener("DOMContentLoaded", function(event) {
  let searchCookiesButton = document.getElementById('search-cookies-button');
  let deleteCookiesButton = document.getElementById('delete-cookies-button');
  let domainTextBox = document.getElementById('domain-text-box');
  let cookieListElem = document.getElementById('cookie-list');
  let cookies = [];

  searchCookiesButton.onclick = element => {
    let message = {
      action: 'getAllCookies',
      searchTerm: domainTextBox.value
    };

    chrome.runtime.sendMessage(message, (response) => {
      console.log("Found cookies: " + JSON.stringify(response.cookies));
      cookies = response.cookies;
      for(var i=0; i<cookies.length; i++) {
        console.log(JSON.stringify(cookies[i]));
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(JSON.stringify(cookies[i])));
        cookieListElem.appendChild(li);
      }
    });
  }

  deleteCookiesButton.onclick = element => {
    let message = {
      action: 'deleteCookies',
      cookies: cookies
    };

    chrome.runtime.sendMessage(message, () => {

    });
  }

});