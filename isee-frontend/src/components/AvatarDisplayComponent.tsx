import React from 'react';
import { Link } from 'react-router-dom';
import endpoints from '../api/endpoints';
import { IReducedUser } from '../interfaces/IReducedUser';

export default function AvatarDisplayComponent(
  props: IReducedUser & {
    className?: string;
    size?: 'small' | 'medium' | 'large';
    showUsername?: boolean;
    linksTo?: 'channel' | 'image' | 'none';
  },
) {
  const { _id, avatar, username, className, showUsername } = props;
  const linksTo = props.linksTo ?? 'channel';

  const size = props.size || 'small';
  const dimensions = size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-20 h-20' : 'w-52 h-52';

  const profileElement = (
    <div className={`flex items-center ${className}`}>
      <img
        src={`${endpoints.apiBase}profile-pictures/${avatar}`}
        alt={`${username}`}
        className={`rounded-full bg-white ${dimensions} shadow-md bg-clip-content object-cover text-xs overflow-clip`}
      ></img>
    </div>
  );
  {
    showUsername && <p className="px-2">{username}</p>;
  }

  return (
    <>
      {linksTo === 'channel' ? (
        <Link to={`/users/${_id}/videos`}>{profileElement}</Link>
      ) : linksTo === 'image' ? (
        <Link to={`${endpoints.apiBase}profile-pictures/${avatar}`} target="_blank">
          {profileElement}
        </Link>
      ) : (
        profileElement
      )}
    </>
  );
}
