document.addEventListener("DOMContentLoaded", function(event) {
  let deleteCookiesButton = document.getElementById('deleteCookies');
  let domainTextBox = document.getElementById('domainTextBox');

  deleteCookiesButton.onclick = element => {
    let message = {
      action: 'getAllCookies',
      domain: domainTextBox.value
    };

    chrome.runtime.sendMessage(message, function(response) {
      console.log("Domain cookies: " + JSON.stringify(response));
    });
  }
});