import { describe, it, expect } from 'vitest';
import { applyFilters, applySort } from './dataTransforms';
import type { DataRow, Filter, Sort } from '@core/types';

describe('applyFilters', () => {
  const rows: DataRow[] = [
    { id: '1', name: 'Alice', age: 30, active: true },
    { id: '2', name: 'Bob', age: 25, active: false },
    { id: '3', name: 'Charlie', age: 35, active: true },
    { id: '4', name: 'Diana', age: 28, active: null },
  ];

  it('filters by equality', () => {
    const filters: Filter[] = [{ id: '1', column: 'age', operator: 'eq', value: 30 }];
    expect(applyFilters(rows, filters)).toHaveLength(1);
    expect(applyFilters(rows, filters)[0].name).toBe('Alice');
  });

  it('filters by contains (case insensitive)', () => {
    const filters: Filter[] = [{ id: '1', column: 'name', operator: 'contains', value: 'LI' }];
    expect(applyFilters(rows, filters)).toHaveLength(2);
  });

  it('filters by greater than', () => {
    const filters: Filter[] = [{ id: '1', column: 'age', operator: 'gt', value: 28 }];
    expect(applyFilters(rows, filters)).toHaveLength(2);
  });

  it('chains multiple filters with AND logic', () => {
    const filters: Filter[] = [
      { id: '1', column: 'age', operator: 'gte', value: 25 },
      { id: '2', column: 'active', operator: 'eq', value: true },
    ];
    expect(applyFilters(rows, filters)).toHaveLength(2);
  });

  it('handles null values correctly', () => {
    const filters: Filter[] = [{ id: '1', column: 'active', operator: 'eq', value: null }];
    expect(applyFilters(rows, filters)).toHaveLength(1);
    expect(applyFilters(rows, filters)[0].name).toBe('Diana');
  });
});

describe('applySort', () => {
  const rows: DataRow[] = [
    { id: '1', value: 3, name: 'C' },
    { id: '2', value: 1, name: 'A' },
    { id: '3', value: 2, name: 'B' },
  ];

  it('sorts numbers ascending', () => {
    const result = applySort(rows, { column: 'value', direction: 'asc' });
    expect(result.map((r) => r.value)).toEqual([1, 2, 3]);
  });

  it('sorts numbers descending', () => {
    const result = applySort(rows, { column: 'value', direction: 'desc' });
    expect(result.map((r) => r.value)).toEqual([3, 2, 1]);
  });

  it('sorts strings alphabetically', () => {
    const result = applySort(rows, { column: 'name', direction: 'asc' });
    expect(result.map((r) => r.name)).toEqual(['A', 'B', 'C']);
  });

  it('places nulls at the end when ascending', () => {
    const withNull: DataRow[] = [
      { id: '1', value: 2 },
      { id: '2', value: null },
      { id: '3', value: 1 },
    ];
    const result = applySort(withNull, { column: 'value', direction: 'asc' });
    expect(result.map((r) => r.value)).toEqual([1, 2, null]);
  });
});
