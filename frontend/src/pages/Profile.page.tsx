import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import removeEmpty from '../helpers/removeEmpty';
import ProfilePictureForm from '../components/ProfilePictureFormComponent';
import getUser from '../helpers/getUser';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';
import LabelledTextAreaComponent from '../components/LabelledTextAreaComponent';
import * as Yup from 'yup';
import ErrorMessageComponent from '../components/ErrorMessageComponent';

interface ProfileFormValues {
  username: string;
  password: string;
  bio: string;
  confirmPassword: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!getUser()) navigate('/login');
  }, []);

  const initialValues: ProfileFormValues = {
    username: user?.username || '',
    bio: user?.bio || '',
    password: '',
    confirmPassword: '',
  };
  const [errorMessage, setErrorMessage] = useState('');
  const updateProfileValidationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const handleAccountDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone')) {
      apiFetch(endpoints.users.base, 'DELETE')
        .then(() => {
          localStorage.clear();
          navigate('/');
        })
        .catch(async (e) => {
          if (e.status === 409) {
            const err = await e.json();
            setErrorMessage(err.message);
          }
        });
    }
  };

  return (
    <div>
      <div className="w-full max-w-lg m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Edit profile</h1>
        <hr className="my-2" />
        <ProfilePictureForm />
        <Formik
          initialValues={initialValues}
          validationSchema={updateProfileValidationSchema}
          onSubmit={async (values, actions) => {
            const filteredValues = removeEmpty(values);
            if (Object.keys(filteredValues).length === 0) return;

            apiFetch(endpoints.users.base, 'PATCH', filteredValues)
              .then((data) => {
                localStorage.setObject('user', data);
                actions.setSubmitting(false);
                navigate(-1);
              })
              .catch(async (e) => {
                if (e.status === 409) {
                  const err = await e.json();
                  setErrorMessage(err.message);
                }
              });
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <LabelledFieldComponent name="username" placeholder="Yui Dumb" />
              <LabelledTextAreaComponent name="bio" placeholder="Describe yourself" label="About me" />
              <LabelledFieldComponent name="password" type="password" placeholder="*****" />
              <LabelledFieldComponent
                name="confirmPassword"
                type="password"
                placeholder="*****"
                label="confirm password"
              />
              <ButtonComponent type="submit" className="w-full">
                Save changes
              </ButtonComponent>
              <ButtonComponent onClick={handleAccountDelete} color="red" className="w-full">
                Delete account
              </ButtonComponent>
              <ErrorMessageComponent error={errorMessage} errors={errors} touched={touched} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ProfilePage;
