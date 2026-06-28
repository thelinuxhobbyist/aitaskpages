import type { Metadata } from "next";
import { MarketingPreferenceForm } from "@/app/dashboard/account/marketing-preference-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account | Dashboard | AI Jobs Market",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-secondary">Account</h2>
        <p className="mt-1 text-sm text-muted">
          Manage your email address in the account menu (top-right). Marketing
          preferences are stored here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email preferences</CardTitle>
          <CardDescription>
            Signed in as {user.email}
            {user.name ? ` (${user.name})` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarketingPreferenceForm
            marketingOptIn={user.marketingOptIn}
            unsubscribed={user.unsubscribed}
          />
        </CardContent>
      </Card>
    </div>
  );
}
