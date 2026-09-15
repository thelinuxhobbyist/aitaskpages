export const RATE_CURRENCIES = [
  { code: "GBP", label: "GBP · £" },
  { code: "USD", label: "USD · $" },
  { code: "EUR", label: "EUR · €" },
  { code: "CAD", label: "CAD · $" },
  { code: "AUD", label: "AUD · $" },
  { code: "NZD", label: "NZD · $" },
  { code: "CHF", label: "CHF" },
  { code: "SEK", label: "SEK" },
  { code: "NOK", label: "NOK" },
  { code: "DKK", label: "DKK" },
  { code: "PLN", label: "PLN" },
  { code: "INR", label: "INR · ₹" },
  { code: "SGD", label: "SGD · $" },
  { code: "JPY", label: "JPY · ¥" },
  { code: "ZAR", label: "ZAR" },
  { code: "AED", label: "AED" },
  { code: "BRL", label: "BRL" },
  { code: "MXN", label: "MXN" },
] as const;

export type RateCurrency = (typeof RATE_CURRENCIES)[number]["code"];

export const DEFAULT_RATE_CURRENCY: RateCurrency = "GBP";

const RATE_CURRENCY_SET = new Set<string>(
  RATE_CURRENCIES.map((item) => item.code)
);

export function isRateCurrency(value: unknown): value is RateCurrency {
  return typeof value === "string" && RATE_CURRENCY_SET.has(value);
}

export function normalizeRateCurrency(value: unknown): RateCurrency {
  return isRateCurrency(value) ? value : DEFAULT_RATE_CURRENCY;
}

/** Display an expert's indicative rate in the currency they chose. */
export function formatHourlyRate(
  amount: number | null | undefined,
  currency?: string | null
): string | null {
  if (amount == null || Number.isNaN(Number(amount))) return null;
  const code = normalizeRateCurrency(currency);
  try {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}/hr`;
  } catch {
    return `${amount} ${code}/hr`;
  }
}
