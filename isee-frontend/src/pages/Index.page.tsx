import React, { useContext } from 'react';
import { DisplayTypeContext } from '../App';
import endpoints from '../api/endpoints';
import PaginatedVideoListComponent from '../components/PaginatedVideoListComponent';
import { Toolbar } from '../components/ToolbarComponent';
import { EDisplayType } from '../enums/EDisplayType';

function IndexPage() {
  const { setDisplayType } = useContext(DisplayTypeContext);

  return (
    <>
      <Toolbar />
      <h1>Isee front page</h1>
      <button onClick={() => setDisplayType(EDisplayType.GRID)} className="px-2">
        Grid display
      </button>
      <button onClick={() => setDisplayType(EDisplayType.LIST)} className="px-2">
        List display
      </button>
      <p>Recent videos</p>
      <PaginatedVideoListComponent paginatedUrl={endpoints.videos.base} queryKey={['recentVideos']} />
    </>
  );
}

export default IndexPage;
