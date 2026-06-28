import { redirect } from "next/navigation";

/** Enquiries are now conversations — keep old links/emails working. */
export default function EnquiriesRedirect() {
  redirect("/dashboard/conversations");
}
