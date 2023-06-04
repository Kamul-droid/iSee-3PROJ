import React from 'react';
import { useParams } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import buildQueryParams from '../../helpers/buildQueryParams';
import PaginatedVideoListComponent from '../../components/PaginatedVideoListComponent';
import DisplaySwitcherComponent from '../../components/DisplaySwitcherComponent';

function SearchPage() {
  const { searchQuery } = useParams();

  return (
    <div>
      <h1 className="text-xl text-center">Results for {searchQuery}</h1>
      <DisplaySwitcherComponent />
      <PaginatedVideoListComponent
        paginatedUrl={`${endpoints.videos.base}${buildQueryParams({ searchQuery })}`}
        queryKey={['searchVideos', searchQuery]}
      />
    </div>
  );
}

export default SearchPage;
