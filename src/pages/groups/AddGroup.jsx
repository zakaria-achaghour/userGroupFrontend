import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addGroup } from "../../redux/slices/groupSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const initialValues = { name: "", description: "" };

  const validationSchema = Yup.object({
    name: Yup.string().required("Group name is required"),
    description: Yup.string().required("Description is required"),
  });
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addGroup(values)).unwrap();

      resetForm();
      navigate("/groups");
    } catch (error) {
      setError(error.message || "Failed to add group. Please try again."); // Display error
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-start"
      style={{ maxWidth: "600px", minHeight: "100vh", paddingTop: "50px" }}
    >
      <Row className="w-100">
        <Col>
          <h2 className="text-center mb-4">Add New Group</h2>

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Group Name */}
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

                {/* Group Description */}
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isSubmitting} // Disable button during submission
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
                      Adding...
                    </>
                  ) : (
                    "Add Group"
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

export default AddGroup;
