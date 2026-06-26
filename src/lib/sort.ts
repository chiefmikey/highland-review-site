// eslint-disable-next-line import-x/no-relative-parent-imports
import type { Whisky } from '../types';

export type SortKey = 'age-desc' | 'name-asc' | 'price-asc' | 'price-desc' | 'score-desc';

export const sortWhiskies = (list: Whisky[], key: SortKey): Whisky[] => {
  const sorted = [...list];

  sorted.sort((a, b): number => {
    switch (key) {
      case 'age-desc': {
        if (a.age === null && b.age === null) {
          return 0;
        }

        if (a.age === null) {
          return 1;
        }

        if (b.age === null) {
          return -1;
        }

        return b.age - a.age;
      }

      case 'name-asc': {
        return a.name.localeCompare(b.name);
      }

      case 'price-asc': {
        return a.priceGbp - b.priceGbp;
      }

      case 'price-desc': {
        return b.priceGbp - a.priceGbp;
      }

      case 'score-desc': {
        return b.score - a.score;
      }

      default: {
        return 0;
      }
    }
  });

  return sorted;
};
