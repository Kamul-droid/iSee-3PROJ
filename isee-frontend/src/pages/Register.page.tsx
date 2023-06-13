import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';
import * as Yup from 'yup';
import ErrorMessageComponent from '../components/ErrorMessageComponent';

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
  const [errorMessage, setErrorMessage] = useState('');
  const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
    confirmPassword: Yup.string()
      .required('Required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  return (
    <>
      <div className="w-full max-w-lg m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Register an account</h1>
        <hr className="my-2" />
        <Formik
          validationSchema={registerValidationSchema}
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            apiFetch(endpoints.auth.register, 'POST', values)
              .then((data) => {
                localStorage.setItem('jwt', data.access_token);
                localStorage.setObject('user', data.user);
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch((e) => {
                if (e.status === 409) {
                  setErrorMessage('This email address is already in use');
                }
              });
          }}
        >
          {({ errors, touched }) => (
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

              <ButtonComponent type="submit" color="blue" className="w-full">
                Register
              </ButtonComponent>
              <p className="text-sm text-gray-500">
                Already got an account?{' '}
                <Link to="/login" className="underline text-blue-600">
                  Log in!
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

export default RegisterPage;
