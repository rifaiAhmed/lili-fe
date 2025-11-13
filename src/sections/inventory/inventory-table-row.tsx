import { TableRow, TableCell, Button } from '@mui/material';
import { InventoryItem } from 'src/models/inventory';

interface InventoryTableRowProps {
  row: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

export function InventoryTableRow({ row, onEdit, onDelete }: InventoryTableRowProps) {
  return (
    <TableRow>
      <TableCell>{row.book_name}</TableCell>
      <TableCell>{row.amount}</TableCell>
      <TableCell>{row.created_at}</TableCell>
      <TableCell>{row.updated_at}</TableCell>
      {/* <TableCell>
        <Button variant="outlined" color="primary" onClick={() => onEdit(row)}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={() => onDelete(row.id)} sx={{ ml: 1 }}>
          Delete
        </Button>
      </TableCell> */}
    </TableRow>
  );
}
