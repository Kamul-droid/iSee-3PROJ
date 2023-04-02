import { Formik, Field, Form } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    username        : '',
    email           : '',
    password        : '',
    confirmPassword : '',
  };

  return (
    <div>
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          apiFetch(endpoints.users.register, 'POST', values)
            .then(data => {
              actions.setSubmitting(false)
              navigate('/login')
            })
            .catch()
        }}
      >
        <Form>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="username" />
          <br />

          <label htmlFor="email">Email</label>
          <Field id="email" name="email" placeholder="email" />
          <br />

          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" placeholder="password" />
          <br />

          <label htmlFor="confirmPassword">Confirm password</label>
          <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="confirmPassword" />
          <br />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default RegisterPage;
