import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';
import ErrorMessageComponent from '../components/ErrorMessageComponent';
import * as Yup from 'yup';
import getUser from '../helpers/getUser';

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser()) navigate('/');
  }, []);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };
  const [errorMessage, setErrorMessage] = useState('');
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  return (
    <>
      <div className="w-full max-w-lg m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Login to Isee</h1>
        <hr className="my-2" />
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            apiFetch(endpoints.auth.login, 'POST', values)
              .then((data) => {
                console.log(data.user);
                localStorage.setItem('jwt', data.access_token);
                localStorage.setObject('user', data.user);
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch(() => {
                setErrorMessage('Authentication failed');
              });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <LabelledFieldComponent name="email" placeholder="example@gmail.com" />
              <LabelledFieldComponent name="password" placeholder="****" type="password" />

              <ButtonComponent type="submit" color="blue" className="w-full">
                Login
              </ButtonComponent>
              <p className="text-sm text-gray-500">
                Don&#39;t have an account?{' '}
                <Link to="/register" className="underline text-blue-600">
                  register now!
                </Link>
              </p>
              <ErrorMessageComponent error={errorMessage} errors={errors} touched={touched} />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default LoginPage;
