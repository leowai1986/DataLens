import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { parseCSV } from '@core/lib/csvParser';
import { useExplorerStore } from '../stores/explorerStore';
import type { Dataset } from '@core/types';

interface LoadResult {
  dataset: Dataset;
  duration: number;
}

export const useFileLoader = () => {
  const setDataset = useExplorerStore((s) => s.setDataset);
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<LoadResult> => {
      const start = performance.now();
      const text = await file.text();
      const { schema, rows } = parseCSV(text);

      const dataset: Dataset = {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        schema,
        rows,
        rowCount: rows.length,
        createdAt: new Date().toISOString(),
      };

      return { dataset, duration: Math.round(performance.now() - start) };
    },
    onSuccess: ({ dataset, duration }) => {
      setDataset(
        { id: dataset.id, name: dataset.name, rowCount: dataset.rowCount },
        dataset.schema
      );
      console.log(`Loaded ${dataset.rowCount} rows in ${duration}ms`);
    },
  });

  const loadFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        mutation.reset();
        return;
      }
      mutation.mutate(file);
    },
    [mutation]
  );

  return { loadFile, isLoading: mutation.isPending, error: mutation.error, progress };
};
