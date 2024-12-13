// Initialize the pre-prompt object
let pre_prompt = {};

// Function to extract corresponding website from URL
function websiteCorresponding(url) {
  console.log("Checking URL:", url);
  
  // Ensure pre_prompt is an object
  if (!pre_prompt || typeof pre_prompt !== 'object') {
    console.log("Pre-prompt is not a valid object");
    return "";
  }

  // Iterate through keys in pre_prompt
  for (const key of Object.keys(pre_prompt)) {
    console.log(`Comparing: ${url} with ${key}`);
    
    // Check if the URL includes the key
    if (String(url).includes(key)) {
      console.log(`Matched website: ${key}, Prompt: ${pre_prompt[key]}`);
      return pre_prompt[key];
    }
  }
  
  console.log("No matching website found");
  return "";
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.pre_prompt) {
    // Update the pre_prompt whenever storage changes
    pre_prompt = changes.pre_prompt.newValue || {};
    console.log("Pre-prompt updated:", pre_prompt);
  }
});

// Initialize pre-prompt on script start
chrome.storage.local.get("pre_prompt", (result) => {
  pre_prompt = result.pre_prompt || {};
  console.log("Initial pre-prompt loaded:", pre_prompt);
});

// Track previous and current URLs
let previous = "None";
let current = "None";

// Function to check and potentially inject script 
async function checkAndInjectScript(tabId, url) {
  console.log("Inside checkAndInjectScript function");
  
  // Replace 'https://example.com' with your target URL
  const targetUrl = 'https://chatgpt.com';
  
  // Check if the URL matches the target
  if (url.startsWith(targetUrl)) {
    try {
      // Ensure the tab is ready
      await chrome.tabs.get(tabId);
      
      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      
      console.log("Inside checkandinjectscript", previous, websiteCorresponding(previous));
      
      // Send a message to the content script after injection
      chrome.tabs.sendMessage(tabId, {
        action: 'urlDetected',
        url: url,
        source: websiteCorresponding(previous)
      });
      
      console.log(`Script injected into tab ${tabId}`);
    } catch (error) {
      console.error('Error injecting script:', error);
    }
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const targetUrl = 'https://chatgpt.com';
  let nowtaburl = tab.pendingUrl || tab.url;
  if(nowtaburl != "chrome://newtab/"){
    console.log("updated to",nowtaburl)
    if(!current.startsWith(targetUrl)){
      previous = current;
    } 
    current = nowtaburl;
  if (changeInfo.status === 'complete') {
    checkAndInjectScript(tabId, nowtaburl);
  }
  }
  
});

// Listen for tab activation (switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Get the details of the newly activated tab
    const targetUrl = 'https://chatgpt.com';
    const tab = await chrome.tabs.get(activeInfo.tabId);
    let nowtaburl = tab.pendingUrl || tab.url;
    if(nowtaburl != "chrome://newtab/"){
      console.log("activated to",tab)
      if(!current.startsWith(targetUrl)){
        previous = current;
      } 
      current = nowtaburl;
      
    // Check and potentially inject script
    checkAndInjectScript(activeInfo.tabId, nowtaburl);
    }
    
  } catch (error) {
    console.error('Error on tab activation:', error);
  }
});