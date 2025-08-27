import { TableHeaderCell, TableHeaderRow } from '@ui5/webcomponents-react';

export default function TableHeader({ headers }: { headers: string[] }) {
  function getTableHeaderCells(headers: string[]) {
    return headers.map((header, index) => <TableHeaderCell minWidth={index === 0 ? '500px' : '200px'}>{header}</TableHeaderCell>);
  }

  return (
    <TableHeaderRow slot="headerRow">
      {getTableHeaderCells(headers)}
    </TableHeaderRow>
  );
}
