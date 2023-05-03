import React, { ChangeEvent, useState } from 'react';
import endpoints from '../api/endpoints';
import { apiFetch } from '../api/apiFetch';
import { useNavigate } from 'react-router-dom';
import getUser from '../helpers/getUser';

enum EUploadStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  SUCCESS = 'success',
  ERROR = 'error',
}

function ProfilePictureComponent() {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(getUser()?.avatar || '');

  const handleUpload = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const formData = new FormData();

      formData.append('file', file);

      apiFetch(endpoints.users.setProfilePicture, 'POST', formData).then((data) => {
        localStorage.setObject('user', data);
        setProfilePicture(data.avatar);
      });
    }
  };

  return (
    <>
      <input name="file" type="file" id="file" accept=".jpg,.png" onChange={handleUpload}></input>
      <br />
      <img width="150px" src={`${endpoints.apiBase}profile-pictures/${profilePicture}`} alt=""></img>
    </>
  );
}

export default ProfilePictureComponent;
