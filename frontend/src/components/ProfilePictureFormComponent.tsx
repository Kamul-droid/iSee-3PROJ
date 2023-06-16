import React, { ChangeEvent, useState } from 'react';
import endpoints from '../api/endpoints';
import { apiFetch } from '../api/apiFetch';
import getUser from '../helpers/getUser';
import AvatarDisplayComponent from './AvatarDisplayComponent';

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
    <div className="my-2">
      <input name="file" type="file" id="file" accept=".jpg,.png" onChange={handleUpload}></input>
      {user && profilePicture ? (
        <AvatarDisplayComponent
          size="large"
          {...user}
          avatar={profilePicture}
          linksTo="image"
          className="w-max mx-auto my-2"
        />
      ) : (
        <p>No profile picture</p>
      )}
    </div>
  );
}

export default ProfilePictureForm;
