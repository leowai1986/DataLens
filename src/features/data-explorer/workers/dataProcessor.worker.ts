import type { WorkerMessage, WorkerResponse, DataRow } from '@core/types';
import { applyFilters, applySort } from '../utils/dataTransforms';

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data as WorkerMessage;
  if (msg.type !== 'PROCESS') return;

  const start = performance.now();
  const { rows, filters, sort } = e.data.payload;

  let result: DataRow[] = [...rows];
  if (filters.length > 0) result = applyFilters(result, filters);
  if (sort) result = applySort(result, sort);

  const response: WorkerResponse = {
    type: 'RESULT',
    payload: {
      rows: result,
      total: result.length,
      duration: Math.round(performance.now() - start),
    },
  };

  self.postMessage(response);
};

export {};
