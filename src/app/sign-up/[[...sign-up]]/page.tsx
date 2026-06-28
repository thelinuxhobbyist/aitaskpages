"use client";

import { SignUp } from "@clerk/nextjs";
import { SignUpMarketingOptIn } from "@/app/sign-up/sign-up-marketing-opt-in";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <SignUpMarketingOptIn />
      <SignUp
        routing="path"
        path="/sign-up"
        forceRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
