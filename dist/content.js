console.log("Hello world from the content script");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'urlDetected') {
    console.log(`Detected URL (${message.source}):`);
    
    const pContainerDivElement = document.querySelector('main div#composer-background div#prompt-textarea');
    
    if (pContainerDivElement) {
      const pElement = pContainerDivElement.querySelector('p');
      
      if (pElement) {
        if (pElement.classList.contains('placeholder')) {
          pElement.textContent = message.source;
          pElement.removeAttribute('data-placeholder');
          pElement.classList.remove('placeholder');
          pContainerDivElement.classList.add('ProseMirror-focused');
        } else {
          pElement.textContent = message.source;
          pContainerDivElement.classList.add('ProseMirror-focused');
        }
      }
    }
  }
});

//selector for case when new chat
  // main div.composer-parent>div.@container/thread>div>div:nth-child(2)>div>div>div>div:nth-child(4)>form>div>div:nth-child(2)>div#composer-background>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div#prompt-textarea

  // selector for case when already content is there
  // const pConatinerDivElement = document.querySelector('main div.composer-parent>div:nth-child(2)>div>div>div>form>div>div:nth-child(3)>div#composer-background>div:nth-child(1)>div:nth-child(1)>div>div#prompt-textarea');