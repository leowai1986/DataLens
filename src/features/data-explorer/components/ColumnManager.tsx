import { useState } from 'react';
import { useExplorerStore } from '../stores/explorerStore';
import { Settings2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';

export const ColumnManager = () => {
  const [open, setOpen] = useState(false);
  const { schema, columnVisibility, toggleColumnVisibility } = useExplorerStore();
  const visibleCount = Object.values(columnVisibility).filter(Boolean).length;

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Settings2 className="h-4 w-4 mr-1.5" />
        Columns ({visibleCount}/{schema.length})
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Manage Columns">
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {schema.map((col) => {
            const isVisible = columnVisibility[col.key];
            return (
              <button
                key={col.key}
                onClick={() => toggleColumnVisibility(col.key)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{col.label}</p>
                  <p className="text-xs text-slate-500 uppercase">{col.type}</p>
                </div>
                {isVisible ? (
                  <Eye className="h-4 w-4 text-blue-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
