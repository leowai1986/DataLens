import type { DataRow, ColumnSchema } from '@core/types';

export const exportToCSV = (rows: DataRow[], schema: ColumnSchema[], filename: string) => {
  const headers = schema.map((c) => c.key).join(',');
  const lines = rows.map((row) =>
    schema.map((c) => {
      const val = row[c.key];
      if (val == null) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(',')
  );
  const csv = [headers, ...lines].join('\n');
  downloadBlob(csv, `${filename}.csv`, 'text/csv');
};

export const exportToJSON = (rows: DataRow[], filename: string) => {
  const json = JSON.stringify(rows, null, 2);
  downloadBlob(json, `${filename}.json`, 'application/json');
};

const downloadBlob = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
