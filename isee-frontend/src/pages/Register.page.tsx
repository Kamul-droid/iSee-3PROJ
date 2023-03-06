import { Formik, Field, Form } from 'formik';
import React from 'react';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const initialValues: RegisterFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <div>
      <h1>My Example</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
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
