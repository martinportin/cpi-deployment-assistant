function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
): boolean {
  sendResponse({ response: `Hello ${message.subject}!` });
  return true;
}

function addMessageListener() {
  chrome.runtime.onMessage.addListener(handleMessage);
}

addMessageListener();

export {};
