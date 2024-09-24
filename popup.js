// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const apiKeyForm = document.getElementById('apiKeyForm');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyOutput = document.getElementById('API_KEY_FIELD'); // Added this line
    const documentationWrapper = document.getElementById('documentation_wrapper');
    const apiWrapper = document.getElementById('api_wrapper');
    const documentationTextarea = document.getElementById('documentation'); // Added this line
    const platformDropdown = document.getElementById('platform'); // Added this line
  
  
    apiKeyForm.addEventListener('submit', event => {
      event.preventDefault();
      const activationToken = apiKeyInput.value.trim(); // Trim the input to remove any leading/trailing whitespace
      if (activationToken !== '') {
        apiKeyInput.value = ''; // Clear input field after submission
        chrome.runtime.sendMessage({ action: 'fetchAPIKey', activationToken: activationToken })
            .catch(error => console.error('Error fetching API Key:', error));
      }
    });
  
    // Listen for changes in Chrome storage
    chrome.storage.onChanged.addListener((changes, area) => {
      if (changes.API_Key) {
        const newAPIKey = changes.API_Key.newValue;
        apiKeyOutput.textContent = newAPIKey; // Update the text content of the output field
        documentationWrapper.classList.remove('hidden');
        apiWrapper.classList.remove('hidden');
      }
    });
  
    // Fetch the initial API key when the popup is opened
    chrome.runtime.sendMessage({ action: 'getAPIKey' }, response => {
      const { API_Key } = response;
      if (API_Key) {
        apiKeyOutput.textContent = API_Key;
        documentationWrapper.classList.remove('hidden');
        apiWrapper.classList.remove('hidden');
      }
    });

      // Update documentation based on selected platform
    platformDropdown.addEventListener('change', event => {
        const selectedPlatform = platformDropdown.value;
        updateDocumentation(selectedPlatform);
    });

      // Function to update documentation based on selected platform
  function updateDocumentation(selectedPlatform) {
    let documentationContent = '';

    switch (selectedPlatform) {
      case 'Postman':
        documentationContent = 'Instructions for Postman';
        break;
      case 'Python':
        documentationContent = 'Instructions for Python';
        break;
      case 'JavaScript Fetch':
        documentationContent = 'Instructions for JavaScript Fetch';
        break;
      case 'Curl':
        documentationContent = 'Instructions for Curl';
        break;
      default:
        documentationContent = 'Select a platform to view documentation.';
        break;
    }

    documentationTextarea.textContent = documentationContent;
  }
  updateDocumentation(platformDropdown.value);
    // You can fill out the documentation later
  });
  