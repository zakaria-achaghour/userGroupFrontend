import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGroupById, updateGroup } from "../../redux/slices/groupSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const EditGroup = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedGroup,
    loading,
    error: fetchError,
  } = useSelector((state) => state.groups);
  const [formError, setFormError] = useState(null);
  useEffect(() => {
    dispatch(fetchGroupById(id));
  }, [dispatch, id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Group name is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateGroup({ id, ...values })).unwrap();
      navigate("/groups");
    } catch (error) {
      setFormError(
        error.message || "Failed to update group. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Alert variant="danger" className="text-center">
          {fetchError || "Failed to load group data."}
        </Alert>
      </Container>
    );
  }

  const initialValues = {
    name: selectedGroup?.name || "",
    description: selectedGroup?.description || "",
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "600px", minHeight: "100vh", padding: "30px 15px" }}
    >
      <Row className="w-100">
        <Col>
          <h2 className="text-center mb-4">Edit Group</h2>

          {formError && (
            <Alert variant="danger" className="text-center">
              {formError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label">Group Name</label>
                  <Field
                    name="name"
                    className="form-control"
                    placeholder="Enter group name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Group Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Enter group description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Updating...
                    </>
                  ) : (
                    "Update Group"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default EditGroup;
