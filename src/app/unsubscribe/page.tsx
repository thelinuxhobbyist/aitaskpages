import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Email preferences",
  robots: { index: false },
};

type PageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const success = params.success === "1";
  const error = params.error;

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {success
              ? "You’re unsubscribed"
              : error
                ? "Link not valid"
                : "Unsubscribe"}
          </CardTitle>
          <CardDescription>
            {success
              ? "You won’t receive marketing emails from AI Task Pages anymore. Transactional emails about your account and messages will still be sent."
              : error
                ? "This unsubscribe link is missing or has expired. You can manage preferences in your dashboard instead."
                : "Use the link in your email to unsubscribe from marketing messages."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/account">Account settings</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
