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
    <UI5Table id="artifactTable">
      <TableSelectionMulti slot="features" headerSelector="SelectAll" />
      <TableHeader headers={headers} />
      <TableRows artifacts={artifacts} />
    </UI5Table>
  );
}
