// eslint-disable-next-line import-x/no-relative-parent-imports
import type { FlavourTag, PriceBand, Whisky } from '../types';

export interface FilterCriteria {
  flavours?: FlavourTag[];
  minScore?: number;
  priceBands?: PriceBand[];
  search?: string;
}

const matchesSearch = (whisky: Whisky, search: string): boolean => {
  const term = search.toLowerCase();

  return whisky.name.toLowerCase().includes(term) || whisky.distillery.toLowerCase().includes(term);
};

const matchesPriceBand = (whisky: Whisky, priceBands: PriceBand[]): boolean =>
  priceBands.includes(whisky.priceBand);

const matchesFlavours = (whisky: Whisky, flavours: FlavourTag[]): boolean =>
  flavours.some((f) => whisky.flavours.includes(f));

export const filterWhiskies = (list: Whisky[], criteria: FilterCriteria): Whisky[] => {
  const { flavours, minScore, priceBands, search } = criteria;

  return list.filter((whisky) => {
    if (search !== undefined && search.trim() !== '' && !matchesSearch(whisky, search)) {
      return false;
    }

    if (priceBands !== undefined && priceBands.length > 0 && !matchesPriceBand(whisky, priceBands)) {
      return false;
    }

    if (flavours !== undefined && flavours.length > 0 && !matchesFlavours(whisky, flavours)) {
      return false;
    }

    if (minScore !== undefined && whisky.score < minScore) {
      return false;
    }

    return true;
  });
};
