/*
 * Test files pass vi.fn() spies directly as handler props and import Testing Library
 * (a devDependency) — both are standard and these three rules do not apply to tests.
 */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/strict-void-return, import-x/no-extraneous-dependencies */
/* eslint-disable import-x/no-relative-parent-imports, simple-import-sort/imports */
import { fireEvent, render, screen } from '@testing-library/react';

import type { Whisky } from '../types';

import { WhiskyCard } from './WhiskyCard';
/* eslint-enable import-x/no-relative-parent-imports, simple-import-sort/imports */

const makeWhisky = (overrides: Partial<Whisky> = {}): Whisky => ({
  abv: 43,
  age: 12,
  distillery: 'Glenmorangie',
  flavours: ['honey', 'floral'],
  id: 'glenmorangie-original-10',
  name: 'The Original',
  priceBand: 'mid',
  priceGbp: 45,
  review: 'A lovely dram with notes of honey and orange blossom.',
  score: 88,
  subRegion: 'Northern Highlands',
  tasting: {
    finish: 'Clean and medium-long.',
    nose: 'Light honey and floral.',
    palate: 'Creamy vanilla and citrus.',
  },
  ...overrides,
});

describe('WhiskyCard — renders card fields', () => {
  it('renders the whisky name as a heading', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky()}
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'The Original' }),
    ).toBeInTheDocument();
  });

  it('renders the distillery name', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky()}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Glenmorangie')).toBeInTheDocument();
  });

  it('renders the numeric score', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ score: 88 })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('renders ABV', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ abv: 43 })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('43% ABV')).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ priceGbp: 45 })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/£45/u)).toBeInTheDocument();
  });

  it('renders the flavour chips', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ flavours: ['honey', 'floral'] })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('honey')).toBeInTheDocument();
    expect(screen.getByText('floral')).toBeInTheDocument();
  });

  it('renders price band label in parens', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ priceBand: 'mid' })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('(Mid-Range)')).toBeInTheDocument();
  });
});

describe('WhiskyCard — age label', () => {
  it('renders NAS when age is null', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ age: null })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('NAS')).toBeInTheDocument();
  });

  it('renders age in years when age is a number', () => {
    render(
      <WhiskyCard
        whisky={makeWhisky({ age: 18 })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('18 yr')).toBeInTheDocument();
  });
});

describe('WhiskyCard — click and keyboard interactions', () => {
  it('calls onClick with whisky id when card is clicked', () => {
    const onClick = vi.fn();
    render(
      <WhiskyCard
        whisky={makeWhisky()}
        onClick={onClick}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'View details for The Original by Glenmorangie',
      }),
    );

    expect(onClick).toHaveBeenCalledWith('glenmorangie-original-10');
  });

  it('calls onClick with whisky id when Enter is pressed', () => {
    const onClick = vi.fn();
    render(
      <WhiskyCard
        whisky={makeWhisky()}
        onClick={onClick}
      />,
    );

    fireEvent.keyDown(
      screen.getByRole('button', {
        name: 'View details for The Original by Glenmorangie',
      }),
      {
        key: 'Enter',
      },
    );

    expect(onClick).toHaveBeenCalledWith('glenmorangie-original-10');
  });

  it('calls onClick with whisky id when Space is pressed', () => {
    const onClick = vi.fn();
    render(
      <WhiskyCard
        whisky={makeWhisky()}
        onClick={onClick}
      />,
    );

    fireEvent.keyDown(
      screen.getByRole('button', {
        name: 'View details for The Original by Glenmorangie',
      }),
      {
        key: ' ',
      },
    );

    expect(onClick).toHaveBeenCalledWith('glenmorangie-original-10');
  });
});

describe('WhiskyCard — review truncation', () => {
  it('displays the full review when it is 150 characters or fewer', () => {
    const shortReview = 'A short review.';
    render(
      <WhiskyCard
        whisky={makeWhisky({ review: shortReview })}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText(shortReview)).toBeInTheDocument();
  });

  it('truncates the review to 150 chars with ellipsis when longer', () => {
    const longReview = `${'A'.repeat(60)} ${'B'.repeat(60)} ${'C'.repeat(60)}`;
    render(
      <WhiskyCard
        whisky={makeWhisky({ review: longReview })}
        onClick={vi.fn()}
      />,
    );

    const reviewElement = screen.getByText(/\.{3}/u);

    expect(reviewElement.textContent).toHaveLength(153); // 150 trimmed chars + '...'
    expect(reviewElement.textContent?.endsWith('...')).toBe(true);
  });
});
