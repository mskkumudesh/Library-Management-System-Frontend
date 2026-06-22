import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface Book {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  coverUrl?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

interface BooksState {
  items: Book[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk<Book[], { search?: string; category?: string } | void>(
  "books/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Book[]>("/books", { params: params || {} });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load books");
    }
  }
);

export const createBook = createAsyncThunk<
  Book,
  { isbn: string; title: string; author: string; category: string; coverUrl?: string; totalCopies: number }
>("books/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<Book>("/books", payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to add book");
  }
});

export const updateBook = createAsyncThunk<
  Book,
  { id: string; changes: Partial<Pick<Book, "title" | "author" | "category" | "coverUrl" | "totalCopies">> }
>("books/update", async ({ id, changes }, { rejectWithValue }) => {
  try {
    const { data } = await api.put<Book>(`/books/${id}`, changes);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to update book");
  }
});

export const deleteBook = createAsyncThunk<string, string>(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/books/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete book");
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load books";
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export default booksSlice.reducer;
