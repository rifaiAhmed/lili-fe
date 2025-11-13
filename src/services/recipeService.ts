import { RecipeItem, RecipeDetailResponse } from 'src/models/recipe';

interface ApiResponse {
  meta: { current_page: number; totalPages: number; totalData: number };
  data: RecipeItem[];
}

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Helper function untuk menangani error Unauthorized (401)
 */
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  window.location.href = '/sign-in';
};

/**
 * Fetch recipe items with pagination, search, and sorting.
 */
export const fetchRecipe = async (
  page: number = 1,
  rowsPerPage: number = 5,
  search: string = '',
  sortType: string = '',
  sortBy: string = ''
): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('token') || '';

    const queryParams = new URLSearchParams({
      sort_by: sortBy,
      sort_type: sortType,
      limit: rowsPerPage.toString(),
      skip: ((page - 1) * rowsPerPage).toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    const response = await fetch(`${apiUrl}book/v1/list-history?${queryParams}`, {
      method: 'GET',
      headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

/**
 * Delete recipe item by ID.
 */
export async function deleteRecipeItem(id: number) {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${apiUrl}book/v1/pengembalian/${id}`, {
      method: 'PATCH',
      headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) throw new Error('Failed to delete recipe item');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}

/**
 * Create a new recipe (peminjaman buku).
 */
export async function createRecipeItem(itemData: { book_id: number; user_id: number }): Promise<RecipeItem> {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${apiUrl}book/v1/peminjaman`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: itemData.book_id,
        user_id: itemData.user_id,
      }),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create recipe item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

/**
 * Update an existing recipe (peminjaman buku).
 */
export async function updateRecipeItem(
  id: number,
  updatedData: { book_id: number; user_id: number }
): Promise<RecipeItem> {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${apiUrl}recipe/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: token ? `${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: updatedData.book_id,
        user_id: updatedData.user_id,
      }),
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update recipe item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}

/**
 * Fetch recipe details including ingredients.
 */
export const fetchRecipeDetail = async (recipeId: number): Promise<RecipeDetailResponse> => {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${apiUrl}ingredient/recipe?id=${recipeId}`, {
      method: 'GET',
      headers: { Authorization: token ? `${token}` : '', 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

/**
 * Delete recipe item by ID.
 */
export async function deleteIngredentItem(id: number) {
  try {
    const token = localStorage.getItem('token') || '';

    const response = await fetch(`${apiUrl}ingredient/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token ? `${token}` : '', 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) throw new Error('Failed to delete recipe item');
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
}



/**
 * Fetch list of users (untuk dropdown user)
 */
export async function fetchUserList(): Promise<any> {
  try {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${apiUrl}user/v1/list?sort_by=id&sort_type=desc&limit=100`, {
      method: 'GET',
      headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) throw new Error('Failed to fetch user list');

    return await response.json();
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
}

/**
 * Fetch list of books (untuk dropdown buku)
 */
export async function fetchBookList(): Promise<any> {
  try {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${apiUrl}book/v1/list?sort_by=id&sort_type=desc&limit=100`, {
      method: 'GET',
      headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    if (!response.ok) throw new Error('Failed to fetch book list');

    return await response.json();
  } catch (error) {
    console.error('Error fetching book list:', error);
    throw error;
  }
}