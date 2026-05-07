import { FileJson, FileSpreadsheet } from 'lucide-react';
import { useExplorerStore } from '../stores/explorerStore';
import { exportToCSV, exportToJSON } from '../utils/exportData';
import { Button } from '@shared/ui/Button';
import { useDataQuery } from '../hooks/useDataQuery';
import type { DataRow } from '@core/types';

interface Props {
  allRows: DataRow[];
}

export const ExportToolbar = ({ allRows }: Props) => {
  const { data: filteredRows } = useDataQuery(allRows);
  const { dataset, schema, filters } = useExplorerStore();

  if (!dataset || !filteredRows) return null;

  const filename = `${dataset.name}${filters.length > 0 ? '_filtered' : ''}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">
        {filteredRows.length.toLocaleString()} of {dataset.rowCount.toLocaleString()} rows
      </span>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => exportToCSV(filteredRows, schema, filename)}
      >
        <FileSpreadsheet className="h-4 w-4 mr-1.5" />
        CSV
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => exportToJSON(filteredRows, filename)}
      >
        <FileJson className="h-4 w-4 mr-1.5" />
        JSON
      </Button>
    </div>
  );
};
