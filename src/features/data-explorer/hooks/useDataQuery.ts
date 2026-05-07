import { useQuery } from '@tanstack/react-query';
import { useExplorerStore } from '../stores/explorerStore';
import type { DataRow } from '@core/types';
import { applyFilters, applySort } from '../utils/dataTransforms';
import { MAX_ROWS_CLIENT_PROCESSING } from '@core/config/constants';

const QUERY_KEY = 'dataset-explorer';

export const useDataQuery = (allRows: DataRow[]) => {
  const { filters, sort } = useExplorerStore();
  const shouldUseWorker = allRows.length > MAX_ROWS_CLIENT_PROCESSING;

  return useQuery({
    queryKey: [QUERY_KEY, 'processed', filters, sort, allRows.length],
    queryFn: async () => {
      if (shouldUseWorker) {
        const worker = new Worker(new URL('../workers/dataProcessor.worker.ts', import.meta.url), {
          type: 'module',
        });
        return new Promise<DataRow[]>((resolve, reject) => {
          const timeout = setTimeout(() => {
            worker.terminate();
            reject(new Error('Worker timeout'));
          }, 30000);

          worker.onmessage = (e) => {
            clearTimeout(timeout);
            worker.terminate();
            resolve((e.data as { payload: { rows: DataRow[] } }).payload.rows);
          };

          worker.postMessage({
            type: 'PROCESS',
            payload: { rows: allRows, filters, sort },
          });
        });
      }

      let data = [...allRows];
      if (filters.length > 0) data = applyFilters(data, filters);
      if (sort) data = applySort(data, sort);
      return data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
    enabled: allRows.length > 0,
  });
};
