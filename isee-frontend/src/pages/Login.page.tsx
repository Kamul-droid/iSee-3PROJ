import { Formik, Field, Form } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate()

  const initialValues: LoginFormValues = {
    email    : '',
    password : '',
  };

  return (
    <div>
      <h1>My Example</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          console.log(values, endpoints.auth.login)
          apiFetch(endpoints.auth.login, 'POST', values)
            .then(data => {
              localStorage.setItem('jwt', data.access_token)
              actions.setSubmitting(false)
              navigate('/')
            })
            .catch(e => {
              console.log(e)
            })
        }}
      >
        <Form>
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" placeholder="email" />
          <br />

          <label htmlFor="password">Password</label>
          <Field type="password" id="password" name="password" placeholder="password" />
          <br />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginPage;
