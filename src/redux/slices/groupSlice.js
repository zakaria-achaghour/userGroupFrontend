import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../helpers/axiosInstance";

const BASE_URL = "http://localhost:8080/api/groups";

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
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

// Fetch a specific group by ID
export const fetchGroupById = createAsyncThunk(
  "groups/fetchGroupById",
  async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  }
);

// Update a group
export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async (group) => {
    const { id, ...data } = group;
    await axiosInstance.patch(`/groups/${id}`, data, {
      headers: {
        "Content-Type": "application/merge-patch+json",
        Accept: "application/ld+json",
      },
    });
    return group;
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id) => {
    await axiosInstance.delete(`/groups/${id}`);
    return id;
  }
);

export const addGroup = createAsyncThunk("groups/addGroup", async (group) => {
  const response = await axiosInstance.post("/groups", group, {
    headers: {
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
    },
  });
  return response.data;
});

const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    list: [],
    total: 0,
    view: {},
    loading: false,
    selectedGroup: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.list = action.payload.groups;
        state.total = action.payload.total;
        state.view = action.payload.view;
        state.loading = false;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.selectedGroup = action.payload;
        state.loading = false;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.list = state.list.filter((group) => group.id !== action.payload);
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default groupsSlice.reducer;
