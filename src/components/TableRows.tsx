import { TableRow, TableCell, Label } from '@ui5/webcomponents-react';
import { Artifact } from '../custom';
import { ThemingParameters } from '@ui5/webcomponents-react-base';

export default function TableRows({ artifacts }: { artifacts: Artifact[] }) {
  function getTableRows(artifacts: Artifact[]) {
    return artifacts.map((artifact) => (
      <TableRow id={artifact.regId} rowKey={artifact.regId}>
        <TableCell>
          <Label>{artifact.displayName}</Label>
        </TableCell>
        <TableCell>
          <Label
            style={
              artifact.deployStatus === 'DEPLOYED'
                ? { color: ThemingParameters.sapPositiveColor }
                : artifact.deployStatus === 'UNDEPLOYED'
                  ? { color: ThemingParameters.sapNegativeColor }
                  : { color: ThemingParameters.sapNeutralColor }
            }
          >
            {artifact.deployStatus}
          </Label>
        </TableCell>
        <TableCell>
          <Label
            style={
              artifact.semanticStatus === 'STARTED'
                ? { color: ThemingParameters.sapPositiveColor }
                : artifact.semanticStatus === 'ERROR'
                  ? { color: ThemingParameters.sapNegativeColor }
                  : { color: ThemingParameters.sapNeutralColor }
            }
          >
            {artifact.semanticStatus}
          </Label>
        </TableCell>
      </TableRow>
    ));
  }
  return <>{getTableRows(artifacts)}</>;
}
