export type Primitive = string | number | boolean | null;

export interface DataRow {
  id: string;
  [key: string]: Primitive;
}

export type ColumnType = 'string' | 'number' | 'boolean' | 'date';

export interface ColumnSchema {
  key: string;
  type: ColumnType;
  label: string;
  nullable: boolean;
}

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

export interface Filter {
  id: string;
  column: string;
  operator: FilterOperator;
  value: Primitive;
}

export type SortDirection = 'asc' | 'desc';

export interface Sort {
  column: string;
  direction: SortDirection;
}

export interface Dataset {
  id: string;
  name: string;
  schema: ColumnSchema[];
  rows: DataRow[];
  rowCount: number;
  createdAt: string;
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter';

export interface ChartConfig {
  type: ChartType;
  xAxis: string;
  yAxis: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  groupBy?: string;
}

export interface WorkerMessage {
  type: 'PROCESS';
  payload: {
    rows: DataRow[];
    filters: Filter[];
    sort: Sort | null;
  };
}

export interface WorkerResponse {
  type: 'RESULT';
  payload: {
    rows: DataRow[];
    total: number;
    duration: number;
  };
}
