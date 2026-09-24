import type { CatalogTerm, KeywordMap } from "@/lib/taxonomy-map";

/** Suggested "What can you help with?" topics. Stored as free-text tags. */
export const HELP_WITH_TOPICS: CatalogTerm[] = [
  "AI customer support",
  "AI receptionists",
  "Voice AI",
  "Call automation",
  "Appointment automation",
  "Invoice automation",
  "Document automation",
  "CRM automation",
  "Healthcare automation",
  "AI agents",
  "Chatbots",
  "AI strategy",
  "AI product development",
  "AI proof of concept",
  "AI productionisation",
].map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
}));

export const INDUSTRY_TOPICS: CatalogTerm[] = [
  "Dental",
  "Healthcare",
  "Legal",
  "Retail",
  "Manufacturing",
  "Financial services",
  "Professional services",
  "Logistics",
  "Education",
  "Hospitality",
].map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
}));

export const TECHNOLOGY_TOPICS: CatalogTerm[] = [
  "Twilio",
  "Salesforce",
  "HubSpot",
  "Microsoft 365",
  "Google Workspace",
  "Dentally",
  "Practice management software",
  "CRM",
  "Zapier",
  "n8n",
].map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
}));

export const EMPTY_KEYWORD_MAP: KeywordMap = [];

export const MAX_HELP_WITH = 12;
export const MAX_INDUSTRIES = 8;
export const MAX_TECHNOLOGIES = 10;
export const MAX_TOPIC_LENGTH = 60;
