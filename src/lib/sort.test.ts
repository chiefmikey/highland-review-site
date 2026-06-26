/* eslint-disable import-x/no-relative-parent-imports, simple-import-sort/imports */
import type { Whisky } from '../types';

import { sortWhiskies } from './sort';
/* eslint-enable import-x/no-relative-parent-imports, simple-import-sort/imports */

const makeWhisky = (overrides: Partial<Whisky> & Pick<Whisky, 'id' | 'name'>): Whisky => ({
  abv: 43,
  age: 12,
  distillery: 'Test Distillery',
  flavours: ['malty'],
  priceBand: 'mid',
  priceGbp: 50,
  review: 'R',
  score: 85,
  subRegion: 'Northern Highlands',
  tasting: { finish: 'F', nose: 'N', palate: 'P' },
  ...overrides,
});

const whiskyA = makeWhisky({ age: 12, id: 'a', name: 'Aberfeldy 12', priceGbp: 42, score: 92 });
const whiskyB = makeWhisky({ age: 10, id: 'b', name: 'Balmenach 10', priceGbp: 28, score: 85 });
const whiskyC = makeWhisky({ age: 14, id: 'c', name: 'Clynelish 14', priceGbp: 55, score: 88 });
const whiskyNas = makeWhisky({ age: null, id: 'd', name: 'Dalmore NAS', priceGbp: 80, score: 90 });
const whiskyNas2 = makeWhisky({ age: null, id: 'e', name: 'Edradour NAS', priceGbp: 65, score: 87 });

const list = [whiskyA, whiskyB, whiskyC, whiskyNas, whiskyNas2];

describe('sortWhiskies', () => {
  describe('immutability', () => {
    it('returns a new array without mutating the input', () => {
      const input = [...list];
      const result = sortWhiskies(input, 'score-desc');

      expect(result).not.toBe(input);

      expect(input).toStrictEqual(list);
    });
  });

  describe('score-desc', () => {
    it('sorts by score descending (highest first)', () => {
      const result = sortWhiskies(list, 'score-desc');
      const scores = result.map((w) => w.score);

      expect(scores).toStrictEqual([92, 90, 88, 87, 85]);
    });

    it('places the highest-scored first and lowest-scored last', () => {
      const result = sortWhiskies(list, 'score-desc');

      expect(result[0]?.id).toBe('a');

      expect(result[4]?.id).toBe('b');
    });
  });

  describe('price-asc', () => {
    it('sorts by price ascending (cheapest first)', () => {
      const result = sortWhiskies(list, 'price-asc');
      const prices = result.map((w) => w.priceGbp);

      expect(prices).toStrictEqual([28, 42, 55, 65, 80]);
    });

    it('places the cheapest whisky first', () => {
      expect(sortWhiskies(list, 'price-asc')[0]?.id).toBe('b');
    });
  });

  describe('price-desc', () => {
    it('sorts by price descending (most expensive first)', () => {
      const result = sortWhiskies(list, 'price-desc');
      const prices = result.map((w) => w.priceGbp);

      expect(prices).toStrictEqual([80, 65, 55, 42, 28]);
    });

    it('places the most expensive whisky first', () => {
      expect(sortWhiskies(list, 'price-desc')[0]?.id).toBe('d');
    });
  });

  describe('age-desc', () => {
    it('sorts by age descending (oldest first)', () => {
      const result = sortWhiskies(list, 'age-desc');

      expect(result[0]?.age).toBe(14);

      expect(result[1]?.age).toBe(12);

      expect(result[2]?.age).toBe(10);
    });

    it('places all NAS whiskies after all stated-age whiskies', () => {
      const result = sortWhiskies(list, 'age-desc');
      const firstNasIndex = result.findIndex((w) => w.age === null);
      const afterFirstNas = result.slice(firstNasIndex);

      expect(afterFirstNas.every((w) => w.age === null)).toBe(true);
    });

    it('handles a list of only NAS whiskies without throwing', () => {
      const onlyNas = [whiskyNas, whiskyNas2];
      const result = sortWhiskies(onlyNas, 'age-desc');

      expect(result).toHaveLength(2);

      expect(result.every((w) => w.age === null)).toBe(true);
    });

    it('handles a list with no NAS whiskies', () => {
      const noNas = [whiskyA, whiskyB, whiskyC];
      const result = sortWhiskies(noNas, 'age-desc');

      expect(result.map((w) => w.age)).toStrictEqual([14, 12, 10]);
    });
  });

  describe('name-asc', () => {
    it('sorts alphabetically by name ascending', () => {
      const result = sortWhiskies(list, 'name-asc');
      const names = result.map((w) => w.name);

      expect(names).toStrictEqual(['Aberfeldy 12', 'Balmenach 10', 'Clynelish 14', 'Dalmore NAS', 'Edradour NAS']);
    });

    it("places 'A' names before 'Z' names", () => {
      const simple = [makeWhisky({ id: 'z', name: 'Zephyr Glen' }), makeWhisky({ id: 'a2', name: 'Aberfeldy' })];
      const result = sortWhiskies(simple, 'name-asc');

      expect(result[0]?.name).toBe('Aberfeldy');
    });
  });
});
