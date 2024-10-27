import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const AppNavbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand className="fw-bold">Users & Groups</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-bold" : ""}`
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active fw-bold" : ""}`
              }
            >
              Groups
            </NavLink>
          </Nav>
          {isAuthenticated && (
            <Button
              variant="outline-light"
              className="ms-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
