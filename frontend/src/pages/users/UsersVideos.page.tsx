import { useParams } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import React from 'react';
import PaginatedVideoListComponent from '../../components/PaginatedVideoListComponent';
import buildQueryParams from '../../helpers/buildQueryParams';
import DisplaySwitcherComponent from '../../components/DisplaySwitcherComponent';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/apiFetch';
import { IUser } from '../../interfaces/IUser';
import AvatarDisplayComponent from '../../components/AvatarDisplayComponent';
import formatDate from '../../helpers/formatDate';
import { IUserProfile } from '../../interfaces/IUserProfile';
import abbreviateNumber from '../../helpers/abbreviateNumber';

function UsersVideosPage() {
  const { userId } = useParams();

  const { data } = useQuery<IUserProfile>({
    queryKey: ['userInfos', userId],
    queryFn: () => apiFetch(`${endpoints.users.base}/${userId}`, 'GET'),
  });

  return (
    <>
      {data && (
        <>
          <div className="bg-white shadow-md p-4 rounded-lg my-3 flex">
            <AvatarDisplayComponent {...data} size="large" className="mr-5" />
            <div>
              <h1 className="text-xl">{data.username}&#39;s Profile</h1>
              <p>Account created on {formatDate(data.createdAt, 'en-US')}</p>
              {data.bio && (
                <>
                  <h2 className="text-lg">About me</h2>
                  <p>{data.bio}</p>
                </>
              )}
              <p>{abbreviateNumber(data.videosCount, 'video', 'videos')} uploaded</p>
            </div>
          </div>
          <hr className="my-2" />
          <h2 className="text-lg text-center">{data.username}&#39; videos</h2>
          <DisplaySwitcherComponent />
          <PaginatedVideoListComponent
            queryKey={[userId]}
            paginatedUrl={`${endpoints.videos.base}${buildQueryParams({ userId })}`}
          />
        </>
      )}
    </>
  );
}

export default UsersVideosPage;
