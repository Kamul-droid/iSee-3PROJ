import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import LabelledSelectComponent from './LabelledSelectComponent';

enum EDateRanges {
  TODAY = 'TODAY',
  PAST_WEEK = 'PAST_WEEK',
  PAST_MONTH = 'PAST_MONTH',
  PAST_YEAR = 'PAST_YEAR',
  ALL = 'ALL',
}

enum EPrecision {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

const dateFormatter = (date: number) => {
  return new Date(date).toLocaleDateString('fr');
};

interface TimelineChartProps {
  data: Record<string, any>[];
  dateField: string;
}

export default function TimelineChartComponent(props: TimelineChartProps) {
  const { data, dateField } = props;

  const [processedData, setProcessedData] = useState([] as { date: number; count: number }[]);

  const [refresh, setRefresh] = useState(0);

  const [dateRange, setDateRange] = useState(EDateRanges.PAST_MONTH);
  const [precision, setPrecision] = useState(EPrecision.DAY);

  const refreshCharts = () => {
    let _precision: number;

    switch (precision) {
      case EPrecision.HOUR:
        _precision = 1000 * 3600;
        break;
      case EPrecision.DAY:
        _precision = 1000 * 3600 * 24;
        break;
      case EPrecision.WEEK:
        _precision = 1000 * 3600 * 24 * 7;
        break;
      case EPrecision.MONTH:
        _precision = 1000 * 3600 * 24 * 31;
        break;
    }
    let fromDate: number;

    const toDate = new Date().getTime();

    switch (dateRange) {
      case EDateRanges.TODAY:
        fromDate = toDate - 1000 * 3600 * 24;
        break;
      case EDateRanges.PAST_WEEK:
        fromDate = toDate - 1000 * 3600 * 24 * 7;
        break;
      case EDateRanges.PAST_MONTH:
        fromDate = toDate - 1000 * 3600 * 24 * 30;
        break;
      case EDateRanges.PAST_YEAR:
        fromDate = toDate - 1000 * 3600 * 24 * 365;
        break;
      case EDateRanges.ALL:
        fromDate = 0;
        break;
    }

    const tmpData = data.reduce((prev, item) => {
      const time = new Date(item[dateField]).getTime();
      const newTime = Math.floor(time / _precision) * _precision;
      prev[newTime] = (prev[newTime] ?? 0) + 1;
      return prev;
    }, {} as Record<number, number>) as any;

    setProcessedData(
      Object.keys(tmpData)
        .map((k) => {
          return { date: parseInt(k), count: tmpData[k] };
        })
        .filter((o) => o.date >= fromDate && o.date <= toDate)
        .sort((a, b) => a.date - b.date),
    );
    setRefresh(1 - refresh);
  };

  useEffect(() => {
    refreshCharts();
  }, [data, dateRange, precision]);

  return (
    <>
      <div className="flex flex-wrap">
        <Formik
          onSubmit={() => {
            return;
          }}
          initialValues={{ dateRange, precision }}
        >
          <Form className="grow">
            <LabelledSelectComponent
              name="dateRange"
              label="Get results from"
              onChange={(e) => setDateRange(e.target.value as EDateRanges)}
            >
              {Object.keys(EDateRanges).map((range, index) => {
                return (
                  <option key={index} value={Object.values(EDateRanges)[index]}>
                    {range}
                  </option>
                );
              })}
            </LabelledSelectComponent>
            <LabelledSelectComponent
              name="precision"
              label="Group by"
              onChange={(e) => setPrecision(e.target.value as EPrecision)}
            >
              {Object.keys(EPrecision).map((range, index) => {
                return (
                  <option key={index} value={Object.values(EPrecision)[index]}>
                    {range}
                  </option>
                );
              })}
            </LabelledSelectComponent>
          </Form>
        </Formik>
        {processedData.length ? (
          <>
            <LineChart width={500} height={300} data={processedData} key={refresh} className="m-auto">
              <XAxis
                dataKey="date"
                tickFormatter={dateFormatter}
                type="number"
                domain={[processedData[0].date, processedData[processedData.length - 1].date]}
              />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </>
        ) : (
          <p>No data in this time range</p>
        )}
      </div>
    </>
  );
}
