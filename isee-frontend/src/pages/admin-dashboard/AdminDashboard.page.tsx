import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/apiFetch';
import endpoints from '../../api/endpoints';
import TimelineChartComponent from '../../components/TimelineChartComponent';
import React from 'react';
import { Toolbar } from '../../components/ToolbarComponent';

type User = { _id: string; createdAt: Date };
type Video = { _id: string; createdAt: Date; size: number };

type ChartData = {
  usersList: User[];
  videosList: Video[];
};

const formatByteSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let unitPointer = 0;
  while (size >= 1000 && unitPointer < units.length) {
    size = size / 1000;
    unitPointer++;
  }
  return `${size.toFixed(3)}${units[unitPointer]}`;
};

export default function AdminDashboardPage() {
  const { data } = useQuery<ChartData>({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiFetch(`${endpoints.adminDashboard.base}`, 'GET'),
  });

  return (
    <>
      <Toolbar />
      <h1 className="text-xl text-center">Administration dashboard</h1>
      <hr className="my-2" />
      {data && (
        <>
          <div className="grid grid-flow-row grid-cols-3 divide-x my-1 gap-3 w-full items-center bg-white shadow-sm rounded-lg p-2">
            <p className="text-center">Total registered users: {data.usersList.length}</p>
            <p className="text-center">Total uploaded videos: {data.videosList.length}</p>
            <p className="text-center">
              Total uploaded video size: {formatByteSize(data.videosList.reduce((prev, video) => prev + video.size, 0))}
            </p>
          </div>
          <TimelineChartComponent data={data.usersList} dateField="createdAt"></TimelineChartComponent>
          <TimelineChartComponent data={data.videosList} dateField="createdAt"></TimelineChartComponent>
        </>
      )}
    </>
  );
}
