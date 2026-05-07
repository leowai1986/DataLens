import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useExplorerStore } from '../stores/explorerStore';
import type { DataRow, ColumnSchema } from '@core/types';
import { cn } from '@shared/utils/cn';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  rows: DataRow[];
  schema: ColumnSchema[];
}

export const VirtualDataGrid = ({ rows, schema }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    columnVisibility,
    columnWidths,
    setColumnWidth,
    selectedRows,
    toggleRowSelection,
    selectAllRows,
    sort,
    setSort,
  } = useExplorerStore();

  const visibleColumns = schema.filter((c) => columnVisibility[c.key]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 15,
  });

  const allSelected = rows.length > 0 && rows.every((r) => selectedRows.has(r.id));
  const someSelected = rows.some((r) => selectedRows.has(r.id)) && !allSelected;

  const handleResizeStart = useCallback((colKey: string) => {
    const handleMove = (e: MouseEvent) => {
      setColumnWidth(colKey, e.clientX);
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [setColumnWidth]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <div className="flex items-center justify-center border-r border-slate-200 bg-slate-100 w-10 flex-shrink-0">
            <input
              type="checkbox"
              aria-label="Select all rows"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected;
              }}
              onChange={(e) => selectAllRows(rows.map((r) => r.id), e.target.checked)}
            />
          </div>
          {visibleColumns.map((col) => (
            <div
              key={col.key}
              className="relative flex items-center px-3 py-2.5 border-r border-slate-200 bg-slate-100 flex-shrink-0 select-none group"
              style={{ width: columnWidths[col.key] ?? 200 }}
            >
              <button
                className="flex items-center gap-1 flex-1 text-left"
                onClick={() => {
                  if (sort?.column === col.key) {
                    setSort(sort.direction === 'asc' ? { column: col.key, direction: 'desc' } : null);
                  } else {
                    setSort({ column: col.key, direction: 'asc' });
                  }
                }}
              >
                {col.label}
                {sort?.column === col.key && (
                  <ArrowUpDown className={cn('h-3 w-3', sort.direction === 'desc' && 'rotate-180')} />
                )}
              </button>
              <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                onMouseDown={() => handleResizeStart(col.key)}
              />
            </div>
          ))}
        </div>

        {/* Virtual Rows */}
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index];
          const isSelected = selectedRows.has(row.id);

          return (
            <div
              key={row.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className={cn(
                'flex absolute left-0 w-full border-b border-slate-100 transition-colors',
                isSelected ? 'bg-blue-50' : 'hover:bg-slate-50',
                virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              )}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <div className="w-10 flex items-center justify-center border-r border-slate-100 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRowSelection(row.id)}
                  aria-label={`Select row ${virtualRow.index + 1}`}
                />
              </div>
              {visibleColumns.map((col) => (
                <div
                  key={col.key}
                  className="px-3 py-2 text-sm text-slate-700 truncate border-r border-slate-100 flex-shrink-0"
                  style={{ width: columnWidths[col.key] ?? 200 }}
                  title={String(row[col.key] ?? '')}
                >
                  {row[col.key] != null ? String(row[col.key]) : (
                    <span className="text-slate-300 italic">null</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
