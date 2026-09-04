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
          You&apos;re signed in, but we couldn&apos;t finish creating your
          account yet — so the dashboard can&apos;t load your profile or tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-amber-950">
        <p>
          This is usually temporary. Wait a few seconds and try again. If it
          keeps happening, sign out and sign back in, or contact support.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button asChild>
            <Link href="/account/setup">Try again</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
