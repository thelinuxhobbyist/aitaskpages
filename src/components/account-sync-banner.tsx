import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountSyncBanner() {
  return (
    <Card className="border-amber-200 bg-amber-50/80">
      <CardHeader>
        <CardTitle className="text-lg">Finish setting up your account</CardTitle>
        <CardDescription className="text-amber-900/80">
          You&apos;re signed in, but your account hasn&apos;t synced to our
          database yet — so the dashboard can&apos;t load your profile or tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-amber-950">
        <p>This usually means one of these production settings is missing:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>CLERK_SECRET_KEY</strong> on Cloudflare (must be{" "}
            <code className="text-xs">sk_live_...</code>, not a test key)
          </li>
          <li>
            Clerk webhook at{" "}
            <code className="text-xs break-all">
              https://aijobsmarket.co.uk/api/webhooks/clerk
            </code>{" "}
            (events: user.created, user.updated, user.deleted)
          </li>
          <li>
            <strong>CLERK_WEBHOOK_SIGNING_SECRET</strong> set on Cloudflare
          </li>
        </ul>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild>
            <Link href="/dashboard">Try again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
