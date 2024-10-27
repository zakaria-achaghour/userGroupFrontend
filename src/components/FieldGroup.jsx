import React from "react";
import { ErrorMessage, Field } from "formik";

const FieldGroup = ({ label, name, type, placeholder }) => (
  <div className="mb-3">
    <label>{label}</label>
    <Field
      name={name}
      type={type}
      className="form-control"
      placeholder={placeholder}
    />
    <ErrorMessage name={name} component="div" className="text-danger" />
  </div>
);

export default FieldGroup;
