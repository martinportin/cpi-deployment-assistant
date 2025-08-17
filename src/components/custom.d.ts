interface Artifact {
  regId: string;
  displayName: string;
  name: string;
  deployStatus: 'Deployed' | 'Undeployed';
  packageRegId: string;
}

interface Package {
  regId: string;
  displayName: string;
  technicalName: string;
  artifacts: Artifact[];
}

export { Artifact, Package };
