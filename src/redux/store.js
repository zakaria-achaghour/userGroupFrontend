import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/userSlice";
import groupsReducer from "./slices/groupSlice";
import authReducer from "./slices/authSlice";
import { setupAxiosInterceptors } from "../helpers/axiosInstance";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    groups: groupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

setupAxiosInterceptors(store.dispatch);

export default store;
