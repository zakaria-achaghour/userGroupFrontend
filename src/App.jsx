import React, { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import CreateUser from "./pages/users/CreateUser";
import EditGroup from "./pages/groups/EditGroup";
import Navbar from "./components/Navbar";
import UserList from "./pages/users/UserList";
import GroupList from "./pages/groups/GroupList";
import AddGroup from "./pages/groups/AddGroup";
import GroupDetails from "./pages/groups/GroupDetails";
import EditUser from "./pages/users/EditUser";
import UserDetails from "./pages/users/UserDetails";
import PrivateRoute from "./routes/PrivateRoute";
import { checkAuth } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <span>Loading...</span>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/users" /> : <SignIn />}
        />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/users" element={<UserList />} />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/users/add" element={<CreateUser />} />
          <Route path="/groups/add" element={<AddGroup />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/groups/:id/edit" element={<EditGroup />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
