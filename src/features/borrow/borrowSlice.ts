import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface BorrowRecord {
  _id: string;
  book: { _id: string; title: string; author: string; isbn: string };
  member: { _id: string; name: string; email: string };
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
  fineAmount: number;
}

export interface Member {
  _id: string;
  name: string;
  email: string;
}

interface BorrowState {
  activeLoans: BorrowRecord[];
  myHistory: BorrowRecord[];
  members: Member[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BorrowState = {
  activeLoans: [],
  myHistory: [],
  members: [],
  status: "idle",
  error: null,
};

export const fetchActiveLoans = createAsyncThunk<BorrowRecord[]>(
  "borrow/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<BorrowRecord[]>("/issuedbooks/active");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load active loans");
    }
  }
);

export const fetchMemberHistory = createAsyncThunk<BorrowRecord[], string>(
  "borrow/fetchMemberHistory",
  async (memberId, { rejectWithValue }) => {
    try {
      const { data } = await api.get<BorrowRecord[]>(`/borrow/member/${memberId}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load borrowing history");
    }
  }
);

export const fetchMembers = createAsyncThunk<Member[], string | void>(
  "borrow/fetchMembers",
  async (search, { rejectWithValue }) => {
    try {
      const { data } = await api.get<Member[]>("/users/members", {
        params: search ? { search } : {},
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load members");
    }
  }
);

export const checkoutBook = createAsyncThunk<
  BorrowRecord,
  { isbn: string; memberId: string }
>("borrow/checkout", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<BorrowRecord>("/borrow", payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Checkout failed");
  }
});

export const returnBook = createAsyncThunk<BorrowRecord, string>(
  "borrow/return",
  async (recordId, { rejectWithValue }) => {
    try {
      const { data } = await api.post<BorrowRecord>(`/borrow/${recordId}/return`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Return failed");
    }
  }
);

const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveLoans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActiveLoans.fulfilled, (state, action: PayloadAction<BorrowRecord[]>) => {
        state.status = "succeeded";
        state.activeLoans = action.payload;
      })
      .addCase(fetchActiveLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load active loans";
      })
      .addCase(fetchMemberHistory.fulfilled, (state, action: PayloadAction<BorrowRecord[]>) => {
        state.myHistory = action.payload;
      })
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.members = action.payload;
      })
      .addCase(checkoutBook.fulfilled, (state, action: PayloadAction<BorrowRecord>) => {
        state.activeLoans.unshift(action.payload);
      })
      .addCase(returnBook.fulfilled, (state, action: PayloadAction<BorrowRecord>) => {
        state.activeLoans = state.activeLoans.filter((r) => r._id !== action.payload._id);
      });
  },
});

export default borrowSlice.reducer;
