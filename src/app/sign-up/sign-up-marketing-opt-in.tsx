"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MARKETING_OPT_IN_COOKIE } from "@/lib/marketing-preferences";

function setMarketingCookie(enabled: boolean) {
  const base = `${MARKETING_OPT_IN_COOKIE}=; path=/; SameSite=Lax`;
  if (enabled) {
    document.cookie = `${MARKETING_OPT_IN_COOKIE}=1; path=/; max-age=3600; SameSite=Lax`;
  } else {
    document.cookie = `${base}; max-age=0`;
  }
}

export function SignUpMarketingOptIn() {
  return (
    <div className="mb-6 flex w-full max-w-[400px] items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <Checkbox
        id="sign-up-marketing-opt-in"
        onCheckedChange={(value) => setMarketingCookie(value === true)}
      />
      <Label
        htmlFor="sign-up-marketing-opt-in"
        className="cursor-pointer text-sm leading-snug font-normal text-secondary"
      >
        I&apos;d like to receive product updates and occasional marketing
        emails.
      </Label>
    </div>
  );
}
