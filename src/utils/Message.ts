import { Artifact, Message } from '../custom';

async function sendMessage(message: Message): Promise<Artifact[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });

      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, {
          message
        });
        resolve(response);
      }
    } catch (reason) {
      reject(reason);
    }
  });
}

function handleMessage(
  domain: string,
  getArtifacts: (domain: string) => Promise<Artifact[]>
) {
  return (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): boolean => {
    (async () => {
      console.log('!!!');
      const artifacts = await getArtifacts(domain);
      sendResponse(artifacts);
    })();
    return true;
  };
}

export { sendMessage, handleMessage };
