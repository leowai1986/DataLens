import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useExplorerStore } from '../stores/explorerStore';
import { aggregateForChart } from '../utils/chartAggregations';
import { Select } from '@shared/ui/Select';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';
import { BarChart3, X } from 'lucide-react';
import type { ChartConfig, DataRow, ColumnSchema } from '@core/types';

interface Props {
  rows: DataRow[];
  schema: ColumnSchema[];
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#db2777', '#0891b2'];

export const ChartPanel = ({ rows, schema }: Props) => {
  const [open, setOpen] = useState(false);
  const { chartConfig, setChartConfig } = useExplorerStore();
  const [localConfig, setLocalConfig] = useState<ChartConfig>({
    type: 'bar',
    xAxis: schema[0]?.key ?? '',
    yAxis: schema[1]?.key ?? '',
    aggregation: 'sum',
  });

  const numericColumns = schema.filter((c) => c.type === 'number');
  const allColumns = schema;

  const chartData = useMemo(() => {
    if (!chartConfig) return [];
    return aggregateForChart(rows, chartConfig);
  }, [rows, chartConfig]);

  const renderChart = () => {
    if (!chartConfig || chartData.length === 0) return null;

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[0]} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <BarChart3 className="h-4 w-4 mr-1.5" />
        Charts
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Chart Builder" className="max-w-4xl">
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <Select
              label="Chart Type"
              value={localConfig.type}
              onChange={(v) => setLocalConfig((c) => ({ ...c, type: v as ChartConfig['type'] }))}
              options={[
                { value: 'bar', label: 'Bar' },
                { value: 'line', label: 'Line' },
                { value: 'area', label: 'Area' },
                { value: 'pie', label: 'Pie' },
              ]}
            />
            <Select
              label="X Axis"
              value={localConfig.xAxis}
              onChange={(v) => setLocalConfig((c) => ({ ...c, xAxis: v }))}
              options={allColumns.map((c) => ({ value: c.key, label: c.label }))}
            />
            <Select
              label="Y Axis"
              value={localConfig.yAxis}
              onChange={(v) => setLocalConfig((c) => ({ ...c, yAxis: v }))}
              options={numericColumns.map((c) => ({ value: c.key, label: c.label }))}
            />
            <Select
              label="Aggregation"
              value={localConfig.aggregation}
              onChange={(v) => setLocalConfig((c) => ({ ...c, aggregation: v as ChartConfig['aggregation'] }))}
              options={[
                { value: 'sum', label: 'Sum' },
                { value: 'avg', label: 'Average' },
                { value: 'count', label: 'Count' },
                { value: 'min', label: 'Minimum' },
                { value: 'max', label: 'Maximum' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setChartConfig(null)}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button onClick={() => { setChartConfig(localConfig); }}>
              Generate Chart
            </Button>
          </div>

          {chartConfig && (
            <div className="rounded-xl border bg-white p-4">
              {renderChart()}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
