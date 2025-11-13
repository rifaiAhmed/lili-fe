import { TableRow, TableCell, Button } from '@mui/material';
import { RecipeItem } from 'src/models/recipe';

interface RecipeTableRowProps {
  row: RecipeItem;
  onEdit: (item: RecipeItem) => void;
  onDelete: (id: number) => void;
  onView: (item: RecipeItem) => void;
}

export function RecipeTableRow({ row, onEdit, onDelete, onView }: RecipeTableRowProps) {
  return (
    <TableRow>
      <TableCell>{row.book_name}</TableCell>
      <TableCell>{row.user_name}</TableCell>
      <TableCell>{row.date_pinjam}</TableCell>
      <TableCell>{row.date_kembali}</TableCell>
      <TableCell>
        <Button
          variant="outlined"
          color="error"
          disabled={row.is_kembali === true}
          onClick={() => onDelete(row.ID)}
        >
          Kembalikan
        </Button>
      </TableCell>
    </TableRow>
  );
}
