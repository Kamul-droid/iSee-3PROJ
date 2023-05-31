import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../api/apiFetch';
import endpoints from '../../api/endpoints';
import VideoCard from '../../components/VideoCard';
import buildQueryParams from '../../helpers/buildQueryParams';
import { IVideo } from '../../interfaces/IVideo';
import { Toolbar } from '../../components/ToolbarComponent';
import { DisplayTypeContext } from '../../App';
import PaginatedVideoListComponent from '../../components/PaginatedVideoListComponent';
import { EDisplayType } from '../../enums/EDisplayType';

function SearchPage() {
  const { searchQuery } = useParams();

  const { setDisplayType } = useContext(DisplayTypeContext);

  return (
    <div>
      <Toolbar />
      <h1>Search</h1>
      <p>Results for {searchQuery}</p>
      <button onClick={() => setDisplayType(EDisplayType.GRID)} className="px-2">
        Grid display
      </button>
      <button onClick={() => setDisplayType(EDisplayType.LIST)} className="px-2">
        List display
      </button>
      <PaginatedVideoListComponent
        paginatedUrl={`${endpoints.videos.base}${buildQueryParams({ searchQuery })}`}
        queryKey={['searchVideos', searchQuery]}
      />
    </div>
  );
}

export default SearchPage;
