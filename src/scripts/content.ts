import { Artifact, CPIArtifact, CPIPackage, XHRResponse } from '../custom';
import { handleMessage } from '../utils/Message';
import { makeXHRRequest } from '../utils/XHRRequest';

const domain = document.location.hostname;

function addMessageListener() {
  chrome.runtime.onMessage.addListener(handleMessage(domain, getArtifacts));
}

async function getArtifacts(domain: string): Promise<Artifact[]> {
  const response: XHRResponse = await makeXHRRequest({
    method: 'GET',
    domain,
    resource: '',
    query: '',
    useCsrfToken: false
  });
  const packages: CPIPackage[] = JSON.parse(response.responseText).d.results;
  const artifacts = extractArtifacts(packages);
  return artifacts;
}

function extractArtifacts(cpiPackages: CPIPackage[]): Artifact[] {
  const artifacts: Artifact[] = [];
  for (const cpiPackage of cpiPackages) {
    const cpiPackageArtifacts: Artifact[] = cpiPackage.Artifacts.results.map(
      (cpiArtifact: CPIArtifact) => ({
        regId: cpiArtifact.reg_id,
        displayName: cpiArtifact.DisplayName,
        name: cpiArtifact.Name,
        deployStatus: 'Deployed',
        packageRegId: cpiPackage.reg_id
      })
    );
    artifacts.push(...cpiPackageArtifacts);
  }
  return artifacts;
}

addMessageListener();

export {};
