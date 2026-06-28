/*
 * Test files pass vi.fn() spies directly as handler props and import Testing Library
 * (a devDependency) — both are standard and these three rules do not apply to tests.
 */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/strict-void-return, import-x/no-extraneous-dependencies */
/* eslint-disable import-x/no-relative-parent-imports, simple-import-sort/imports */
import { fireEvent, render, screen } from '@testing-library/react';

import type { SortKey } from '../lib/sort';
import type { FlavourTag, PriceBand } from '../types';

import { FilterBar } from './FilterBar';
/* eslint-enable import-x/no-relative-parent-imports, simple-import-sort/imports */

// Hoisted to module scope so the same array reference is reused across renders
// (avoids react-perf/jsx-no-new-array-as-prop on inline array props).
const SELECTED_PREMIUM: PriceBand[] = ['premium'];
const SELECTED_HONEY: FlavourTag[] = ['honey'];

const defaultProps = {
  minScore: 80,
  onClear: vi.fn(),
  onFlavourToggle: vi.fn(),
  onMinScoreChange: vi.fn(),
  onPriceBandToggle: vi.fn(),
  onSearchChange: vi.fn(),
  onSortChange: vi.fn(),
  search: '',
  selectedFlavours: [] as FlavourTag[],
  selectedPriceBands: [] as PriceBand[],
  sortKey: 'score-desc' as SortKey,
};

describe('FilterBar — renders controls', () => {
  it('renders the search input', () => {
    render(<FilterBar {...defaultProps} />);

    expect(
      screen.getByRole('searchbox', { name: 'Search by distillery or name' }),
    ).toBeInTheDocument();
  });

  it('renders all four price band chips', () => {
    render(<FilterBar {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Budget (<£40)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mid (£40-70)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Premium (£70-120)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Luxury (>£120)' }),
    ).toBeInTheDocument();
  });

  it('renders all flavour chips', () => {
    render(<FilterBar {...defaultProps} />);
    const flavours: FlavourTag[] = [
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

    for (const flavour of flavours) {
      expect(screen.getByRole('button', { name: flavour })).toBeInTheDocument();
    }
  });

  it('renders the Min Score select', () => {
    render(<FilterBar {...defaultProps} />);

    expect(
      screen.getByRole('combobox', { name: 'Min Score' }),
    ).toBeInTheDocument();
  });

  it('renders the Sort select', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByRole('combobox', { name: 'Sort' })).toBeInTheDocument();
  });
});

describe('FilterBar — search interaction', () => {
  it('calls onSearchChange with the typed value', () => {
    const onSearchChange = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onSearchChange={onSearchChange}
      />,
    );

    const input = screen.getByRole('searchbox', {
      name: 'Search by distillery or name',
    });
    fireEvent.change(input, { target: { value: 'Glenmorangie' } });

    expect(onSearchChange).toHaveBeenCalledWith('Glenmorangie');
  });
});

describe('FilterBar — price band chips', () => {
  it('calls onPriceBandToggle with the band value when a chip is clicked', () => {
    const onPriceBandToggle = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onPriceBandToggle={onPriceBandToggle}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mid (£40-70)' }));

    expect(onPriceBandToggle).toHaveBeenCalledWith('mid');
  });

  it('sets aria-pressed true on selected price band chips', () => {
    render(
      <FilterBar
        {...defaultProps}
        selectedPriceBands={SELECTED_PREMIUM}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Premium (£70-120)' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets aria-pressed false on unselected price band chips', () => {
    render(
      <FilterBar
        {...defaultProps}
        selectedPriceBands={SELECTED_PREMIUM}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Budget (<£40)' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('FilterBar — flavour chips', () => {
  it('calls onFlavourToggle with the flavour value when a chip is clicked', () => {
    const onFlavourToggle = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onFlavourToggle={onFlavourToggle}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'peaty' }));

    expect(onFlavourToggle).toHaveBeenCalledWith('peaty');
  });

  it('sets aria-pressed true on selected flavour chips', () => {
    render(
      <FilterBar
        {...defaultProps}
        selectedFlavours={SELECTED_HONEY}
      />,
    );

    expect(screen.getByRole('button', { name: 'honey' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets aria-pressed false on unselected flavour chips', () => {
    render(
      <FilterBar
        {...defaultProps}
        selectedFlavours={SELECTED_HONEY}
      />,
    );

    expect(screen.getByRole('button', { name: 'peaty' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('FilterBar — Min Score select', () => {
  it('calls onMinScoreChange with a number when the select changes', () => {
    const onMinScoreChange = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onMinScoreChange={onMinScoreChange}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Min Score' }), {
      target: { value: '88' },
    });

    expect(onMinScoreChange).toHaveBeenCalledWith(88);
  });
});

describe('FilterBar — Sort select', () => {
  it('calls onSortChange with the SortKey when the select changes', () => {
    const onSortChange = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Sort' }), {
      target: { value: 'name-asc' },
    });

    expect(onSortChange).toHaveBeenCalledWith('name-asc' satisfies SortKey);
  });
});

describe('FilterBar — Clear filters button', () => {
  it('is absent when minScore is 80', () => {
    render(
      <FilterBar
        {...defaultProps}
        minScore={80}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Clear filters' }),
    ).not.toBeInTheDocument();
  });

  it('is present when minScore is greater than 80', () => {
    render(
      <FilterBar
        {...defaultProps}
        minScore={84}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Clear filters' }),
    ).toBeInTheDocument();
  });

  it('calls onClear when clicked', () => {
    const onClear = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        minScore={86}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onClear).toHaveBeenCalledOnce();
  });
});
