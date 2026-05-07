import type { Dataset, Filter, Sort, ChartConfig } from '@core/types';

export interface LoadDatasetRequest {
  source: 'csv' | 'json';
  content: string;
  name: string;
}

export interface QueryRequest {
  datasetId: string;
  filters: Filter[];
  sort: Sort | null;
}

export interface QueryResponse {
  rows: Dataset['rows'];
  total: number;
  schema: Dataset['schema'];
}

export interface ExportRequest {
  format: 'csv' | 'json';
  datasetId: string;
  filters: Filter[];
  sort: Sort | null;
}

export interface ChartDataRequest {
  config: ChartConfig;
  datasetId: string;
  filters: Filter[];
}
