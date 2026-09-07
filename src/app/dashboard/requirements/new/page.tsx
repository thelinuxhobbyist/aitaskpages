import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ from?: string; draft?: string }>;
};

export default async function NewRequirementRedirect({ searchParams }: Props) {
  const { draft, from } = await searchParams;
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (draft) params.set("draft", draft);
  const query = params.toString();
  redirect(`/tasks/new${query ? `?${query}` : ""}`);
}
