import React from 'react';

// eslint-disable-next-line import-x/no-relative-parent-imports
import type { Whisky } from '../types';

interface WhiskyCardProperties {
  onClick: (id: string) => void;
  whisky: Whisky;
}

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: 'Budget',
  luxury: 'Luxury',
  mid: 'Mid-Range',
  premium: 'Premium',
};

const getScoreClass = (score: number): string => {
  if (score >= 90) {
    return 'score-badge score-badge--high';
  }

  if (score >= 85) {
    return 'score-badge score-badge--mid';
  }

  return 'score-badge score-badge--standard';
};

export const WhiskyCard = ({ onClick, whisky }: WhiskyCardProperties): React.ReactElement => {
  const { abv, age, distillery, flavours, id, name, priceBand, priceGbp, review, score } = whisky;

  const ageLabel = age === null ? 'NAS' : `${age.toString()} yr`;
  const truncatedReview = review.length > 150 ? `${review.slice(0, 150).trimEnd()}...` : review;

  const handleClick = (): void => {
    onClick(id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(id);
    }
  };

  return (
    <div
      aria-label={`View details for ${name} by ${distillery}`}
      className="whisky-card"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="whisky-card__header">
        <div className="whisky-card__title-block">
          <h2 className="whisky-card__name">{name}</h2>
          <p className="whisky-card__distillery">{distillery}</p>
        </div>
        <span className={getScoreClass(score)}>{score}</span>
      </div>

      <div className="whisky-card__meta">
        <span className="whisky-card__meta-item">{ageLabel}</span>
        <span className="whisky-card__meta-sep">·</span>
        <span className="whisky-card__meta-item">{abv}% ABV</span>
        <span className="whisky-card__meta-sep">·</span>
        { }
        <span className="whisky-card__meta-item">
          £{priceGbp}
          <span className="whisky-card__price-band"> ({PRICE_BAND_LABELS[priceBand]})</span>
        </span>
      </div>

      <div className="whisky-card__flavours">
        {flavours.map((f) => (
          <span key={f} className="flavour-chip">
            {f}
          </span>
        ))}
      </div>

      <p className="whisky-card__review">{truncatedReview}</p>
    </div>
  );
};
