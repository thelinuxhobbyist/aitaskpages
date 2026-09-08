/**
 * Display limits for the expert directory (/search).
 *
 * These are deliberately independent of how many experts exist in the database.
 * The page shows a fixed-size set whether there is 1 approved profile or 10,000
 * — change the numbers here to retune the page, no layout work needed.
 */
export const EXPERT_DIRECTORY_LIMITS = {
  /**
   * Cards shown in the default state, before the visitor searches. Just enough
   * to give the page some content; fewer are shown if fewer profiles exist.
   */
  defaultCards: 8,
  /** Ceiling on search results rendered at once. */
  maxSearchResults: 50,
  /**
   * Ceiling on profiles pulled from D1 for a single search. Keyword, skill and
   * service matching runs in memory after the query, so this bounds worst-case
   * request cost as the directory grows. Searches scan the most recently created
   * profiles up to this cap.
   */
  maxScannedProfiles: 500,
} as const;
