import {
  TableSelectionMulti,
  Table as UI5Table
} from '@ui5/webcomponents-react';
import TableHeader from './TableHeader';
import TableRows from './TableRows';
import { Artifact } from '../custom';

export default function Table({
  headers,
  artifacts
}: Readonly<{ headers: string[]; artifacts: Artifact[] }>) {
  return (
    <UI5Table id="artifactTable" headerRow={<TableHeader headers={headers} />}>
      <TableSelectionMulti slot="features" headerSelector="SelectAll" />
      <TableRows artifacts={artifacts} />
    </UI5Table>
  );
}
