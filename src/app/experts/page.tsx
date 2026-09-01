import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** /experts index → expert directory (filters preserved via query string). */
export default async function ExpertsIndexRedirect({ searchParams }: PageProps) {
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
  redirect(qs ? `/search?${qs}` : "/search");
}
