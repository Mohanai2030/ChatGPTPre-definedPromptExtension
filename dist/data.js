function loadPrePrompt() {
  return new Promise((resolve) => {
    chrome.storage.local.get("pre_prompt", (result) => {
      const pre_prompt = result.pre_prompt || {}; // Use stored value or default
      resolve(pre_prompt);
    });
  });
}

async function setPrePrompt(old_pre_prompt, website, prompt) {
  try {
    const pre_prompt = { ...old_pre_prompt, [website]: prompt };
    await new Promise((resolve) => {
      chrome.storage.local.set({ pre_prompt }, () => {
        resolve();
      });
    });
    return "success";
  } catch (error) {
    console.error("Failed to set pre-prompt:", error);
    return "failure";
  }
}
// Add this function to data.js
async function updatePrePrompt(old_pre_prompt, oldWebsite, newWebsite, newPrompt) {
  try {
    // Create a new object without the old website key
    const updatedPrePrompt = { ...old_pre_prompt };
    delete updatedPrePrompt[oldWebsite];

    // Add the new website and prompt
    updatedPrePrompt[newWebsite] = newPrompt;

    // Save the updated object to chrome storage
    await new Promise((resolve, reject) => {
      chrome.storage.local.set({ pre_prompt: updatedPrePrompt }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    return updatedPrePrompt;
  } catch (error) {
    console.error("Failed to update pre-prompt:", error);
    return null;
  }
}

// Add this function to data.js
async function deletePrePrompt(old_pre_prompt, website) {
  try {
    // Create a new object without the specified website key
    const updatedPrePrompt = { ...old_pre_prompt };
    delete updatedPrePrompt[website];

    // Save the updated object to chrome storage
    await new Promise((resolve, reject) => {
      chrome.storage.local.set({ pre_prompt: updatedPrePrompt }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });

    return updatedPrePrompt;
  } catch (error) {
    console.error("Failed to delete pre-prompt entry:", error);
    return null;
  }
}

// Update the export to include the new function
export { loadPrePrompt, setPrePrompt, updatePrePrompt, deletePrePrompt };



