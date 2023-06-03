import { useParams } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import React from 'react';
import PaginatedVideoListComponent from '../../components/PaginatedVideoListComponent';
import { Toolbar } from '../../components/ToolbarComponent';
import buildQueryParams from '../../helpers/buildQueryParams';
import DisplaySwitcherComponent from '../../components/DisplaySwitcherComponent';

function UsersVideosPage() {
  const { uploader_id } = useParams();

  return (
    <>
      <Toolbar />
      <h1 className="text-xl text-center">User&#39;s videos</h1>
      <DisplaySwitcherComponent />
      <PaginatedVideoListComponent
        queryKey={[uploader_id]}
        paginatedUrl={`${endpoints.videos.base}${buildQueryParams({ uploader_id })}`}
      />
    </>
  );
}

export default UsersVideosPage;
