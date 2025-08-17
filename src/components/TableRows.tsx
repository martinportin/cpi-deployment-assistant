import { TableRow, TableCell, Label } from '@ui5/webcomponents-react';
import { Artifact } from './custom';

export default function TableRows({ artifacts }: { artifacts: Artifact[] }) {
  function getTableRows(artifacts: Artifact[]) {
    return artifacts.map((artifact) => (
      <TableRow id={artifact.regId} rowKey={artifact.regId}>
        <TableCell>
          <Label>{artifact.displayName}</Label>
        </TableCell>
        <TableCell>
          <Label>{artifact.deployStatus}</Label>
        </TableCell>
      </TableRow>
    ));
  }
  return <>{getTableRows(artifacts)}</>;
}
