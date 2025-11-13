import { TableHead, TableRow, TableCell } from '@mui/material';

export function InventoryTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Book Name</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>Created At</TableCell>
        <TableCell>Updated At</TableCell>
      </TableRow>
    </TableHead>
  );
}
