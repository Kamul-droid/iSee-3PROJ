import { Formik, Field, Form } from 'formik';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import { Toolbar } from '../components/ToolbarComponent';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <>
      <Toolbar />
      <div className="w-max m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Register an account</h1>
        <hr className="my-2" />
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            apiFetch(endpoints.auth.register, 'POST', values)
              .then((data) => {
                localStorage.setItem('jwt', data.access_token);
                localStorage.setObject('user', data.user);
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch();
          }}
        >
          <Form>
            <LabelledFieldComponent name="username" placeholder="Yui Dumb" />
            <LabelledFieldComponent name="email" placeholder="example@gmail.com" />
            <LabelledFieldComponent name="password" placeholder="****" type="password" />
            <LabelledFieldComponent
              name="confirmPassword"
              placeholder="****"
              label="confirm your password"
              type="password"
            />

            <ButtonComponent text="Register" type="submit" color="blue" className="w-full" />
          </Form>
        </Formik>
        <p className="text-sm text-gray-500">
          Already got an account?{' '}
          <Link to="/login" className="underline text-blue-600">
            Log in!
          </Link>
        </p>
      </div>
    </>
  );
}

export default RegisterPage;
