// Shared domain types for the Highland whisky review site.
// This is the stable data contract: the dataset, library logic, and components
// all build against these shapes.

/** Flavour character tags used for filtering and at-a-glance profiles. */
export type FlavourTag =
  | 'coastal'
  | 'floral'
  | 'fruity'
  | 'honey'
  | 'malty'
  | 'nutty'
  | 'peaty'
  | 'sherried'
  | 'smoky'
  | 'spicy';

/** Rough retail price band for a standard 70cl bottle (GBP). */
export type PriceBand = 'budget' | 'luxury' | 'mid' | 'premium';

export interface TastingNotes {
  nose: string;
  palate: string;
  finish: string;
}

export interface Whisky {
  /** Stable slug id, e.g. "glenmorangie-the-original-10". */
  id: string;
  name: string;
  distillery: string;
  /** Age statement in years; null for No-Age-Statement (NAS) bottlings. */
  age: number | null;
  abv: number;
  priceBand: PriceBand;
  /** Approximate retail price in GBP for the headline display. */
  priceGbp: number;
  /** Reviewer score out of 100. */
  score: number;
  flavours: FlavourTag[];
  tasting: TastingNotes;
  /** One-paragraph reviewer verdict. */
  review: string;
  /** Short region descriptor within the Highlands, e.g. "Northern Highlands". */
  subRegion: string;
}
