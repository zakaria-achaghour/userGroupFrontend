import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../redux/slices/userSlice";
import { fetchGroups } from "../../redux/slices/groupSlice";
import FieldGroup from "../../components/FieldGroup";
import { Alert } from "bootstrap/dist/js/bootstrap.bundle.min";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { list: groups, loading: groupsLoading } = useSelector(
    (state) => state.groups
  );

  useEffect(() => {
    dispatch(fetchGroups({ page: 1, itemsPerPage: 100 }));
  }, [dispatch]);

  const groupOptions = groups.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    type: "",
    groupIds: [],
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    age: Yup.number()
      .min(1, "Age must be at least 1")
      .required("Age is required"),
    type: Yup.string().required("User type is required"),
    groupIds: Yup.array().min(1, "Please select at least one group"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formattedValues = {
        ...values,
        groups: values.groupIds.map((id) => `/api/groups/${id}`),
      };

      await dispatch(addUser(formattedValues)).unwrap();

      navigate("/users");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const violations = err.response.data.violations;
        violations.forEach((violation) => {
          setFieldError(violation.propertyPath, violation.message);
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (groupsLoading) {
    return (
      <Container className="d-flex vh-100 align-items-center justify-content-center">
        <span>Loading groups...</span>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-start"
      style={{ maxWidth: "600px", minHeight: "100vh", paddingTop: "50px" }}
    >
      <Row className="w-100">
        <Col>
          <h2 className="text-center mb-4">Create New User</h2>
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
            {({ setFieldValue, values, isSubmitting }) => (
              <Form>
                <FieldGroup
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                />
                <FieldGroup
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                />
                <FieldGroup
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                />
                <FieldGroup
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                />
                <FieldGroup
                  label="Age"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                />
                <div className="mb-3">
                  <label>User Type</label>
                  <Field as="select" name="type" className="form-control">
                    <option value="">Select User Type</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="guest">Guest</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label>Groups</label>
                  <Select
                    options={groupOptions}
                    isMulti
                    name="groupIds"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={groupOptions.filter((option) =>
                      values.groupIds.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      setFieldValue(
                        "groupIds",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      )
                    }
                  />
                  <ErrorMessage
                    name="groupIds"
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
                  {isSubmitting ? "Submitting..." : "Create User"}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUser;
