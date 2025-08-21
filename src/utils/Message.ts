import { Artifact, Message, MessageObject } from '../custom';

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
  getArtifacts: (domain: string) => Promise<Artifact[]>,
  deployArtifacts: (domain: string) => Promise<Artifact[]>
) {
  return (
    message: MessageObject,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): boolean => {
    (async () => {
      if (message.message === 'get artifacts') {
        const artifacts = await getArtifacts(domain);
        sendResponse(artifacts);
      }

      if (message.message === 'deploy artifacts') {
        const failedArtifacts = await deployArtifacts(domain);
        sendResponse(failedArtifacts)
      }
    })();
    return true;
  };
}

export { sendMessage, handleMessage };
