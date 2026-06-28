import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Personalised opportunities link to the public requirement detail page. */
export default async function OpportunityDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/requirements/${id}`);
}
