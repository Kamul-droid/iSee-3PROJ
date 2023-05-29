import React, { ChangeEvent, useState } from 'react';
import endpoints from '../api/endpoints';
import { apiFetch } from '../api/apiFetch';
import getUser from '../helpers/getUser';


function ProfilePictureForm() {
  const user = getUser();

  const [profilePicture, setProfilePicture] = useState(user?.avatar || '');

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
      {profilePicture ? (
        <img width="150px" src={`${endpoints.apiBase}profile-pictures/${profilePicture}`} alt=""></img>
      ) : (
        <p>No profile picture</p>
      )}
    </>
  );
}

export default ProfilePictureForm;
