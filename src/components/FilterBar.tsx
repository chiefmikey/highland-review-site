import React from 'react';

/* eslint-disable import-x/no-relative-parent-imports */
import type { SortKey } from '../lib/sort';
import type { FlavourTag, PriceBand } from '../types';
/* eslint-enable import-x/no-relative-parent-imports */

interface FilterBarProperties {
  minScore: number;
  onClear: () => void;
  onFlavourToggle: (flavour: FlavourTag) => void;
  onMinScoreChange: (value: number) => void;
  onPriceBandToggle: (band: PriceBand) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (key: SortKey) => void;
  search: string;
  selectedFlavours: FlavourTag[];
  selectedPriceBands: PriceBand[];
  sortKey: SortKey;
}

const PRICE_BANDS: { label: string; value: PriceBand }[] = [
  { label: 'Budget (<£40)', value: 'budget' },
  { label: 'Mid (£40-70)', value: 'mid' },
  { label: 'Premium (£70-120)', value: 'premium' },
  { label: 'Luxury (>£120)', value: 'luxury' },
];

const FLAVOURS: FlavourTag[] = [
  'coastal',
  'floral',
  'fruity',
  'honey',
  'malty',
  'nutty',
  'peaty',
  'sherried',
  'smoky',
  'spicy',
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Score: High to Low', value: 'score-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Age: Oldest First', value: 'age-desc' },
];

const MIN_SCORE_OPTIONS = [80, 82, 84, 86, 88, 90, 92];

const SORT_KEYS = new Set<string>(['age-desc', 'name-asc', 'price-asc', 'price-desc', 'score-desc']);

const isSortKey = (value: string): value is SortKey => SORT_KEYS.has(value);

interface PriceBandChipProperties {
  isActive: boolean;
  label: string;
  onToggle: (value: PriceBand) => void;
  value: PriceBand;
}

const PriceBandChip = ({ isActive, label, onToggle, value }: PriceBandChipProperties): React.ReactElement => {
  const handleClick = (): void => {
    onToggle(value);
  };

  return (
    <button
      aria-pressed={isActive}
      className={`toggle-chip${isActive ? ' toggle-chip--active' : ''}`}
      type="button"
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

interface FlavourChipProperties {
  isActive: boolean;
  onToggle: (value: FlavourTag) => void;
  value: FlavourTag;
}

const FlavourChip = ({ isActive, onToggle, value }: FlavourChipProperties): React.ReactElement => {
  const handleClick = (): void => {
    onToggle(value);
  };

  return (
    <button
      aria-pressed={isActive}
      className={`toggle-chip${isActive ? ' toggle-chip--active' : ''}`}
      type="button"
      onClick={handleClick}
    >
      {value}
    </button>
  );
};

interface FilterControlsProperties {
  minScore: number;
  onClear: () => void;
  onMinScoreChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortKey: SortKey;
}

const FilterControls = ({
  minScore,
  onClear,
  onMinScoreChange,
  onSortChange,
  sortKey,
}: FilterControlsProperties): React.ReactElement => {
  const hasActiveFilters = minScore > 80;

  const handleMinScoreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onMinScoreChange(event);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onSortChange(event);
  };

  const handleClear = (): void => {
    onClear();
  };

  return (
    <div className="filter-bar__row">
      <div className="filter-bar__group filter-bar__group--inline">
        <label className="filter-label" htmlFor="min-score">
          Min Score
        </label>
        <select className="filter-select" id="min-score" value={minScore} onChange={handleMinScoreChange}>
          {MIN_SCORE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}+
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__group filter-bar__group--inline">
        <label className="filter-label" htmlFor="sort-select">
          Sort
        </label>
        <select className="filter-select" id="sort-select" value={sortKey} onChange={handleSortChange}>
          {SORT_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters ? (
        <button className="clear-filters-btn" type="button" onClick={handleClear}>
          Clear filters
        </button>
      ) : null}
    </div>
  );
};

export const FilterBar = ({
  minScore,
  onClear,
  onFlavourToggle,
  onMinScoreChange,
  onPriceBandToggle,
  onSearchChange,
  onSortChange,
  search,
  selectedFlavours,
  selectedPriceBands,
  sortKey,
}: FilterBarProperties): React.ReactElement => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(event.target.value);
  };

  const handleMinScoreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onMinScoreChange(Number(event.target.value));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;

    if (isSortKey(value)) {
      onSortChange(value);
    }
  };

  const handleClear = (): void => {
    onClear();
  };

  const handlePriceBandToggle = (band: PriceBand): void => {
    onPriceBandToggle(band);
  };

  const handleFlavourToggle = (flavour: FlavourTag): void => {
    onFlavourToggle(flavour);
  };

  return (
    <aside aria-label="Filter and sort whiskies" className="filter-bar">
      <div className="filter-bar__search">
        <label className="filter-label" htmlFor="whisky-search">
          Search
        </label>
        <input
          aria-label="Search by distillery or name"
          className="search-input"
          id="whisky-search"
          placeholder="Distillery or name..."
          type="search"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-bar__group">
        <span className="filter-label" id="price-band-label">
          Price Band
        </span>
        <div aria-labelledby="price-band-label" className="toggle-chips" role="group">
          {PRICE_BANDS.map(({ label, value }) => (
            <PriceBandChip
              key={value}
              isActive={selectedPriceBands.includes(value)}
              label={label}
              value={value}
              onToggle={handlePriceBandToggle}
            />
          ))}
        </div>
      </div>

      <div className="filter-bar__group">
        <span className="filter-label" id="flavour-label">
          Flavour
        </span>
        <div aria-labelledby="flavour-label" className="toggle-chips" role="group">
          {FLAVOURS.map((f) => (
            <FlavourChip
              key={f}
              isActive={selectedFlavours.includes(f)}
              value={f}
              onToggle={handleFlavourToggle}
            />
          ))}
        </div>
      </div>

      <FilterControls
        minScore={minScore}
        sortKey={sortKey}
        onClear={handleClear}
        onMinScoreChange={handleMinScoreChange}
        onSortChange={handleSortChange}
      />
    </aside>
  );
};
