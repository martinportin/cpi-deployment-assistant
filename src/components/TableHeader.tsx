import { TableHeaderCell, TableHeaderRow } from '@ui5/webcomponents-react';

export default function TableHeader({ headers }: { headers: string[] }) {
  function getTableHeaderCells(headers: string[]) {
    return headers.map((header) => <TableHeaderCell>{header}</TableHeaderCell>);
  }

  return (
    <TableHeaderRow slot="headerRow">
      {getTableHeaderCells(headers)}
    </TableHeaderRow>
  );
}
