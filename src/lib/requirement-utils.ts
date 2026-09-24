import type { Requirement } from "@/db/schema";
import {
  parseCustomServices,
  parseCustomSkills,
} from "@/lib/profile-utils";

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

/** Legacy fallback when older tasks have no company name stored. */
export function getBusinessTypeLabel(value: string | null | undefined): string {
  if (!value) return "Company";
  return LABELS.get(value as BusinessType) ?? "Company";
}

export function getRequirementCompanyLabel(
  companyName: string | null | undefined,
  businessType: string | null | undefined
): string {
  const trimmed = companyName?.trim();
  if (trimmed) return trimmed;
  return getBusinessTypeLabel(businessType);
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
  /** Company name shown on public task listings. */
  companyName: string;
  budget: string | null;
  location: string | null;
  remoteOk: boolean;
  locationLabel: string | null;
  createdAt: string;
  skillNames: string[];
  serviceNames: string[];
  industry: string | null;
  problem: string | null;
  timeline: string | null;
  technologyNames: string[];
};

export function getRequirementSkillLabels(req: {
  customSkills?: string | null;
  skills: { skill: { name: string } }[];
}): string[] {
  const custom = parseCustomSkills(req.customSkills);
  return custom.length > 0 ? custom : req.skills.map((s) => s.skill.name);
}

export function getRequirementServiceLabels(req: {
  customServices?: string | null;
  services: { service: { name: string } }[];
}): string[] {
  const custom = parseCustomServices(req.customServices);
  return custom.length > 0
    ? custom
    : req.services.map((s) => s.service.name);
}

export function toPublicSummary(
  req: Requirement & {
    skills: { skill: { name: string } }[];
    services: { service: { name: string } }[];
  }
): PublicRequirementSummary {
  return {
    id: req.id,
    title: req.title,
    descriptionExcerpt: truncateDescription(req.description),
    companyName: getRequirementCompanyLabel(req.companyName, req.businessType),
    budget: req.budget,
    location: req.location,
    remoteOk: req.remoteOk ?? false,
    locationLabel: formatRequirementLocation(req.location, req.remoteOk ?? false),
    createdAt: req.createdAt,
    skillNames: getRequirementSkillLabels(req),
    serviceNames: getRequirementServiceLabels(req),
    industry: req.industry?.trim() || null,
    problem: req.problem?.trim() || null,
    timeline: req.timeline?.trim() || null,
    technologyNames: parseCustomSkills(req.technologies),
  };
}
