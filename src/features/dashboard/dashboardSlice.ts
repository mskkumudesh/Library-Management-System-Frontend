import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface CategoryCount {
  category: string;
  count: number;
}

export interface RecentReturn {
  id: string;
  bookTitle: string;
  memberName: string;
  returnedAt: string;
  fineAmount: number;
}

export interface DashboardSummary {
  totalTitles: number;
  totalCopies: number;
  availableCopies: number;
  borrowedCopies: number;
  borrowedCount: number;
  overdueCount: number;
  topCategories: CategoryCount[];
  recentReturns: RecentReturn[];
}

interface DashboardState {
  summary: DashboardSummary | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  status: "idle",
  error: null,
};

export const fetchSummary = createAsyncThunk<DashboardSummary>(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<DashboardSummary>("/dashboard/summary");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action: PayloadAction<DashboardSummary>) => {
        state.status = "succeeded";
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load dashboard";
      });
  },
});

export default dashboardSlice.reducer;
