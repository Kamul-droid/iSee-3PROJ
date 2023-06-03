import { Formik, Field, Form } from 'formik';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import { Toolbar } from '../components/ToolbarComponent';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <>
      <Toolbar />
      <div className="w-max m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Login to Isee</h1>
        <hr className="my-2" />
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            apiFetch(endpoints.auth.login, 'POST', values)
              .then((data) => {
                localStorage.setItem('jwt', data.access_token);
                localStorage.setObject('user', data.user);
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch();
          }}
        >
          <Form className="flex flex-col">
            <LabelledFieldComponent name="email" placeholder="example@gmail.com" />
            <LabelledFieldComponent name="password" placeholder="****" type="password" />

            <ButtonComponent text="Login" type="submit" color="blue" />
          </Form>
        </Formik>
        <p className="text-sm text-gray-500">
          Don&#39;t have an account?{' '}
          <Link to="/register" className="underline text-blue-600">
            register now!
          </Link>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
