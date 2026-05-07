import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useExplorerStore } from '../stores/explorerStore';
import { Button } from '@shared/ui/Button';
import type { Sort } from '@core/types';

export const SortControl = () => {
  const { schema, sort, setSort } = useExplorerStore();

  const handleSort = (column: string) => {
    if (!sort || sort.column !== column) {
      setSort({ column, direction: 'asc' });
    } else if (sort.direction === 'asc') {
      setSort({ column, direction: 'desc' });
    } else {
      setSort(null);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ArrowUpDown className="h-4 w-4 text-slate-500" />
      <span className="text-sm font-medium text-slate-700">Sort by:</span>
      {schema.map((col) => {
        const isActive = sort?.column === col.key;
        return (
          <Button
            key={col.key}
            size="sm"
            variant={isActive ? 'primary' : 'ghost'}
            onClick={() => handleSort(col.key)}
          >
            {col.label}
            {isActive &&
              (sort.direction === 'asc' ? (
                <ArrowUp className="ml-1 h-3 w-3" />
              ) : (
                <ArrowDown className="ml-1 h-3 w-3" />
              ))}
          </Button>
        );
      })}
      {sort && (
        <Button size="sm" variant="ghost" onClick={() => setSort(null)}>
          <X className="h-3 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};
