import {
  Artifact,
  CPIArtifact,
  IntegrationDeploumentStatus,
  CPIPackage,
  XHRResponse,
  DeploymentStatus,
  SemanticStatus
} from '../custom';
import { handleMessage } from '../utils/Message';
import { makeXHRRequest } from '../utils/XHRRequest';

const domain = document.location.hostname;

function addMessageListener() {
  chrome.runtime.onMessage.addListener(
    handleMessage(domain, getArtifacts, deployArtifacts, undeployArtifacts)
  );
}

async function getArtifacts(domain: string): Promise<Artifact[]> {
  const [packageResponse, integrationsResponse] = await Promise.all([
    getPackages(domain),
    getIntegrations(domain)
  ]);
  const integrations = parseXMLResponse(integrationsResponse);
  const integrationDeploymentStatus =
    getIntegratonDeploymentStatus(integrations);
  const packages: CPIPackage[] = JSON.parse(packageResponse.responseText).d
    .results;
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
  });
}

async function getIntegrations(domain: string): Promise<XHRResponse> {
  return await makeXHRRequest({
    method: 'GET',
    domain,
    resource:
      '/Operations/com.sap.it.op.tmn.commands.dashboard.webui.IntegrationComponentsListCommand'
  });
}

function getIntegratonDeploymentStatus(
  integrations: Document
): IntegrationDeploumentStatus[] {
  return [...integrations.getElementsByTagName('artifactInformations')]
    .map((integrationInformation) => integrationInformation.childNodes)
    .map((childNodes) => ({
      name: childNodes[5].textContent,
      deploymentStatus: childNodes[1].textContent,
      semanticState: childNodes[7].textContent,
      sapArtifactId: extractSapArtifactId(childNodes)
    }));
}

function extractSapArtifactId(nodes: NodeListOf<ChildNode>) {
  const sapArtifactId = <Element> [...nodes].find((node) => {
    const element = <Element> node;
    return element.getAttribute('name') === 'SAP-ArtifactId'
  })
  return sapArtifactId.getAttribute('value');
}

function extractArtifacts(
  cpiPackages: CPIPackage[],
  integrationDeploymentStatus: IntegrationDeploumentStatus[]
): Artifact[] {
  const artifacts: Artifact[] = [];
  for (const cpiPackage of cpiPackages) {
    const cpiPackageArtifacts: Artifact[] = cpiPackage.Artifacts.results.map(
      (cpiArtifact: CPIArtifact) => ({
        regId: cpiArtifact.reg_id,
        displayName: cpiArtifact.DisplayName,
        name: cpiArtifact.Name,
        deployStatus: getDeploymentStatus(
          cpiArtifact.DisplayName,
          integrationDeploymentStatus
        ),
        semanticStatus: getSemanticStatus(cpiArtifact.DisplayName,
          integrationDeploymentStatus),
        packageRegId: cpiPackage.reg_id,
        sapArtifactId: getSapArtifactId(cpiArtifact.DisplayName,
          integrationDeploymentStatus)
      })
    );
    artifacts.push(...cpiPackageArtifacts);
  }
  return artifacts;
}

function getDeploymentStatus(
  name: string,
  deploymentStatus: IntegrationDeploumentStatus[]
): DeploymentStatus {
  return <DeploymentStatus> deploymentStatus.find((status) => status.name === name)?.deploymentStatus ?? 'UNDEPLOYED'
}

function getSemanticStatus(name: string,
  deploymentStatus: IntegrationDeploumentStatus[]): SemanticStatus {
    return <SemanticStatus> deploymentStatus.find((status) => status.name === name)?.semanticState ?? ''
  }

function getSapArtifactId(name: string,
  deploymentStatus: IntegrationDeploumentStatus[]) {
    return deploymentStatus.find((status) => status.name === name)?.sapArtifactId ?? null;
  }

async function deployArtifacts(domain: string, artifacts: Artifact[]): Promise<Artifact[]> {
  const failedArtifacts = []
  for (const artifact of artifacts) {
    try {
      await deployArtifact(domain, artifact.packageRegId, artifact.regId, artifact.name);
    } catch (error) {
      console.log(error)
      failedArtifacts.push(artifact);
    }
  }
  return failedArtifacts;
}

async function deployArtifact(
  domain: string,
  packageRegId: string,
  artifactRegId: string,
  artifactName: string
): Promise<XMLHttpRequest> {
  return await makeXHRRequest({
    method: 'PUT',
    domain,
    resource: `/api/1.0/workspace/${packageRegId}/artifacts/${artifactRegId}/entities/${artifactRegId}/iflows/${artifactName}`,
    query: '?webdav=DEPLOY',
    useCsrfToken: true
  });
}

async function undeployArtifacts(domain: string, artifacts: Artifact[]): Promise<Artifact[]> {
  const failedArtifacts = []
  const tenantPostContent: RegExp = /^(.*?)\.integrationsuite/
  const tenantInformation = tenantPostContent.exec(domain)
  const tenant = tenantInformation !== null ? tenantInformation[1] : '';
  for (const artifact of artifacts) {
    try {
      const body = new FormData()
      body.append('artifactIds', artifact.sapArtifactId ?? '')
      body.append('tenantId', tenant)
      await undeployArtifact(domain, body);
    } catch (error) {
      console.log(error);
      failedArtifacts.push(artifact);
    }
  }
  return failedArtifacts;
}

async function undeployArtifact(domain: string, body: XMLHttpRequestBodyInit): Promise<XMLHttpRequest> {
  return await makeXHRRequest({
    method: 'POST',
    domain,
    resource: '/Operations/com.sap.it.nm.commands.deploy.DeleteContentCommand',
    body,
    useCsrfToken: true
  })
}

addMessageListener();

export {};
