import { http, HttpResponse } from 'msw';
import type { LoadDatasetRequest, QueryRequest } from './types';
import { parseCSV } from '@core/lib/csvParser';
import { applyFilters, applySort } from '../utils/dataTransforms';
import type { Dataset } from '@core/types';

let mockDataset: Dataset | null = null;

export const handlers = [
  http.post('/api/datasets/load', async ({ request }) => {
    const body = (await request.json()) as LoadDatasetRequest;

    if (body.source === 'csv') {
      const { schema, rows } = parseCSV(body.content);
      mockDataset = {
        id: 'ds-1',
        name: body.name,
        schema,
        rows,
        rowCount: rows.length,
        createdAt: new Date().toISOString(),
      };
    }

    return HttpResponse.json(mockDataset);
  }),

  http.post('/api/datasets/query', async ({ request }) => {
    if (!mockDataset) return new HttpResponse(null, { status: 404 });

    const body = (await request.json()) as QueryRequest;
    let data = [...mockDataset.rows];

    if (body.filters.length > 0) data = applyFilters(data, body.filters);
    if (body.sort) data = applySort(data, body.sort);

    return HttpResponse.json({
      rows: data,
      total: data.length,
      schema: mockDataset.schema,
    });
  }),
];
