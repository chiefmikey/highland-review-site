import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line import-x/no-relative-parent-imports
import type { Whisky } from '../types';

interface WhiskyDetailProperties {
  onClose: () => void;
  whisky: Whisky;
}

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: 'Budget',
  luxury: 'Luxury',
  mid: 'Mid-Range',
  premium: 'Premium',
};

const getScoreLabel = (score: number): string => {
  if (score >= 93) {
    return 'Outstanding';
  }

  if (score >= 90) {
    return 'Excellent';
  }

  if (score >= 87) {
    return 'Very Good';
  }

  if (score >= 84) {
    return 'Good';
  }

  return 'Solid';
};

const useFocusTrap = (onClose: () => void, dialogReference: React.RefObject<HTMLDivElement | null>): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || dialogReference.current === null) {
        return;
      }

      const focusable = dialogReference.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const focusableArray = Array.from(focusable);

      if (focusableArray.length === 0) {
        return;
      }

      const [first] = focusableArray;
      const last = focusableArray.at(-1);

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, dialogReference]);
};

interface TastingNotesProperties {
  finish: string;
  nose: string;
  palate: string;
}

const TastingNotesSection = ({ finish, nose, palate }: TastingNotesProperties): React.ReactElement => (
  <section className="tasting-notes">
    <h3 className="tasting-notes__heading">Tasting Notes</h3>
    <div className="tasting-notes__item">
      <h4 className="tasting-notes__label">Nose</h4>
      <p className="tasting-notes__text">{nose}</p>
    </div>
    <div className="tasting-notes__item">
      <h4 className="tasting-notes__label">Palate</h4>
      <p className="tasting-notes__text">{palate}</p>
    </div>
    <div className="tasting-notes__item">
      <h4 className="tasting-notes__label">Finish</h4>
      <p className="tasting-notes__text">{finish}</p>
    </div>
  </section>
);

export const WhiskyDetail = ({ onClose, whisky }: WhiskyDetailProperties): React.ReactElement => {
  const { abv, age, distillery, flavours, name, priceBand, priceGbp, review, score, subRegion, tasting } = whisky;

  const closeButtonReference = useRef<HTMLButtonElement>(null);
  const dialogReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeButtonReference.current?.focus();
  }, []);

  useFocusTrap(onClose, dialogReference);

  const ageLabel = age === null ? 'No Age Statement' : `${age.toString()}-Year-Old`;

  const handleCloseClick = (): void => {
    onClose();
  };

  return (
    <div
      aria-labelledby="whisky-detail-title"
      aria-modal="true"
      className="modal-overlay"
      role="dialog"
    >
      <div ref={dialogReference} className="modal-panel">
        <button
          ref={closeButtonReference}
          aria-label="Close detail panel"
          className="modal-close"
          type="button"
          onClick={handleCloseClick}
        >
          &#x2715;
        </button>

        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h2 className="modal-name" id="whisky-detail-title">
                {name}
              </h2>
              <p className="modal-distillery">
                {distillery} &mdash; {subRegion}
              </p>
            </div>
            <div className="modal-score-block">
              <span className="score-badge score-badge--large">{score}</span>
              <span className="modal-score-label">{getScoreLabel(score)}</span>
            </div>
          </div>

          <dl className="modal-specs">
            <dt>Age</dt>
            <dd>{ageLabel}</dd>
            <dt>ABV</dt>
            <dd>{abv}%</dd>
            <dt>Price</dt>
            {/* eslint-disable-next-line security/detect-object-injection */}
            <dd>£{priceGbp} &mdash; {PRICE_BAND_LABELS[priceBand]}</dd>
          </dl>

          <div className="modal-flavours">
            {flavours.map((f) => (
              <span key={f} className="flavour-chip">
                {f}
              </span>
            ))}
          </div>

          <TastingNotesSection finish={tasting.finish} nose={tasting.nose} palate={tasting.palate} />

          <section className="modal-verdict">
            <h3 className="modal-verdict__heading">Verdict</h3>
            <p className="modal-verdict__text">{review}</p>
          </section>
        </div>
      </div>
    </div>
  );
};
