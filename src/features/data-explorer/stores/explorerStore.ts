import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Filter, Sort, ColumnSchema, ChartConfig } from '@core/types';

interface ExplorerState {
  dataset: { id: string; name: string; rowCount: number } | null;
  schema: ColumnSchema[];
  filters: Filter[];
  sort: Sort | null;
  selectedRows: Set<string>;
  columnVisibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  chartConfig: ChartConfig | null;
  isLoading: boolean;
  error: string | null;

  setDataset: (dataset: ExplorerState['dataset'], schema: ColumnSchema[]) => void;
  addFilter: (filter: Filter) => void;
  removeFilter: (id: string) => void;
  updateFilter: (id: string, patch: Partial<Filter>) => void;
  setSort: (sort: Sort | null) => void;
  toggleRowSelection: (id: string) => void;
  selectAllRows: (ids: string[], selected: boolean) => void;
  toggleColumnVisibility: (key: string) => void;
  setColumnWidth: (key: string, width: number) => void;
  setChartConfig: (config: ChartConfig | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initialState = {
  dataset: null,
  schema: [],
  filters: [],
  sort: null,
  selectedRows: new Set<string>(),
  columnVisibility: {},
  columnWidths: {},
  chartConfig: null,
  isLoading: false,
  error: null,
};

export const useExplorerStore = create<ExplorerState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setDataset: (dataset, schema) =>
          set({
            dataset,
            schema,
            columnVisibility: Object.fromEntries(schema.map((c) => [c.key, true])),
            columnWidths: Object.fromEntries(schema.map((c) => [c.key, 200])),
            filters: [],
            sort: null,
            selectedRows: new Set(),
          }),
        addFilter: (filter) => set((s) => ({ filters: [...s.filters, filter] })),
        removeFilter: (id) => set((s) => ({ filters: s.filters.filter((f) => f.id !== id) })),
        updateFilter: (id, patch) =>
          set((s) => ({
            filters: s.filters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
          })),
        setSort: (sort) => set({ sort }),
        toggleRowSelection: (id) =>
          set((s) => {
            const next = new Set(s.selectedRows);
            next.has(id) ? next.delete(id) : next.add(id);
            return { selectedRows: next };
          }),
        selectAllRows: (ids, selected) =>
          set((s) => {
            const next = new Set(s.selectedRows);
            ids.forEach((id) => (selected ? next.add(id) : next.delete(id)));
            return { selectedRows: next };
          }),
        toggleColumnVisibility: (key) =>
          set((s) => ({
            columnVisibility: { ...s.columnVisibility, [key]: !s.columnVisibility[key] },
          })),
        setColumnWidth: (key, width) =>
          set((s) => ({ columnWidths: { ...s.columnWidths, [key]: Math.max(80, width) } })),
        setChartConfig: (config) => set({ chartConfig: config }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        reset: () => set(initialState),
      }),
      {
        name: 'datalens-explorer',
        partialize: (state) => ({
          columnVisibility: state.columnVisibility,
          columnWidths: state.columnWidths,
        }),
      }
    ),
    { name: 'ExplorerStore' }
  )
);
