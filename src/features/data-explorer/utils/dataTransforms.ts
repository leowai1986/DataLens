import type { DataRow, Filter, Sort, Primitive } from '@core/types';

const operators: Record<Filter['operator'], (a: Primitive, b: Primitive) => boolean> = {
  eq: (a, b) => a === b,
  neq: (a, b) => a !== b,
  gt: (a, b) => Number(a) > Number(b),
  gte: (a, b) => Number(a) >= Number(b),
  lt: (a, b) => Number(a) < Number(b),
  lte: (a, b) => Number(a) <= Number(b),
  contains: (a, b) => String(a).toLowerCase().includes(String(b).toLowerCase()),
  startsWith: (a, b) => String(a).toLowerCase().startsWith(String(b).toLowerCase()),
  endsWith: (a, b) => String(a).toLowerCase().endsWith(String(b).toLowerCase()),
};

export const applyFilters = (rows: DataRow[], filters: Filter[]): DataRow[] =>
  rows.filter((row) => filters.every((f) => operators[f.operator](row[f.column], f.value)));

export const applySort = (rows: DataRow[], sort: Sort): DataRow[] => {
  const dir = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[sort.column];
    const bv = b[sort.column];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
};
