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
  deployStatus: 'Deployed' | 'Undeployed';
  packageRegId: string;
}

export {
  XHRRequest,
  XHRResponse,
  Message,
  CPIArtifact,
  CPIPackage,
  Package,
  Artifact
};
