import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Pagination,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { deleteGroup, fetchGroups } from "../../redux/slices/groupSlice";
import { useNavigate } from "react-router-dom";

const GroupList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: groups,
    view,
    error,
  } = useSelector((state) => state.groups);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  useEffect(() => {
    dispatch(fetchGroups({ page: currentPage, itemsPerPage }));
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
    if (window.confirm("Are you sure you want to delete this group?")) {
      dispatch(deleteGroup(id));
    }
  };

  return (
    <Container
      className="py-5"
      style={{ maxWidth: "900px", minHeight: "100vh" }}
    >
      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col xs={12} md={6}>
          <h2 className="text-center text-md-start">Group List</h2>
        </Col>
        <Col xs={12} md={6} className="text-md-end text-center">
          <Button variant="primary" onClick={() => navigate("/groups/add")}>
            Add Group
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Table responsive bordered hover className="text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Group Name</th>
                <th>Group Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <tr key={group.id}>
                    <td>{group.id}</td>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/groups/${group.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/groups/${group.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(group.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Groups Found</td>
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

export default GroupList;
