import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/apiFetch';
import endpoints from '../../api/endpoints';
import TimelineChartComponent from '../../components/TimelineChartComponent';
import React from 'react';

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
      {data && (
        <>
          <p>Total registered users: {data.usersList.length}</p>
          <p>Total uploaded videos: {data.videosList.length}</p>
          <p>
            Total uploaded video size: {formatByteSize(data.videosList.reduce((prev, video) => prev + video.size, 0))}
          </p>
          <TimelineChartComponent data={data.usersList} dateField="createdAt"></TimelineChartComponent>
          <TimelineChartComponent data={data.videosList} dateField="createdAt"></TimelineChartComponent>
        </>
      )}
    </>
  );
}
