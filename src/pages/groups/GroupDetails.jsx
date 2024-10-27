import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGroupById } from "../../redux/slices/groupSlice";
import { Button, Container, Row, Col, Spinner, Card } from "react-bootstrap";

const GroupDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedGroup, loading } = useSelector((state) => state.groups);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchGroupById(id));
  }, [dispatch, id]);

  if (loading || !selectedGroup) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 d-flex justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="text-center bg-light fw-bold">
              Group Details
            </Card.Header>
            <Card.Body className="text-center">
              <Card.Title className="mb-2 text-uppercase fw-bold">
                {selectedGroup.name}
              </Card.Title>
              <Card.Text className="mb-4 text-muted">
                {selectedGroup.description}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate("/groups")}
                className="w-100"
              >
                Back to Groups
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GroupDetails;
