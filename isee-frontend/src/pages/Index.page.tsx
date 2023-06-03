import React from 'react';
import endpoints from '../api/endpoints';
import PaginatedVideoListComponent from '../components/PaginatedVideoListComponent';
import { Toolbar } from '../components/ToolbarComponent';
import DisplaySwitcherComponent from '../components/DisplaySwitcherComponent';

function IndexPage() {
  return (
    <>
      <Toolbar />
      <h1 className="text-xl text-center">Isee front page</h1>
      <DisplaySwitcherComponent />
      <hr className="my-2" />
      <p>Recent videos</p>
      <PaginatedVideoListComponent paginatedUrl={endpoints.videos.base} queryKey={['recentVideos']} />
    </>
  );
}

export default IndexPage;
