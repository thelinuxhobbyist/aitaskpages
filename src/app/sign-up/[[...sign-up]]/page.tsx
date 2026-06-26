"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        forceRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
