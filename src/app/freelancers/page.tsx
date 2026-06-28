import { permanentRedirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy /freelancers URL → directory homepage (filters preserved). */
export default async function LegacyFreelancersRedirect({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    }
  }

  const qs = query.toString();
  permanentRedirect(qs ? `/?${qs}` : "/");
}
