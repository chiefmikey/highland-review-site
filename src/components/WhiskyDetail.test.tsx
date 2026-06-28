/*
 * Test files pass vi.fn() spies directly as handler props and import Testing Library
 * (a devDependency) — both are standard and these three rules do not apply to tests.
 */
/* eslint-disable react/jsx-handler-names, @typescript-eslint/strict-void-return, import-x/no-extraneous-dependencies */
/* eslint-disable import-x/no-relative-parent-imports, simple-import-sort/imports */
import { fireEvent, render, screen } from '@testing-library/react';

import type { Whisky } from '../types';

import { WhiskyDetail } from './WhiskyDetail';
/* eslint-enable import-x/no-relative-parent-imports, simple-import-sort/imports */

const makeWhisky = (overrides: Partial<Whisky> = {}): Whisky => ({
  abv: 46,
  age: 12,
  distillery: 'Dalmore',
  flavours: ['sherried', 'nutty', 'spicy'],
  id: 'dalmore-12',
  name: 'Dalmore 12',
  priceBand: 'premium',
  priceGbp: 75,
  review: 'Rich and complex with dried fruits and spice.',
  score: 88,
  subRegion: 'Northern Highlands',
  tasting: {
    finish: 'Long and warming with orange peel.',
    nose: 'Rich sherry, orange marmalade, dark chocolate.',
    palate: 'Dried fruits, cinnamon, nutmeg.',
  },
  ...overrides,
});

describe('WhiskyDetail — renders core content', () => {
  it('renders as a dialog with aria-modal', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('renders the whisky name', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Dalmore 12')).toBeInTheDocument();
  });

  it('renders the distillery and subRegion', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    // The distillery paragraph renders as "Dalmore — Northern Highlands"; use getAllByText
    // because "Dalmore" also appears inside the heading "Dalmore 12".
    const distilleryMatches = screen.getAllByText(/Dalmore/u);

    expect(distilleryMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Northern Highlands/u)).toBeInTheDocument();
  });

  it('renders the numeric score', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 88 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('88')).toBeInTheDocument();
  });
});

describe('WhiskyDetail — tasting notes', () => {
  it('renders the nose tasting note', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Rich sherry, orange marmalade, dark chocolate.'),
    ).toBeInTheDocument();
  });

  it('renders the palate tasting note', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Dried fruits, cinnamon, nutmeg.'),
    ).toBeInTheDocument();
  });

  it('renders the finish tasting note', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Long and warming with orange peel.'),
    ).toBeInTheDocument();
  });
});

describe('WhiskyDetail — flavour tags', () => {
  it('renders all flavour chips', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ flavours: ['sherried', 'nutty', 'spicy'] })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('sherried')).toBeInTheDocument();
    expect(screen.getByText('nutty')).toBeInTheDocument();
    expect(screen.getByText('spicy')).toBeInTheDocument();
  });
});

describe('WhiskyDetail — specs', () => {
  it('renders age as X-Year-Old when age is a number', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ age: 12 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('12-Year-Old')).toBeInTheDocument();
  });

  it('renders No Age Statement when age is null', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ age: null })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('No Age Statement')).toBeInTheDocument();
  });

  it('renders the price band label', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ priceBand: 'premium' })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText(/Premium/u)).toBeInTheDocument();
  });
});

describe('WhiskyDetail — score labels', () => {
  it('renders Outstanding for score >= 93', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 94 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Outstanding')).toBeInTheDocument();
  });

  it('renders Excellent for score >= 90 and < 93', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 91 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('renders Very Good for score >= 87 and < 90', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 87 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });

  it('renders Good for score >= 84 and < 87', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 85 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders Solid for score below 84', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky({ score: 82 })}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Solid')).toBeInTheDocument();
  });
});

describe('WhiskyDetail — close interactions', () => {
  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close detail panel' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed on the document', () => {
    const onClose = vi.fn();
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('WhiskyDetail — review text', () => {
  it('renders the full review text in the verdict section', () => {
    render(
      <WhiskyDetail
        whisky={makeWhisky()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Rich and complex with dried fruits and spice.'),
    ).toBeInTheDocument();
  });
});
