import React from 'react';
import ButtonComponent from './ButtonComponent';
import { Form, Formik } from 'formik';
import endpoints from '../api/endpoints';
import { apiFetch } from '../api/apiFetch';
import LabelledFieldComponent from './LabelledFieldComponent';
import { useNavigate } from 'react-router-dom';
import getUser from '../helpers/getUser';

export default function EmailValidationComponent() {
  const initialValues = { code: '' };
  const navigate = useNavigate();

  return (
    <>
      <p className="w-full text-center">Please validate your email address</p>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const fullUri = endpoints.users.validateMail;
          apiFetch(fullUri, 'POST', values)
            .then(() => {
              const user = getUser();

              if (user) {
                user.state.isEmailValidated = true;
                localStorage.setObject('user', user);
              }
              navigate(0);
            })
            .catch(() => {
              alert('Invalid validation code');
            });
        }}
      >
        {({ values }) => (
          <Form className="my-2 flex items-center w-full justify-center">
            <LabelledFieldComponent name="code" placeholder="Validation code" hideLabel />
            <ButtonComponent disabled={!values.code} type="submit" className="mx-2">
              Validate email
            </ButtonComponent>
            <ButtonComponent
              color="light"
              onClick={() => {
                const fullUri = endpoints.users.sendValidationEmail;
                apiFetch(fullUri, 'POST')
                  .catch()
                  .then(() => {
                    alert('A validation email has been sent');
                  });
              }}
            >
              Resend validation
            </ButtonComponent>
          </Form>
        )}
      </Formik>
    </>
  );
}
