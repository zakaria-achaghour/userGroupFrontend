import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../helpers/axiosInstance";

const BASE_URL = "http://localhost:8080/api/users";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, itemsPerPage }) => {
    const response = await axios.get(
      `${BASE_URL}?itemsPerPage=${itemsPerPage}&page=${page}`
    );
    const { member, totalItems, view } = response.data;

    return {
      groups: member,
      total: totalItems,
      view,
    };
  }
);

export const addUser = createAsyncThunk("users/addUser", async (user) => {
  const response = await axiosInstance.post("/users", user, {
    headers: {
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
    },
  });

  return response.data;
});
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  const { id, ...data } = user;
  await axiosInstance.patch(`/users/${id}`, data, {
    headers: {
      "Content-Type": "application/merge-patch+json",
      Accept: "application/ld+json",
    },
  });

  return user;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await axiosInstance.delete(`/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    total: 0,
    view: {},
    loading: false,
    selectedGroup: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.list.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) state.list[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload.groups;
        state.total = action.payload.total;
        state.view = action.payload.view;
        state.loading = false;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
