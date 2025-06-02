import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../utils/useAxiosInstance";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ page, limit, filters }, thunkAPI) => {
    const state = thunkAPI.getState();
    const userRole = state.user.user?.role[0];

    if (userRole !== "expert") {
      return thunkAPI.rejectWithValue(
        "You don't have permission to access this resource."
      );
    }
    try {
      const server = process.env.REACT_APP_API_SERVER;
      const response = await api.post(`/get/expert/orders`, {
        page,
        limit,
        filters,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    total: 0,
    filters: { search: "", type: "all", date: "", orderStatus: "all" },
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters: (state) => {
      state.page = 1;
      state.filters = { search: "", type: "all", date: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
        state.filters = { search: "", type: "all", date: "" };
        state.total = 0;
      });
  },
});

export const { setPage, setFilters, resetFilters } = ordersSlice.actions;
export default ordersSlice.reducer;
