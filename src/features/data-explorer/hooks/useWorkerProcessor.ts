import { useRef, useCallback, useState } from 'react';
import type { DataRow, Filter, Sort, WorkerResponse } from '@core/types';

export const useWorkerProcessor = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDuration, setLastDuration] = useState(0);

  const process = useCallback(
    (rows: DataRow[], filters: Filter[], sort: Sort | null): Promise<DataRow[]> => {
      return new Promise((resolve, reject) => {
        if (workerRef.current) workerRef.current.terminate();

        const worker = new Worker(
          new URL('../workers/dataProcessor.worker.ts', import.meta.url),
          { type: 'module' }
        );
        workerRef.current = worker;
        setIsProcessing(true);

        const timeout = setTimeout(() => {
          worker.terminate();
          setIsProcessing(false);
          reject(new Error('Worker processing timeout'));
        }, 30000);

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
          clearTimeout(timeout);
          setIsProcessing(false);
          setLastDuration(e.data.payload.duration);
          resolve(e.data.payload.rows);
          worker.terminate();
          workerRef.current = null;
        };

        worker.onerror = (err) => {
          clearTimeout(timeout);
          setIsProcessing(false);
          reject(err);
        };

        worker.postMessage({
          type: 'PROCESS',
          payload: { rows, filters, sort },
        });
      });
    },
    []
  );

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsProcessing(false);
    }
  }, []);

  return { process, terminate, isProcessing, lastDuration };
};
