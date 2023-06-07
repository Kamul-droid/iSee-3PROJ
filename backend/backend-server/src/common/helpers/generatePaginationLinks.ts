import { env } from 'src/env';
import { TimestampedPaginationRequestDto } from '../dtos/timestamped-pagination-request.dto';
import buildQueryParams from './buildQueryParams';
import { Request } from 'express';

export default function generatePaginationLinks(
  query: TimestampedPaginationRequestDto & Record<string, any>,
  count: number,
  request: Request,
) {
  const { pageIdx, pageSize, from } = query;

  const url = request.url.split('?')[0];

  console.log(url);

  const nextParams = buildQueryParams({
    ...query,
    from: from.toISOString(),
    pageIdx: query.pageIdx + 1,
  });
  const prevParams = buildQueryParams({
    ...query,
    from: from.toISOString(),
    pageIdx: query.pageIdx - 1,
  });

  const next = pageIdx * pageSize < count ? `${url}${nextParams}` : null;
  const prev = pageIdx > 1 ? `${url}${prevParams}` : null;

  return { prev, next };
}
