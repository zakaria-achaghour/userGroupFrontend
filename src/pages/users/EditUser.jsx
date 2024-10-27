import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../redux/slices/userSlice';
import { fetchGroups } from '../../redux/slices/groupSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import FieldGroup from '../../components/FieldGroup';

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedUser, loading: userLoading } = useSelector((state) => state.users);
  const { list: groups, loading: groupLoading } = useSelector((state) => state.groups);
  const [error, setError] = useState(null); 

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    type: '',
    groupIds: [],
  });

  useEffect(() => {
    dispatch(fetchUserById(id));
    dispatch(fetchGroups({ page: 1, itemsPerPage: 100 }));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedUser) {
      setInitialValues({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        age: selectedUser.age,
        type: selectedUser.type,
        groupIds: selectedUser.groups ? selectedUser.groups.map((group) => group.id) : [],
      });

    }
  }, [selectedUser]);

  const groupOptions = groups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    age: Yup.number().required('Age is required').min(1, 'Age must be at least 1'),
    type: Yup.string().required('User type is required'),
    groupIds: Yup.array().min(1, 'Please select at least one group'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const formattedValues = {
        ...values,
        groups: values.groupIds.map((id) => `/api/groups/${id}`),
      };

      await dispatch(updateUser({ id, ...formattedValues })).unwrap();
      navigate('/users');
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const violations = err.response.data.violations;
        violations.forEach(({ propertyPath, message }) => {
          setFieldError(propertyPath, message);
        });
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || groupLoading) {
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
    className="d-flex flex-column align-items-center justify-content-start"
    style={{ maxWidth: '600px', minHeight: '100vh', paddingTop: '50px' }}
  >
    <Row className="w-100">
      <Col>
        <h2 className="text-center mb-4">Edit User</h2>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <FieldGroup 
                label="First Name" 
                name="firstName" 
                type="text" 
              />
              <FieldGroup 
                label="Last Name" 
                name="lastName" 
                type="text" 
              />
              <FieldGroup 
                label="Email" 
                name="email" 
                type="email" 
              />
              <FieldGroup 
                label="Phone" 
                name="phone" 
                type="text" 
              />
              <FieldGroup 
                label="Age" 
                name="age" 
                type="number" 
              />

              <div className="mb-3">
                <label>User Type</label>
                <Field as="select" name="type" className="form-control">
                  <option value="">Select User Type</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </Field>
                <ErrorMessage name="type" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Groups</label>
                <Select
                  options={groupOptions}
                  isMulti
                  name="groupIds"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={groupOptions.filter((option) => values.groupIds.includes(option.value))}
                  onChange={(selectedOptions) =>
                    setFieldValue(
                      'groupIds',
                      selectedOptions ? selectedOptions.map((option) => option.value) : []
                    )
                  }
                />
                <ErrorMessage name="groupIds" component="div" className="text-danger" />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-100 mt-3" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  </Container>
  );
};

export default EditUser;
