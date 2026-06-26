import React, { useMemo, useState } from 'react';

import { FilterBar } from './components/FilterBar';
import { WhiskyCard } from './components/WhiskyCard';
import { WhiskyDetail } from './components/WhiskyDetail';
import { whiskies } from './data/whiskies';
import { filterWhiskies } from './lib/filter';
import { type SortKey, sortWhiskies } from './lib/sort';
import type { FlavourTag, PriceBand } from './types';

const DEFAULT_MIN_SCORE = 80;
const DEFAULT_SORT: SortKey = 'score-desc';

interface WhiskyGridProperties {
  ids: string[];
  onSelect: (id: string) => void;
}

const WhiskyGrid = ({ ids, onSelect }: WhiskyGridProperties): React.ReactElement => {
  const items = useMemo(() => whiskies.filter((w) => ids.includes(w.id)), [ids]);

  const handleClick = (id: string): void => {
    onSelect(id);
  };

  return (
    <div className="whisky-grid">
      {items.map((whisky) => (
        <WhiskyCard key={whisky.id} whisky={whisky} onClick={handleClick} />
      ))}
    </div>
  );
};

export const App = (): React.ReactElement => {
  const [minScore, setMinScore] = useState(DEFAULT_MIN_SCORE);
  const [search, setSearch] = useState('');
  const [selectedFlavours, setSelectedFlavours] = useState<FlavourTag[]>([]);
  const [selectedPriceBands, setSelectedPriceBands] = useState<PriceBand[]>([]);
  const [selectedWhiskyId, setSelectedWhiskyId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT);

  const visibleWhiskies = useMemo(() => {
    const filtered = filterWhiskies(whiskies, {
      flavours: selectedFlavours,
      minScore,
      priceBands: selectedPriceBands,
      search,
    });

    return sortWhiskies(filtered, sortKey);
  }, [minScore, search, selectedFlavours, selectedPriceBands, sortKey]);

  const selectedWhisky = useMemo(
    () => (selectedWhiskyId === null ? undefined : whiskies.find((w) => w.id === selectedWhiskyId)),
    [selectedWhiskyId],
  );

  const handlePriceBandToggle = (band: PriceBand): void => {
    setSelectedPriceBands((previous) =>
      previous.includes(band) ? previous.filter((b) => b !== band) : [...previous, band],
    );
  };

  const handleFlavourToggle = (flavour: FlavourTag): void => {
    setSelectedFlavours((previous) =>
      previous.includes(flavour) ? previous.filter((f) => f !== flavour) : [...previous, flavour],
    );
  };

  const handleMinScoreChange = (value: number): void => { setMinScore(value); };
  const handleSearchChange = (value: string): void => { setSearch(value); };
  const handleSortChange = (key: SortKey): void => { setSortKey(key); };
  const handleWhiskySelect = (id: string): void => { setSelectedWhiskyId(id); };

  const handleClearFilters = (): void => {
    setMinScore(DEFAULT_MIN_SCORE);
    setSearch('');
    setSelectedFlavours([]);
    setSelectedPriceBands([]);
    setSortKey(DEFAULT_SORT);
  };

  const handleCloseDetail = (): void => { setSelectedWhiskyId(null); };

  const visibleIds = visibleWhiskies.map((w) => w.id);

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__inner">
          <h1 className="site-title">The Highland Review</h1>
          <p className="site-tagline">Independent tasting notes and scores for Highland single malt Scotch whiskies</p>
        </div>
      </header>

      <main className="main-layout">
        <FilterBar
          minScore={minScore}
          search={search}
          selectedFlavours={selectedFlavours}
          selectedPriceBands={selectedPriceBands}
          sortKey={sortKey}
          onClear={handleClearFilters}
          onFlavourToggle={handleFlavourToggle}
          onMinScoreChange={handleMinScoreChange}
          onPriceBandToggle={handlePriceBandToggle}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />

        <section className="results-section">
          <div className="results-header">
            <p className="results-count">
              {visibleWhiskies.length === 1 ? '1 whisky' : `${visibleWhiskies.length.toString()} whiskies`}
            </p>
          </div>

          {visibleWhiskies.length > 0 ? (
            <WhiskyGrid ids={visibleIds} onSelect={handleWhiskySelect} />
          ) : (
            <div className="no-results">
              <p>No whiskies match your current filters.</p>
              <button className="clear-filters-btn" type="button" onClick={handleClearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {selectedWhisky === undefined ? null : (
        <WhiskyDetail whisky={selectedWhisky} onClose={handleCloseDetail} />
      )}
    </div>
  );
};
