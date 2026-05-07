import type { DataRow, ColumnSchema, ChartConfig } from '@core/types';
import { groupBy } from '@core/lib/fp';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export const aggregateForChart = (
  rows: DataRow[],
  config: ChartConfig,
  schema: ColumnSchema[]
): ChartDataPoint[] => {

  if (config.groupBy) {
    const grouped = groupBy(rows, (r) => String(r[config.xAxis] ?? 'Unknown'));
    return Object.entries(grouped).map(([name, groupRows]) => {
      const subGroups = groupBy(groupRows, (r) => String(r[config.groupBy!] ?? 'Unknown'));
      const point: ChartDataPoint = { name, value: 0 };
      Object.entries(subGroups).forEach(([subName, subRows]) => {
        point[subName] = calculateAggregation(subRows, config.yAxis, config.aggregation);
      });
      return point;
    });
  }

  const grouped = groupBy(rows, (r) => String(r[config.xAxis] ?? 'Unknown'));
  return Object.entries(grouped).map(([name, groupRows]) => ({
    name,
    value: calculateAggregation(groupRows, config.yAxis, config.aggregation),
  }));
};

const calculateAggregation = (
  rows: DataRow[],
  column: string,
  agg: ChartConfig['aggregation']
): number => {
  const values = rows.map((r) => Number(r[column])).filter((v) => !isNaN(v));
  if (values.length === 0) return 0;

  switch (agg) {
    case 'sum': return values.reduce((a, b) => a + b, 0);
    case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
    case 'count': return values.length;
    case 'min': return Math.min(...values);
    case 'max': return Math.max(...values);
    default: return 0;
  }
};
