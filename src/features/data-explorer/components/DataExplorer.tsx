import { useState } from 'react';
import { useExplorerStore } from '../stores/explorerStore';
import { useFileLoader } from '../hooks/useFileLoader';
import { useDataQuery } from '../hooks/useDataQuery';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { FileDropZone } from './FileDropZone';
import { VirtualDataGrid } from './VirtualDataGrid';
import { FilterBar } from './FilterBar';
import { SortControl } from './SortControl';
import { ColumnManager } from './ColumnManager';
import { ExportToolbar } from './ExportToolbar';
import { ChartPanel } from './ChartPanel';
import { WorkerStatus } from './WorkerStatus';
import { Button } from '@shared/ui/Button';
import { Spinner } from '@shared/ui/Spinner';
import { Database, Trash2 } from 'lucide-react';

export const DataExplorer = () => {
  const { dataset, schema, reset } = useExplorerStore();
  const { loadFile, isLoading } = useFileLoader();
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);

  const { data: processedRows, isFetching } = useDataQuery(rawRows as never);

  useKeyboardShortcuts({
    'Ctrl+O': () => document.getElementById('file-input')?.click(),
    'Ctrl+R': () => reset(),
  });

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line, idx) => {
        const values = line.split(',');
        const obj: Record<string, unknown> = { id: `row-${idx}` };
        headers.forEach((h, i) => {
          obj[h] = values[i]?.trim() ?? null;
        });
        return obj;
      });
      setRawRows(rows);
      loadFile(file);
    };
    reader.readAsText(file);
  };

  if (!dataset) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Welcome to DataLens</h2>
          <p className="text-slate-500">Load a CSV file to start exploring your data</p>
        </div>
        <FileDropZone onFileSelect={handleFile} isLoading={isLoading} />
        {isLoading && (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{dataset.name}</h2>
            <p className="text-sm text-slate-500">{dataset.rowCount.toLocaleString()} rows</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WorkerStatus />
          <ChartPanel rows={processedRows ?? []} schema={schema} />
          <ColumnManager />
          <ExportToolbar allRows={rawRows as never} />
          <Button variant="ghost" size="sm" onClick={reset}>
            <Trash2 className="h-4 w-4 mr-1.5 text-red-500" />
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <FilterBar />
        <SortControl />
      </div>

      {isFetching && (
        <div className="flex items-center justify-center py-4">
          <Spinner />
          <span className="ml-2 text-sm text-slate-500">Applying filters...</span>
        </div>
      )}

      {processedRows && <VirtualDataGrid rows={processedRows} schema={schema} />}
    </div>
  );
};
