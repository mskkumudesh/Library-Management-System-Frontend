import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "../features/auth/authSlice";
import booksReducer from "../features/books/booksSlice";
import borrowReducer from "../features/borrow/borrowSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    borrow: borrowReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
