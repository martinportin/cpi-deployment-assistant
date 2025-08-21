import { Artifact, CPIArtifact, IntegrationDeploumentStatus, CPIPackage, XHRResponse, DeploymentStatus, XHRRequest } from '../custom';
import { handleMessage } from '../utils/Message';
import { makeXHRRequest } from '../utils/XHRRequest';

const domain = document.location.hostname;

function addMessageListener() {
  chrome.runtime.onMessage.addListener(handleMessage(domain, getArtifacts, deployArtifacts));
}

async function getArtifacts(domain: string): Promise<Artifact[]> {
  const [packageResponse, integrationsResponse] = await Promise.all([getPackages(domain), getIntegrations(domain)]);
  const integrations = parseXMLResponse(integrationsResponse)
  const integrationDeploymentStatus = getIntegratonDeploymentStatus(integrations);
  const packages: CPIPackage[] = JSON.parse(packageResponse.responseText).d.results;
  const artifacts = extractArtifacts(packages, integrationDeploymentStatus);
  return artifacts;
}

function parseXMLResponse(response: XHRResponse): Document {
  const xmlParser = new DOMParser();
  return xmlParser.parseFromString(response.responseText, 'application/xml');
}

async function getPackages(domain: string): Promise<XHRResponse> {
  return await makeXHRRequest({
    method: 'GET',
    domain,
    resource: '/odata/1.0/workspace.svc/ContentEntities.ContentPackages',
    query: '?$select=reg_id,Artifacts&$expand=Artifacts&$format=json',
    useCsrfToken: false
  })
}

async function getIntegrations(domain: string): Promise<XHRResponse> {
  return await makeXHRRequest({
    method: 'GET',
    domain,
    resource: '/Operations/com.sap.it.op.tmn.commands.dashboard.webui.IntegrationComponentsListCommand'
  })
}

function getIntegratonDeploymentStatus(integrations: Document): IntegrationDeploumentStatus[] {
    return [...integrations.getElementsByTagName('artifactInformations')].map((integrationInformation) => integrationInformation.childNodes).map((childNodes) => ({name: childNodes[5].textContent, deploymentStatus: childNodes[1].textContent}))
}

function extractArtifacts(cpiPackages: CPIPackage[], integrationDeploymentStatus: IntegrationDeploumentStatus[]): Artifact[] {
  const artifacts: Artifact[] = [];
  for (const cpiPackage of cpiPackages) {
    const cpiPackageArtifacts: Artifact[] = cpiPackage.Artifacts.results.map(
      (cpiArtifact: CPIArtifact) => ({
        regId: cpiArtifact.reg_id,
        displayName: cpiArtifact.DisplayName,
        name: cpiArtifact.Name,
        deployStatus: getDeploymentStatus(cpiArtifact.DisplayName, integrationDeploymentStatus),
        packageRegId: cpiPackage.reg_id
      })
    );
    artifacts.push(...cpiPackageArtifacts);
  }
  return artifacts;
}

function getDeploymentStatus(name: string, deploymentStatus: IntegrationDeploumentStatus[]): DeploymentStatus {
  return deploymentStatus.some((status) => status.name === name) ? 'DEPLOYED' : 'UNDEPLOYED';
}

async function deployArtifacts(domain: string): Promise<Artifact[]> {

}

async function deployArtifact(packageRegId: string, artifactRegId: string, artifactName: string): Promise<XMLHttpRequest> {
  return await makeXHRRequest({method: 'PUT', domain, resource: `/api/1.0/workspace/${packageRegId}/artifacts/${artifactRegId}/entities/${artifactRegId}/iflows/${artifactName}`, query: '?webdav=DEPLOY', useCsrfToken: true})
}

addMessageListener();

export {};
