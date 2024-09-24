// background.js

let API_Key = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getAPIKey') {
    sendResponse({ API_Key });
  }
});

function decodeJWT(token) {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

function fetchAPIKey(activationToken) {
  var appId;
  var activationRefId;
  var url;

  if (activationToken !== '') {
    const decodedToken = decodeJWT(activationToken);
    if (decodedToken) {
        appId = decodedToken['appId'];
        activationRefId = decodedToken['activationRefId'];
        baseUrl = decodedToken['baseUrl'];
        url = baseUrl + '/client/v1/partner/activateSingleTenantCloudApp';
        console.log('App ID: ', appId);
        console.log('Activation Ref ID: ', activationRefId);
        console.log('Activation URL: ', url)
    }
  }
    
    const authKey = "Bearer " + activationToken;
    payload = JSON.stringify({'appId': appId, 'activationRefId': activationRefId, 'appDashboardUrl': baseUrl})
    
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", authKey);


  fetch(url,{
    "method": "POST",
    "headers": headers,
    "body": payload
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      API_Key = data['data']['apiKey'];
      chrome.storage.sync.set({ 'API_Key': API_Key });
      console.log(API_Key);
    })
    .catch(error => console.error('Error fetching API Key:', error));
}

// Call fetchAPIKey from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchAPIKey') {
    fetchAPIKey(message.activationToken);
  }
});
