interface MessageObject {
  message: Message;
}

type Message = 'get artifacts' | 'deploy artifacts' | 'undeploy artifatcs';

interface XHRRequest {
  method: 'GET' | 'PUT' | 'POST';
  domain: string;
  resource: string;
  query?: string;
  useCsrfToken?: boolean;
}

interface XHRResponse {
  responseText: string;
  status: number;
}

interface CPIPackage {
  reg_id: string;
  Artifacts: CPIArtifacts;
}

interface CPIArtifacts {
  results: CPIArtifact[];
}

interface CPIArtifact {
  DisplayName: string;
  Name: string;
  reg_id: string;
}

interface IntegrationDeploumentStatus {
  name: string | null;
  deploymentStatus: string | null;
}

interface Package {
  regId: string;
  displayName: string;
  technicalName: string;
  artifacts: Artifact[];
}

interface Artifact {
  regId: string;
  displayName: string;
  name: string;
  deployStatus: DeploymentStatus;
  packageRegId: string;
}

type DeploymentStatus = 'DEPLOYED' | 'UNDEPLOYED';

export {
  MessageObject,
  Message,
  XHRRequest,
  XHRResponse,
  CPIPackage,
  CPIArtifact,
  IntegrationDeploumentStatus,
  Package,
  Artifact,
  DeploymentStatus
};
