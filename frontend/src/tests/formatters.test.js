import { describe, expect, it } from 'vitest';
import { formatDate, shortenText } from '../utils/formatters.js';

describe('formatters', () => {
  it('shortens long text', () => {
    expect(shortenText('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefg...');
  });

  it('keeps short text unchanged', () => {
    expect(shortenText('short', 10)).toBe('short');
  });

  it('formats valid dates', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).not.toBe('-');
  });

  it('returns dash for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('-');
  });
});