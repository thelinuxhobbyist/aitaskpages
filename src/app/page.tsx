import type { Metadata } from "next";
import { DirectoryPage } from "@/app/freelancers/directory-page";

export const metadata: Metadata = {
  title: "AI Jobs Market — UK AI Expert Directory",
  description:
    "Find UK AI freelancers and consultants. Search by skills, services, location, and hourly rate.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <DirectoryPage searchParams={params} clearFiltersHref="/" />;
}
