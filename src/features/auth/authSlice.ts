import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";

export type UserRole = "librarian" | "member";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const storedToken = localStorage.getItem("shelfscan_token");
const storedUser = localStorage.getItem("shelfscan_user");

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
  token: storedToken,
  status: "idle",
  error: null,
};

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string; role: UserRole }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("shelfscan_token");
      localStorage.removeItem("shelfscan_user");
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };
    const handleFulfilled = (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("shelfscan_token", action.payload.token);
      localStorage.setItem("shelfscan_user", JSON.stringify(action.payload.user));
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.status = "failed";
      state.error = action.payload || "Something went wrong";
    };

    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
