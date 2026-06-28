/** Escape a value for CSV (RFC 4180). */
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ];
  return lines.join("\r\n") + "\r\n";
}

function isoTimestamp(ms: number | null | undefined): string {
  if (ms == null || ms <= 0) return "";
  return new Date(ms).toISOString();
}

function yesNo(value: boolean | null | undefined): string {
  return value ? "yes" : "no";
}

export type UserExportRow = {
  userId: number;
  email: string;
  name: string;
  accountType: string;
  registeredAt: string;
  lastLogin: string;
  lastUpdated: string;
  hasExpertProfile: boolean;
  expertProfileName: string;
  expertSlug: string;
  expertLocation: string;
  expertProfileStatus: string;
  expertProfileCreatedAt: string;
  marketingOptIn: boolean;
  unsubscribed: boolean;
  plan: string;
  role: string;
  accountStatus: string;
  clerkUserId: string;
};

export function userExportHeaders(): string[] {
  return [
    "user_id",
    "email",
    "name",
    "account_type",
    "registered_at",
    "last_login",
    "last_updated",
    "has_expert_profile",
    "expert_profile_name",
    "expert_slug",
    "expert_location",
    "expert_profile_status",
    "expert_profile_created_at",
    "marketing_opt_in",
    "unsubscribed",
    "plan",
    "role",
    "account_status",
    "clerk_user_id",
  ];
}

export function userExportToRow(row: UserExportRow): unknown[] {
  return [
    row.userId,
    row.email,
    row.name,
    row.accountType,
    row.registeredAt,
    row.lastLogin,
    row.lastUpdated,
    yesNo(row.hasExpertProfile),
    row.expertProfileName,
    row.expertSlug,
    row.expertLocation,
    row.expertProfileStatus,
    row.expertProfileCreatedAt,
    yesNo(row.marketingOptIn),
    yesNo(row.unsubscribed),
    row.plan,
    row.role,
    row.accountStatus,
    row.clerkUserId,
  ];
}

export { isoTimestamp };
