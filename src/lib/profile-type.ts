export const PROFILE_TYPES = ["individual", "company"] as const;

export type ProfileType = (typeof PROFILE_TYPES)[number];

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  individual: "Individual",
  company: "Company",
};

export function isProfileType(value: unknown): value is ProfileType {
  return value === "individual" || value === "company";
}

export function parseProfileType(
  value: string | null | undefined
): ProfileType {
  return value === "company" ? "company" : "individual";
}

export function isCompanyProfile(profile: {
  profileType?: string | null;
}): boolean {
  return profile.profileType === "company";
}

export function profileTypeLabel(profile: {
  profileType?: string | null;
}): string {
  return isCompanyProfile(profile)
    ? PROFILE_TYPE_LABELS.company
    : PROFILE_TYPE_LABELS.individual;
}
