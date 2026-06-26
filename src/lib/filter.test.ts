/* eslint-disable import-x/no-relative-parent-imports, simple-import-sort/imports */
import type { Whisky } from '../types';

import { filterWhiskies } from './filter';
/* eslint-enable import-x/no-relative-parent-imports, simple-import-sort/imports */

const EASTERN_HIGHLANDS = 'Eastern Highlands';
const NORTHERN_HIGHLANDS = 'Northern Highlands';
const WESTERN_HIGHLANDS = 'Western Highlands';

const NOSE_A = 'Nose A';
const PALATE_A = 'Palate A';
const FINISH_A = 'Finish A';

const base: Whisky = {
  abv: 43,
  age: 12,
  distillery: 'Glentest',
  flavours: ['honey', 'fruity'],
  id: 'test-whisky-a',
  name: 'Test Whisky A',
  priceBand: 'mid',
  priceGbp: 50,
  review: 'Review A',
  score: 88,
  subRegion: NORTHERN_HIGHLANDS,
  tasting: { finish: FINISH_A, nose: NOSE_A, palate: PALATE_A },
};

const budget: Whisky = {
  abv: 40,
  age: 10,
  distillery: 'Lochanburn',
  flavours: ['malty', 'coastal'],
  id: 'test-whisky-b',
  name: 'Budget Dram',
  priceBand: 'budget',
  priceGbp: 30,
  review: 'Review B',
  score: 82,
  subRegion: NORTHERN_HIGHLANDS,
  tasting: { finish: 'Finish B', nose: 'Nose B', palate: 'Palate B' },
};

const premium: Whisky = {
  abv: 46,
  age: 18,
  distillery: 'Highland Peak',
  flavours: ['sherried', 'nutty', 'spicy'],
  id: 'test-whisky-c',
  name: 'Premium Expression',
  priceBand: 'premium',
  priceGbp: 95,
  review: 'Review C',
  score: 92,
  subRegion: EASTERN_HIGHLANDS,
  tasting: { finish: 'Finish C', nose: 'Nose C', palate: 'Palate C' },
};

const nas: Whisky = {
  abv: 48,
  age: null,
  distillery: 'Misty Glen',
  flavours: ['peaty', 'smoky', 'coastal'],
  id: 'test-whisky-nas',
  name: 'NAS Expression',
  priceBand: 'luxury',
  priceGbp: 150,
  review: 'Review D',
  score: 94,
  subRegion: WESTERN_HIGHLANDS,
  tasting: { finish: 'Finish D', nose: 'Nose D', palate: 'Palate D' },
};

const allWhiskies: Whisky[] = [base, budget, premium, nas];

describe('filterWhiskies — empty / no criteria', () => {
  it('returns all whiskies when criteria is an empty object', () => {
    expect(filterWhiskies(allWhiskies, {})).toHaveLength(4);
  });

  it('returns a new array — does not mutate the input', () => {
    const input = [...allWhiskies];
    const result = filterWhiskies(input, { priceBands: ['budget'] });

    expect(result).not.toBe(input);

    expect(input).toHaveLength(4);
  });
});

describe('filterWhiskies — search filter', () => {
  it('matches whisky by name (case-insensitive substring)', () => {
    const result = filterWhiskies(allWhiskies, { search: 'budget' });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-b');
  });

  it('matches whisky by distillery (case-insensitive)', () => {
    const result = filterWhiskies(allWhiskies, { search: 'glentest' });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-a');
  });

  it('is case-insensitive for mixed-case search terms', () => {
    const result = filterWhiskies(allWhiskies, { search: 'HIGHLAND PEAK' });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-c');
  });

  it('returns all when search term matches multiple whiskies', () => {
    const result = filterWhiskies(allWhiskies, { search: 'expression' });

    expect(result).toHaveLength(2);
  });

  it('returns empty array when search matches nothing', () => {
    const result = filterWhiskies(allWhiskies, { search: 'Zxqfoo' });

    expect(result).toHaveLength(0);
  });

  it('ignores whitespace-only search strings', () => {
    expect(filterWhiskies(allWhiskies, { search: '   ' })).toHaveLength(4);
  });

  it('ignores empty search strings', () => {
    expect(filterWhiskies(allWhiskies, { search: '' })).toHaveLength(4);
  });
});

describe('filterWhiskies — priceBand filter', () => {
  it('filters to a single price band', () => {
    const result = filterWhiskies(allWhiskies, { priceBands: ['budget'] });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-b');
  });

  it('supports multiple price bands (OR logic)', () => {
    const result = filterWhiskies(allWhiskies, { priceBands: ['budget', 'mid'] });
    const ids = result.map((w) => w.id);

    expect(result).toHaveLength(2);

    expect(ids).toContain('test-whisky-a');

    expect(ids).toContain('test-whisky-b');
  });

  it('returns empty array when no whisky matches the band', () => {
    const result = filterWhiskies([base, budget], { priceBands: ['luxury'] });

    expect(result).toHaveLength(0);
  });

  it('returns all when priceBands is empty array', () => {
    expect(filterWhiskies(allWhiskies, { priceBands: [] })).toHaveLength(4);
  });
});

describe('filterWhiskies — flavour filter', () => {
  it('returns whiskies that have ANY of the selected flavours', () => {
    const result = filterWhiskies(allWhiskies, { flavours: ['honey'] });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-a');
  });

  it('matches a whisky with at least one of several selected flavours', () => {
    const result = filterWhiskies(allWhiskies, { flavours: ['peaty', 'malty'] });
    const ids = result.map((w) => w.id);

    expect(result).toHaveLength(2);

    expect(ids).toContain('test-whisky-b');

    expect(ids).toContain('test-whisky-nas');
  });

  it('excludes whiskies with none of the selected flavours', () => {
    const result = filterWhiskies(allWhiskies, { flavours: ['floral'] });

    expect(result).toHaveLength(0);
  });

  it('returns all when flavours is empty array', () => {
    expect(filterWhiskies(allWhiskies, { flavours: [] })).toHaveLength(4);
  });
});

describe('filterWhiskies — minScore filter', () => {
  it('returns only whiskies at or above the minimum score', () => {
    const result = filterWhiskies(allWhiskies, { minScore: 90 });

    for (const w of result) {
      expect(w.score).toBeGreaterThanOrEqual(90);
    }

    expect(result).toHaveLength(2);
  });

  it('includes whiskies with score exactly equal to minScore', () => {
    const result = filterWhiskies(allWhiskies, { minScore: 88 });
    const ids = result.map((w) => w.id);

    expect(ids).toContain('test-whisky-a');
  });

  it('returns empty when minScore exceeds all scores', () => {
    expect(filterWhiskies(allWhiskies, { minScore: 99 })).toHaveLength(0);
  });
});

describe('filterWhiskies — combined criteria', () => {
  it('applies all filter criteria simultaneously', () => {
    const result = filterWhiskies(allWhiskies, {
      flavours: ['spicy', 'nutty'],
      minScore: 90,
      priceBands: ['premium'],
      search: 'premium',
    });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-c');
  });

  it('returns empty when combined criteria eliminates all matches', () => {
    const result = filterWhiskies(allWhiskies, {
      minScore: 95,
      priceBands: ['budget'],
    });

    expect(result).toHaveLength(0);
  });

  it('handles search + flavour together', () => {
    const result = filterWhiskies(allWhiskies, {
      flavours: ['honey'],
      search: 'Glentest',
    });

    expect(result).toHaveLength(1);

    expect(result[0]?.id).toBe('test-whisky-a');
  });
});
