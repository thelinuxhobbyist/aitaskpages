import type { Requirement } from "@/db/schema";

export const BUSINESS_TYPES = [
  { value: "dental_practice", label: "Dental Practice" },
  { value: "manufacturing", label: "Manufacturing Company" },
  { value: "law_firm", label: "Law Firm" },
  { value: "startup", label: "Startup" },
  { value: "sme", label: "SME" },
  { value: "enterprise", label: "Enterprise" },
  { value: "healthcare", label: "Healthcare Organisation" },
  { value: "retail", label: "Retail Business" },
  { value: "financial_services", label: "Financial Services" },
  { value: "other", label: "Other Business" },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"];

const LABELS = new Map(BUSINESS_TYPES.map((t) => [t.value, t.label]));

export function getBusinessTypeLabel(value: string | null | undefined): string {
  if (!value) return "Business";
  return LABELS.get(value as BusinessType) ?? "Business";
}

export function truncateDescription(text: string, maxLength = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function formatRequirementLocation(
  location: string | null,
  remoteOk: boolean
): string | null {
  const parts: string[] = [];
  if (location?.trim()) parts.push(location.trim());
  if (remoteOk) parts.push("Remote OK");
  return parts.length > 0 ? parts.join(" · ") : null;
}

export type PublicRequirementSummary = {
  id: number;
  title: string;
  descriptionExcerpt: string;
  businessType: string;
  businessTypeLabel: string;
  budget: string | null;
  location: string | null;
  remoteOk: boolean;
  locationLabel: string | null;
  createdAt: string;
  skillNames: string[];
  serviceNames: string[];
};

export function toPublicSummary(
  req: Requirement & {
    skills: { skill: { name: string } }[];
    services: { service: { name: string } }[];
  }
): PublicRequirementSummary {
  const businessType = req.businessType ?? "sme";
  return {
    id: req.id,
    title: req.title,
    descriptionExcerpt: truncateDescription(req.description),
    businessType,
    businessTypeLabel: getBusinessTypeLabel(businessType),
    budget: req.budget,
    location: req.location,
    remoteOk: req.remoteOk ?? false,
    locationLabel: formatRequirementLocation(req.location, req.remoteOk ?? false),
    createdAt: req.createdAt,
    skillNames: req.skills.map((s) => s.skill.name),
    serviceNames: req.services.map((s) => s.service.name),
  };
}
