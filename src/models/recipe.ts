export interface RecipeItem {
  ID: number;
  book_id: number;
  user_id: number;
  book_name?: string;
  user_name?: string;
  date_pinjam?: string;    // tanggal peminjaman (opsional)
  date_kembali?: string;   // tanggal pengembalian (opsional)
  is_kembali?: boolean;    // status pengembalian
}

export interface Ingredient {
  id: number;
  name: string;
  inventory_id: number;
  quantity: number;
  item: string;
  uom: string;
}

// Jika backend kamu masih mengirim format seperti ini untuk detail recipe
export interface RecipeDetailResponse {
  meta: { 
    message: string; 
    code: number; 
    status: string; 
    response_time: string; 
  };
  recipe: RecipeItem;
  ingredients?: Ingredient[];
}

// Data untuk membuat atau memperbarui item (peminjaman)
export interface RecipeCreatePayload {
  book_id: number;
  user_id: number;
}
