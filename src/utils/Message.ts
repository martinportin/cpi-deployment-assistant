import { Artifact, Message, MessageObject } from '../custom';

async function sendMessage(message: Message, artifacts?: Artifact[]): Promise<Artifact[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });

      if (tab.id) {
        const response = await chrome.tabs.sendMessage(tab.id, {
          message,
          artifacts
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
  deployArtifacts: (domain: string, artifacts: Artifact[]) => Promise<Artifact[]>,
  undeployArtifacts: (domain: string, artifacts: Artifact[]) => Promise<Artifact[]>
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

      if (message.message === 'deploy artifacts' && message.artifacts) {
        const failedArtifacts = await deployArtifacts(domain, message.artifacts);
        sendResponse(failedArtifacts)
      }

      if (message.message === 'undeploy artifatcs' && message.artifacts) {
        const failedArtifacts = undeployArtifacts(domain, message.artifacts)
        sendResponse(failedArtifacts);
      }
    })();
    return true;
  };
}

export { sendMessage, handleMessage };
