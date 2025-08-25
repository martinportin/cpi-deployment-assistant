import {
  TableSelectionMulti,
  TableSelectionMultiDomRef,
  Ui5CustomEvent,
  Table as UI5Table
} from '@ui5/webcomponents-react';
import TableHeader from './TableHeader';
import TableRows from './TableRows';
import { Artifact } from '../custom';

export default function Table({
  headers,
  artifacts,
  handleSelectionChange
}: Readonly<{ headers: string[]; artifacts: Artifact[], handleSelectionChange: (event: Ui5CustomEvent<TableSelectionMultiDomRef, never>) => void }>) {
  return (
    <UI5Table id="artifactTable" headerRow={<TableHeader headers={headers} />}>
      <TableSelectionMulti slot="features" headerSelector="SelectAll" onChange={handleSelectionChange}/>
      <TableRows artifacts={artifacts} />
    </UI5Table>
  );
}
