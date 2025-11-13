import { useEffect, useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { updateRecipeItem, createRecipeItem, fetchBookList, fetchUserList } from 'src/services/recipeService';
import { RecipeItem } from 'src/models/recipe';

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  item?: RecipeItem | null;
  onSuccess: (message: string) => void;
}

interface FormState {
  book_id: number;
  user_id: number;
}

export function RecipeModal({ open, onClose, onSuccess, item }: RecipeModalProps) {
  const [form, setForm] = useState<FormState>({ book_id: 0, user_id: 0 });
  const [errors, setErrors] = useState({ book_id: '', user_id: '' });

  const [books, setBooks] = useState<{ id: number; book_name: string }[]>([]);
  const [users, setUsers] = useState<{ id: number; user_name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch book & user list from API
  const loadDropdownData = useCallback(async () => {
    try {
      setLoading(true);

      const [bookRes, userRes] = await Promise.all([fetchBookList(), fetchUserList()]);

      setBooks(bookRes.data || []);
      setUsers(userRes.data || []);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadDropdownData();
    }

    setForm({
      book_id: item ? (item as any).book_id || 0 : 0,
      user_id: item ? (item as any).user_id || 0 : 0,
    });
    setErrors({ book_id: '', user_id: '' });
  }, [item, open, loadDropdownData]);

  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = { book_id: '', user_id: '' };

    if (!form.book_id) {
      newErrors.book_id = 'Pilih buku terlebih dahulu';
      valid = false;
    }
    if (!form.user_id) {
      newErrors.user_id = 'Pilih user terlebih dahulu';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [form]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      if (item) {
        await updateRecipeItem(item.ID, {
          book_id: form.book_id,
          user_id: form.user_id,
        });
        onSuccess('Data peminjaman berhasil diperbarui!');
      } else {
        await createRecipeItem({
          book_id: form.book_id,
          user_id: form.user_id,
        });
        onSuccess('Data peminjaman berhasil ditambahkan!');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  }, [form, item, onClose, onSuccess, validateForm]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{item ? 'Edit Peminjaman Buku' : 'Tambah Peminjaman Buku'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <FormControl fullWidth margin="normal" error={!!errors.book_id}>
              <InputLabel>Buku</InputLabel>
              <Select
                name="book_id"
                value={form.book_id}
                label="Buku"
                onChange={handleChange}
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.book_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.book_id && (
                <p style={{ color: 'red', fontSize: 12 }}>{errors.book_id}</p>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.user_id}>
              <InputLabel>User</InputLabel>
              <Select
                name="user_id"
                value={form.user_id}
                label="User"
                onChange={handleChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.user_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.user_id && (
                <p style={{ color: 'red', fontSize: 12 }}>{errors.user_id}</p>
              )}
            </FormControl>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
