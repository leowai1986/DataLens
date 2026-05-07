import { useState } from 'react';
import { useExplorerStore } from '../stores/explorerStore';
import { Plus, X, Filter as FilterIcon } from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Select } from '@shared/ui/Select';
import { Badge } from '@shared/ui/Badge';
import { generateId } from '@core/lib/id';
import type { Filter as FilterType } from '@core/types';  // ← Renombrado

export const FilterBar = () => {
  const { schema, filters, addFilter, removeFilter } = useExplorerStore();
  const [isAdding, setIsAdding] = useState(false);
  const [column, setColumn] = useState('');
  const [operator, setOperator] = useState<FilterType['operator']>('eq');  // ← Usar FilterType
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!column || value === '') return;
    addFilter({
      id: generateId(),
      column,
      operator,
      value: isNaN(Number(value)) ? value : Number(value),
    } as FilterType);
    setColumn('');
    setValue('');
    setIsAdding(false);
  };

  const operatorOptions = [
    { value: 'eq', label: 'equals' },
    { value: 'neq', label: 'not equals' },
    { value: 'gt', label: 'greater than' },
    { value: 'gte', label: 'greater or equal' },
    { value: 'lt', label: 'less than' },
    { value: 'lte', label: 'less or equal' },
    { value: 'contains', label: 'contains' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filters</span>
          {filters.length > 0 && <Badge>{filters.length}</Badge>}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Filter
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 items-end rounded-lg border bg-slate-50 p-3 animate-fade-in">
          <Select
            label="Column"
            value={column}
            onChange={setColumn}
            options={schema.map((c) => ({ value: c.key, label: c.label }))}
            placeholder="Select column"
          />
          <Select
            label="Operator"
            value={operator}
            onChange={(v) => setOperator(v as FilterType['operator'])}
            options={operatorOptions}
          />
          <Input
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}>Apply</Button>
        </div>
      )}

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Badge key={f.id} variant="default">
              <span className="font-medium">{f.column}</span>
              <span className="mx-1 opacity-75">{f.operator}</span>
              <span>{String(f.value)}</span>
              <button
                onClick={() => removeFilter(f.id)}
                className="ml-2 hover:text-red-600"
                aria-label="Remove filter"
              >
                <X className="h-3 w-3 inline" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
