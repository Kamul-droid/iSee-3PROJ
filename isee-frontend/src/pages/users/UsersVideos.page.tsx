import { useParams } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import React from 'react';
import PaginatedVideoListComponent from '../../components/PaginatedVideoListComponent';
import { Toolbar } from '../../components/ToolbarComponent';
import buildQueryParams from '../../helpers/buildQueryParams';

function UsersVideosPage() {
  const { uploader_id } = useParams();

  return (
    <>
      <Toolbar />
      <PaginatedVideoListComponent
        queryKey={[uploader_id]}
        paginatedUrl={`${endpoints.videos.base}${buildQueryParams({ uploader_id })}`}
      />
    </>
  );
}

export default UsersVideosPage;
