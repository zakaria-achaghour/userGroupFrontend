import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById } from "../../redux/slices/userSlice";
import { fetchGroups } from "../../redux/slices/groupSlice";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { getGroupNames } from "../../helpers/groupNameHelper";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, loading: userLoading } = useSelector(
    (state) => state.users
  );
  const { list, loading: groupLoading } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchUserById(id));
    dispatch(fetchGroups({ page: 1, itemsPerPage: 100 }));
  }, [dispatch, id]);

  if (userLoading || groupLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  if (!selectedUser) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <p>User not found</p>
          <Button variant="primary" onClick={() => navigate("/users")}>
            Back to Users
          </Button>
        </div>
      </Container>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    age,
    type,
    groups: userGroups,
  } = selectedUser;

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="w-100 d-flex justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="text-center bg-light fw-bold">
              User Details
            </Card.Header>
            <Card.Body className="p-4">
              <Card.Title className="mb-3 text-uppercase fw-bold">{`${firstName} ${lastName}`}</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {email}
              </Card.Text>
              <Card.Text>
                <strong>Phone:</strong> {phone}
              </Card.Text>
              <Card.Text>
                <strong>Age:</strong> {age}
              </Card.Text>
              <Card.Text>
                <strong>Type:</strong> {type}
              </Card.Text>
              <Card.Text>
                <strong>Groups:</strong> {getGroupNames(userGroups, list)}
              </Card.Text>
              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={() => navigate("/users")}
              >
                Back to Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetails;
