import { Formik, Form } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import removeEmpty from '../helpers/removeEmpty';
import ProfilePictureForm from '../components/ProfilePictureFormComponent';
import getUser from '../helpers/getUser';
import LabelledFieldComponent from '../components/LabelledFieldComponent';
import ButtonComponent from '../components/ButtonComponent';

interface ProfileFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();

  const initialValues: ProfileFormValues = {
    username: user?.username || '',
    password: '',
    confirmPassword: '',
  };

  const handleAccountDelete = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone')) {
      apiFetch(endpoints.users.base, 'DELETE').then(() => {
        localStorage.clear();
        navigate('/');
      });
    }
  };

  return (
    <div>
      <div className="w-max m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Edit profile</h1>
        <hr className="my-2" />
        <ProfilePictureForm />
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            const filteredValues = removeEmpty(values);
            if (Object.keys(filteredValues).length === 0) return;

            apiFetch(endpoints.users.base, 'PATCH', filteredValues)
              .then((data) => {
                localStorage.setObject('user', data);
                actions.setSubmitting(false);
              })
              .catch();
          }}
        >
          <Form>
            <LabelledFieldComponent name="username" placeholder="Yui Dumb" />
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
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ProfilePage;
