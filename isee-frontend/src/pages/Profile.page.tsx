import { Formik, Field, Form } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import removeEmpty from '../helpers/removeEmpty';
import ProfilePictureForm from '../components/ProfilePictureFormComponent';
import getUser from '../helpers/getUser';
import { Toolbar } from '../components/ToolbarComponent';

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
      <Toolbar />
      <h1>Edit profile</h1>
      <p>Profile picture</p>
      <ProfilePictureForm />
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          const filteredValues = removeEmpty(values);
          console.log(filteredValues);
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
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" placeholder="username" />
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

      <button onClick={handleAccountDelete}>Delete account</button>
    </div>
  );
}

export default ProfilePage;
