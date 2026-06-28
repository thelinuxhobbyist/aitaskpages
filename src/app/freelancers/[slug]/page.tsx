import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy /freelancers/[slug] URL → new /experts/[slug] profile page. */
export default async function LegacyExpertProfileRedirect({
  params,
}: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/experts/${slug}`);
}
