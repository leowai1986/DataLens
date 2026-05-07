import type { DataRow, ColumnSchema, Primitive } from '../types';

const inferType = (values: Primitive[]): ColumnSchema['type'] => {
  const nonNull = values.filter((v): v is string | number | boolean => v !== null);
  if (nonNull.length === 0) return 'string';

  const allBool = nonNull.every((v) => typeof v === 'boolean' || ['true', 'false', 'yes', 'no', '1', '0'].includes(String(v).toLowerCase()));
  if (allBool) return 'boolean';

  const allNum = nonNull.every((v) => !isNaN(Number(v)) && v !== '');
  if (allNum) return 'number';

  const allDate = nonNull.every((v) => !isNaN(Date.parse(String(v))));
  if (allDate) return 'date';

  return 'string';
};

const coerceValue = (value: string, type: ColumnSchema['type']): Primitive => {
  if (value === '' || value === 'null' || value === 'undefined') return null;
  switch (type) {
    case 'number': return Number(value);
    case 'boolean': return ['true', 'yes', '1'].includes(value.toLowerCase());
    case 'date': return new Date(value).toISOString();
    default: return value;
  }
};

export const parseCSV = (content: string): { schema: ColumnSchema[]; rows: DataRow[] } => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have header and at least one row');

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const rawRows = lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values.map((v) => v.replace(/^["']|["']$/g, ''));
  });

  const columns = headers.map((header, idx) => {
    const sampleValues = rawRows.slice(0, 100).map((row) => row[idx]).filter((v): v is string => !!v);
    const type = inferType(sampleValues as Primitive[]);
    return {
      key: header,
      label: header,
      type,
      nullable: rawRows.some((row) => !row[idx] || row[idx] === ''),
    };
  });

  const rows: DataRow[] = rawRows.map((row, idx) => {
    const obj: DataRow = { id: `row-${idx}` };
    columns.forEach((col, idx) => {
      obj[col.key] = coerceValue(row[idx] ?? '', col.type);
    });
    return obj;
  });

  return { schema: columns, rows };
};
