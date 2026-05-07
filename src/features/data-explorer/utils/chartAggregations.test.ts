import { describe, it, expect } from 'vitest';
import { aggregateForChart } from './chartAggregations';
import type { DataRow, ColumnSchema, ChartConfig } from '@core/types';

describe('aggregateForChart', () => {
  const schema: ColumnSchema[] = [
    { key: 'category', type: 'string', label: 'Category', nullable: false },
    { key: 'sales', type: 'number', label: 'Sales', nullable: false },
    { key: 'region', type: 'string', label: 'Region', nullable: false },
  ];

  const rows: DataRow[] = [
    { id: '1', category: 'A', sales: 100, region: 'North' },
    { id: '2', category: 'A', sales: 200, region: 'South' },
    { id: '3', category: 'B', sales: 150, region: 'North' },
    { id: '4', category: 'B', sales: 50, region: 'South' },
  ];

  it('sums values by category', () => {
    const config: ChartConfig = { type: 'bar', xAxis: 'category', yAxis: 'sales', aggregation: 'sum' };
    const result = aggregateForChart(rows, config);
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.name === 'A')?.value).toBe(300);
    expect(result.find((r) => r.name === 'B')?.value).toBe(200);
  });

  it('counts values', () => {
    const config: ChartConfig = { type: 'bar', xAxis: 'category', yAxis: 'sales', aggregation: 'count' };
    const result = aggregateForChart(rows, config);
    expect(result.find((r) => r.name === 'A')?.value).toBe(2);
  });

  it('groups by secondary field', () => {
    const config: ChartConfig = {
      type: 'bar',
      xAxis: 'category',
      yAxis: 'sales',
      aggregation: 'sum',
      groupBy: 'region',
    };
    const result = aggregateForChart(rows, config);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('North');
    expect(result[0]).toHaveProperty('South');
  });
});
