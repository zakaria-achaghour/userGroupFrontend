import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { fetchUsers, deleteUser } from "../../redux/slices/userSlice";
import { fetchGroups } from "../../redux/slices/groupSlice";
import { useNavigate } from "react-router-dom";
import { getGroupNames } from "../../helpers/groupNameHelper";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: users, view } = useSelector((state) => state.users);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { list: groups } = useSelector(
    (state) => state.groups
  );

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, itemsPerPage }));
    dispatch(fetchGroups({ page: 1, itemsPerPage: 100 }));
  }, [dispatch, currentPage]);

  const handleNextPage = () => {
    if (view?.next) {
      const nextPage = new URLSearchParams(view.next).get("page");
      setCurrentPage(parseInt(nextPage));
    }
  };

  const handlePreviousPage = () => {
    if (view?.first) {
      const prevPage = new URLSearchParams(view.first).get("page");
      setCurrentPage(parseInt(prevPage));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // const getGroupNames = (userGroups) => {
  //   return userGroups
  //     .map(
  //       (userGroup) =>
  //         groups.find((group) => group.id === userGroup.id)?.name || "Unknown"
  //     )
  //     .join(", ");
  // };

  return (
    <Container
      className="py-5"
      style={{ maxWidth: "1000px", minHeight: "100vh" }}
    >
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs={12} md={6}>
          <h2 className="text-center text-md-start">User List</h2>
        </Col>
        <Col xs={12} md={6} className="text-end">
          <Button variant="primary" onClick={() => navigate("/users/add")}>
            Add User
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table responsive bordered hover className="text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Type</th>
                <th>Groups</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.age}</td>
                    <td>{user.type}</td>
                    <td>{getGroupNames(user.groups, groups)}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No Users Found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={handlePreviousPage}
              disabled={!view?.first}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next onClick={handleNextPage} disabled={!view?.next} />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default UserList;
